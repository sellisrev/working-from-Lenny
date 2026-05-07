#!/usr/bin/env python3
"""
weekly_refresh.py: orchestrate the weekly maintenance pipeline.

Runs in sequence:
  1. process_drop.py             — pick up any manual lennysdata.com drops
  2. fetch_how_i_ai.py --skip-existing
  3. fetch_lenny_yt.py  --skip-existing
  4. parse_corpus.py             — re-normalize the row table
  5. guest_tracker.py --rebuild  — refresh repeat-guest index

Then updates `<corpus>/_state.json.last_yt_refresh` and appends one block to
`knowledge/CHANGELOG.md` under `## YYYY-MM-DD weekly-refresh` summarizing
what changed.

Idempotent: each sub-step is already idempotent or skip-existing.

Usage:
  python3 weekly_refresh.py --corpus <path>
  python3 weekly_refresh.py --corpus <path> --dry-run
  python3 weekly_refresh.py --corpus <path> --skip-yt   # only manual drop + parse
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import subprocess
import sys
from pathlib import Path


def run_step(label: str, cmd: list[str], *, dry_run: bool) -> dict:
    print(f"\n=== {label} ===")
    print("  $ " + " ".join(cmd))
    if dry_run:
        return {"label": label, "skipped": True}
    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.stdout:
        print(proc.stdout.rstrip())
    if proc.returncode != 0:
        if proc.stderr:
            print(proc.stderr.rstrip(), file=sys.stderr)
        return {"label": label, "rc": proc.returncode, "error": proc.stderr.strip()[:300]}
    return {"label": label, "rc": 0, "stdout_tail": proc.stdout.rstrip().splitlines()[-3:]}


def update_state(state_path: Path) -> None:
    if state_path.exists():
        try:
            state = json.loads(state_path.read_text(encoding="utf-8"))
        except Exception:
            state = {}
    else:
        state = {}
    state["last_yt_refresh"] = dt.date.today().isoformat()
    state.setdefault("last_lennysdata_pull", None)
    state.setdefault("last_reminder_shown", None)
    state_path.write_text(json.dumps(state, indent=2), encoding="utf-8")


def append_changelog(changelog: Path, results: list[dict]) -> None:
    today = dt.date.today().isoformat()
    block = [f"\n## {today} weekly-refresh"]
    for r in results:
        if r.get("skipped"):
            block.append(f"- {r['label']}: (dry-run, skipped)")
            continue
        if r.get("rc") != 0:
            block.append(f"- {r['label']}: FAILED ({r.get('error', '')[:120]})")
            continue
        tail = " | ".join(r.get("stdout_tail") or [])[:200]
        block.append(f"- {r['label']}: ok ({tail})")

    if changelog.exists():
        existing = changelog.read_text(encoding="utf-8")
    else:
        existing = "# Changelog\n\n"
    insert_marker = "<!-- entries below this line -->"
    if insert_marker in existing:
        head, tail = existing.split(insert_marker, 1)
        new = head + insert_marker + "\n".join(block) + "\n" + tail
    else:
        new = existing + "\n".join(block) + "\n"
    changelog.write_text(new, encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--skip-yt", action="store_true",
                    help="run drop processor + parse_corpus + guest_tracker only")
    args = ap.parse_args()

    corpus_root = Path(args.corpus).expanduser().resolve()
    scripts_dir = Path(__file__).resolve().parent
    py = sys.executable

    steps = [
        ("process_drop", [py, str(scripts_dir / "process_drop.py"),
                          "--corpus", str(corpus_root)]),
    ]
    if not args.skip_yt:
        steps += [
            ("fetch_how_i_ai", [py, str(scripts_dir / "fetch_how_i_ai.py"),
                                "--corpus", str(corpus_root), "--skip-existing"]),
            ("fetch_lenny_yt", [py, str(scripts_dir / "fetch_lenny_yt.py"),
                                "--corpus", str(corpus_root), "--skip-existing"]),
        ]
    steps += [
        ("parse_corpus", [py, str(scripts_dir / "parse_corpus.py"),
                          "--corpus", str(corpus_root)]),
        ("guest_tracker", [py, str(scripts_dir / "guest_tracker.py"),
                           "--rebuild"]),
    ]

    results = [run_step(label, cmd, dry_run=args.dry_run) for label, cmd in steps]

    if args.dry_run:
        print("\n(dry-run; no state or changelog updates)")
        return

    update_state(corpus_root / "_state.json")
    repo_root = scripts_dir.parent
    append_changelog(repo_root / "knowledge" / "CHANGELOG.md", results)
    print("\nweekly-refresh complete; _state.json.last_yt_refresh updated; "
          "CHANGELOG entry appended.")


if __name__ == "__main__":
    main()
