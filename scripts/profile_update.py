#!/usr/bin/env python3
"""
profile_update.py: apply an inference patch to the auto-inferred profile.

The lenny-actualize skill calls this at the end of each invocation with a
JSON patch describing what was observed. The script merges the patch into
`<home>/.lenny-actualize/profiles/default.yml`, applying the inference rules
documented in `references/profile_schema.yml`:

  - Existing facet match (same role, similar domain): reinforce — weight
    capped at 1.0, last_observed = today, observations list capped at 10.
  - New facet: appended with weight=0.2, first_observed/last_observed = today.
  - Decay: facets with last_observed older than 180 days have weight halved
    each subsequent month; facets below 0.1 are moved to dormant_facets.
  - Manual edits (label, current_focus already populated) are preserved
    unless `replace_label` / `replace_focus` is set on the observation.

Patch shape (JSON, on stdin or via --json):

  {
    "facet_observations": [
      {
        "match": {"role": "founder", "domain": "medtech"},
        "label": "Founder of medtech AI compliance startup",
        "current_focus": "Ketryx GTM, AI-validated tools positioning",
        "stage": "scale-early",
        "tenure": "2-plus-years",
        "observation": "User mentioned 'we're working on Ketryx ICP'",
        "replace_label": false,
        "replace_focus": false
      }
    ],
    "interest_tags_add": ["non-fiction reader"],
    "ongoing_initiatives_add": ["Q2 prospecting plan"],
    "biases_add": [],
    "decay": true
  }

Usage:
  echo '{"facet_observations": [...]}' | python3 profile_update.py --json -
  python3 profile_update.py --json '{"decay": true}'
  python3 profile_update.py --decay
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from paths import DEFAULT_SLUG, profile_path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip install pyyaml")


SCHEMA_VERSION = "2.0"
WEIGHT_INCREMENT = 0.1
NEW_FACET_WEIGHT = 0.2
WEIGHT_CAP = 1.0
MAX_OBSERVATIONS = 10
DECAY_GRACE_DAYS = 180
DORMANT_THRESHOLD = 0.1


def load_profile(path: Path) -> dict:
    if not path.exists():
        return {
            "facets": [],
            "interest_tags": [],
            "ongoing_initiatives": [],
            "known_biases": [],
            "dormant_facets": [],
            "meta": {
                "last_updated": None,
                "inference_runs": 0,
                "schema_version": SCHEMA_VERSION,
            },
        }
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as e:
        sys.exit(f"profile YAML malformed: {e}")
    data.setdefault("facets", [])
    data.setdefault("interest_tags", [])
    data.setdefault("ongoing_initiatives", [])
    data.setdefault("known_biases", [])
    data.setdefault("dormant_facets", [])
    data.setdefault("meta", {"last_updated": None, "inference_runs": 0,
                             "schema_version": SCHEMA_VERSION})
    return data


def find_facet_match(facets: list[dict], match: dict) -> dict | None:
    role = match.get("role")
    domain = match.get("domain")
    for f in facets:
        if role and f.get("role") != role:
            continue
        if domain and f.get("domain") and f["domain"] != domain:
            # Permissive: same role + null domain on existing facet still matches.
            continue
        return f
    return None


def apply_observation(facets: list[dict], obs: dict, today: str) -> tuple[str, dict]:
    """Reinforce a matching facet or append a new one. Returns (action, facet)."""
    match = obs.get("match", {})
    f = find_facet_match(facets, match)
    if f:
        f["weight"] = round(min(WEIGHT_CAP, float(f.get("weight", 0.2)) + WEIGHT_INCREMENT), 3)
        f["last_observed"] = today
        obs_text = obs.get("observation")
        if obs_text:
            obs_list = f.setdefault("observations", [])
            obs_list.append(obs_text)
            if len(obs_list) > MAX_OBSERVATIONS:
                del obs_list[: len(obs_list) - MAX_OBSERVATIONS]
        if not f.get("label") or obs.get("replace_label"):
            if obs.get("label"):
                f["label"] = obs["label"]
        if not f.get("current_focus") or obs.get("replace_focus"):
            if obs.get("current_focus"):
                f["current_focus"] = obs["current_focus"]
        if obs.get("stage") and not f.get("company_stage"):
            f["company_stage"] = obs["stage"]
        if obs.get("tenure") and not f.get("tenure_in_role"):
            f["tenure_in_role"] = obs["tenure"]
        return "reinforced", f

    new_facet = {
        "label": obs.get("label") or "",
        "role": match.get("role") or "other",
        "company_stage": obs.get("stage") or "n/a",
        "tenure_in_role": obs.get("tenure") or "n/a",
        "domain": match.get("domain") or "other",
        "current_focus": obs.get("current_focus") or "",
        "weight": NEW_FACET_WEIGHT,
        "first_observed": today,
        "last_observed": today,
        "observations": [obs["observation"]] if obs.get("observation") else [],
    }
    facets.append(new_facet)
    return "added", new_facet


def apply_decay(facets: list[dict], dormant: list[dict], today_iso: str) -> tuple[int, int]:
    """Halve weight of facets older than 180 days (per subsequent month).
    Move facets below 0.1 to dormant_facets. Returns (decayed, dormant-moved)."""
    today = dt.date.fromisoformat(today_iso)
    decayed = 0
    moved = 0
    keep = []
    for f in facets:
        last = f.get("last_observed")
        if not last:
            keep.append(f)
            continue
        try:
            last_d = dt.date.fromisoformat(last)
        except ValueError:
            keep.append(f)
            continue
        days = (today - last_d).days
        if days <= DECAY_GRACE_DAYS:
            keep.append(f)
            continue
        months_overdue = (days - DECAY_GRACE_DAYS) // 30 + 1
        new_w = float(f.get("weight", 0.2))
        for _ in range(months_overdue):
            new_w *= 0.5
        if new_w < DORMANT_THRESHOLD:
            f["weight"] = round(new_w, 3)
            dormant.append(f)
            moved += 1
        else:
            f["weight"] = round(new_w, 3)
            keep.append(f)
            decayed += 1
    facets[:] = keep
    return decayed, moved


def add_unique(target: list, items: list) -> int:
    added = 0
    for it in items or []:
        if it and it not in target:
            target.append(it)
            added += 1
    return added


def write_profile(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.safe_dump(data, sort_keys=False, allow_unicode=True),
                    encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", default=DEFAULT_SLUG)
    ap.add_argument("--json", default=None,
                    help="JSON patch (string), or '-' to read from stdin")
    ap.add_argument("--decay", action="store_true",
                    help="apply decay sweep (equivalent to --json '{\"decay\": true}')")
    args = ap.parse_args()

    if args.json == "-":
        patch = json.loads(sys.stdin.read() or "{}")
    elif args.json:
        patch = json.loads(args.json)
    else:
        patch = {}

    if args.decay:
        patch.setdefault("decay", True)

    path = profile_path(args.slug)
    profile = load_profile(path)

    today = dt.date.today().isoformat()

    summary = {"reinforced": 0, "added": 0, "tags_added": 0,
               "initiatives_added": 0, "biases_added": 0,
               "decayed": 0, "moved_dormant": 0}

    for obs in patch.get("facet_observations", []) or []:
        action, _ = apply_observation(profile["facets"], obs, today)
        summary[action] += 1

    summary["tags_added"] = add_unique(profile["interest_tags"],
                                       patch.get("interest_tags_add", []))
    summary["initiatives_added"] = add_unique(profile["ongoing_initiatives"],
                                              patch.get("ongoing_initiatives_add", []))
    summary["biases_added"] = add_unique(profile["known_biases"],
                                         patch.get("biases_add", []))

    if patch.get("decay"):
        d, m = apply_decay(profile["facets"], profile["dormant_facets"], today)
        summary["decayed"] = d
        summary["moved_dormant"] = m

    profile["facets"].sort(key=lambda f: f.get("weight", 0), reverse=True)

    profile["meta"]["last_updated"] = today
    profile["meta"]["inference_runs"] = profile["meta"].get("inference_runs", 0) + 1
    profile["meta"]["schema_version"] = SCHEMA_VERSION

    write_profile(path, profile)
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
