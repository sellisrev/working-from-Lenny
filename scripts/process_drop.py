#!/usr/bin/env python3
"""
process_drop.py: process manually-pulled lennysdata.com transcripts.

`https://www.lennysdata.com/` provides clean human-edited transcripts to
subscribers but exposes no public API. The lenny-actualize skill supports a
manual workflow: subscribers download fresh transcripts, drop them in
`<corpus>/_manual_drop/`, and on the next skill invocation (or via
weekly_refresh.py) this script processes them — validating frontmatter,
routing to `02-newsletters/` or `03-podcasts/`, marking them done, and
updating `<corpus>/_state.json.last_lennysdata_pull`.

Expected input file format: markdown with YAML frontmatter

    ---
    title: "..."
    date: "YYYY-MM-DD"
    guest_or_author: "..."     # required for kind=podcast; optional for newsletter
    kind: "podcast" | "newsletter"
    source: "lennysdata"       # default if omitted
    source_url: "..."          # optional
    ---
    <body>

Idempotent: re-running with no new files exits silently and quickly. Files
with bad frontmatter are moved to `_manual_drop/_unparseable/` with a sibling
`.error` note; the processor never crashes on a bad file.

Usage:
  python3 process_drop.py --corpus <path>
  python3 process_drop.py --corpus <path> --dry-run
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import shutil
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip install pyyaml")


REQUIRED_FIELDS = ("title", "date", "kind")
KIND_TO_DIR = {"podcast": "03-podcasts", "newsletter": "02-newsletters"}
DROP_SUBDIR = "_manual_drop"
PROCESSED_SUBDIR = "processed"
UNPARSEABLE_SUBDIR = "_unparseable"
TEMPLATE_NAME = "_TEMPLATE.md"
LOG_NAME = "_log.md"
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


TEMPLATE_BODY = """---
title: ""
date: ""
guest_or_author: ""
kind: ""
source: "lennysdata"
source_url: ""
---

<paste transcript body here>
"""


def slugify(s: str, max_len: int = 60) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:max_len].rstrip("-")


def parse_frontmatter(text: str) -> tuple[dict | None, str | None, str | None]:
    """Return (data, body, error). data is None on failure."""
    if not text.startswith("---"):
        return None, None, "missing frontmatter (file must start with '---')"
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None, None, "frontmatter not closed (expected a second '---' line)"
    _, fm_text, body = parts
    try:
        data = yaml.safe_load(fm_text) or {}
    except yaml.YAMLError as e:
        return None, None, f"YAML parse error: {e}"
    if not isinstance(data, dict):
        return None, None, "frontmatter must be a YAML mapping"
    return data, body.lstrip("\n"), None


def validate(data: dict) -> str | None:
    for f in REQUIRED_FIELDS:
        if not data.get(f):
            return f"missing required frontmatter field: {f}"
    if data["kind"] not in KIND_TO_DIR:
        return f"unknown kind: {data['kind']!r} (expected one of: {', '.join(KIND_TO_DIR)})"
    if not isinstance(data["date"], str) or not DATE_RE.match(data["date"]):
        return f"date must be YYYY-MM-DD, got: {data['date']!r}"
    if data["kind"] == "podcast" and not data.get("guest_or_author"):
        return "podcast entries require guest_or_author"
    return None


def derive_slug(data: dict) -> str:
    if data["kind"] == "podcast" and data.get("guest_or_author"):
        return slugify(data["guest_or_author"])
    return slugify(data.get("title", "") or "")


def unique_path(parent: Path, slug: str, ext: str = ".md") -> Path:
    candidate = parent / f"{slug}{ext}"
    n = 2
    while candidate.exists():
        candidate = parent / f"{slug}-{n}{ext}"
        n += 1
    return candidate


def write_corpus_file(corpus_root: Path, data: dict, body: str) -> Path:
    """Write the file into 02-newsletters/ or 03-podcasts/ with normalized
    frontmatter (transcript_quality: human, source: lennysdata)."""
    dest_dir = corpus_root / KIND_TO_DIR[data["kind"]]
    dest_dir.mkdir(parents=True, exist_ok=True)
    slug = derive_slug(data) or "untitled"
    dest_path = unique_path(dest_dir, slug)

    fm = {
        "title": data["title"],
        "date": data["date"],
        "kind": data["kind"],
        "guest_or_author": data.get("guest_or_author", ""),
        "source": data.get("source", "lennysdata"),
        "transcript_quality": "human",
    }
    if data.get("source_url"):
        fm["source_url"] = data["source_url"]
    if data.get("description"):
        fm["description"] = data["description"]

    fm_lines = ["---"]
    for k, v in fm.items():
        if isinstance(v, str):
            v_str = '"' + v.replace('"', "'") + '"'
        elif v is None:
            v_str = "null"
        else:
            v_str = str(v)
        fm_lines.append(f"{k}: {v_str}")
    fm_lines.append("---")
    fm_lines.append("")
    dest_path.write_text("\n".join(fm_lines) + "\n" + body, encoding="utf-8")
    return dest_path


def move_to_processed(src: Path, processed_dir: Path) -> Path:
    processed_dir.mkdir(parents=True, exist_ok=True)
    target = unique_path(processed_dir, src.stem)
    shutil.move(str(src), str(target))
    return target


def move_to_unparseable(src: Path, unparseable_dir: Path, reason: str) -> Path:
    unparseable_dir.mkdir(parents=True, exist_ok=True)
    target = unique_path(unparseable_dir, src.stem)
    shutil.move(str(src), str(target))
    error_path = target.with_suffix(target.suffix + ".error")
    error_path.write_text(f"{dt.datetime.now(dt.timezone.utc).isoformat()}\n{reason}\n",
                          encoding="utf-8")
    return target


def append_log(log_path: Path, entries: list[tuple[Path, Path]]) -> None:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    today = dt.date.today().isoformat()
    lines = [f"\n## {today}"]
    for src, dest in entries:
        lines.append(f"- `{src.name}` -> `{dest.relative_to(dest.parents[1])}`"
                     if len(dest.parents) > 1 else f"- `{src.name}` -> `{dest}`")
    if log_path.exists():
        existing = log_path.read_text(encoding="utf-8")
    else:
        existing = "# Manual-drop processing log\n\nNewest first.\n"
    log_path.write_text("\n".join(lines) + "\n" + existing, encoding="utf-8")


def update_state(state_path: Path, *, lennysdata_pulled_today: bool) -> None:
    if state_path.exists():
        try:
            state = json.loads(state_path.read_text(encoding="utf-8"))
        except Exception:
            state = {}
    else:
        state = {}
    if lennysdata_pulled_today:
        state["last_lennysdata_pull"] = dt.date.today().isoformat()
    state.setdefault("last_yt_refresh", None)
    state.setdefault("last_reminder_shown", None)
    state_path.write_text(json.dumps(state, indent=2), encoding="utf-8")


def ensure_template(drop_dir: Path) -> None:
    template_path = drop_dir / TEMPLATE_NAME
    if not template_path.exists():
        template_path.write_text(TEMPLATE_BODY, encoding="utf-8")


def collect_drop_files(drop_dir: Path) -> list[Path]:
    if not drop_dir.exists():
        return []
    out = []
    for child in sorted(drop_dir.iterdir()):
        if not child.is_file() or child.suffix.lower() != ".md":
            continue
        if child.name.startswith("_"):
            continue
        out.append(child)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    corpus_root = Path(args.corpus).expanduser().resolve()
    drop_dir = corpus_root / DROP_SUBDIR
    drop_dir.mkdir(parents=True, exist_ok=True)
    ensure_template(drop_dir)

    files = collect_drop_files(drop_dir)
    if not files:
        print(f"no files to process in {drop_dir}")
        return

    processed_dir = drop_dir / PROCESSED_SUBDIR
    unparseable_dir = drop_dir / UNPARSEABLE_SUBDIR
    log_path = processed_dir / LOG_NAME
    state_path = corpus_root / "_state.json"

    successful: list[tuple[Path, Path]] = []
    failed: list[tuple[Path, str]] = []

    for src in files:
        text = src.read_text(encoding="utf-8")
        data, body, err = parse_frontmatter(text)
        if err:
            failed.append((src, err))
            continue
        err = validate(data)
        if err:
            failed.append((src, err))
            continue
        if args.dry_run:
            kind = data["kind"]
            slug = derive_slug(data) or "untitled"
            print(f"  [would write] {src.name}  ->  {KIND_TO_DIR[kind]}/{slug}.md")
            continue
        dest = write_corpus_file(corpus_root, data, body or "")
        moved = move_to_processed(src, processed_dir)
        successful.append((moved, dest))
        print(f"  [processed] {src.name}  ->  {dest.relative_to(corpus_root)}")

    for src, reason in failed:
        if args.dry_run:
            print(f"  [would reject] {src.name}: {reason}")
            continue
        moved = move_to_unparseable(src, unparseable_dir, reason)
        print(f"  [unparseable] {src.name}  ->  {moved.relative_to(corpus_root)} ({reason})")

    if args.dry_run:
        return

    if successful:
        append_log(log_path, [(src, dest) for src, dest in successful])
        update_state(state_path, lennysdata_pulled_today=True)
        print(f"processed {len(successful)} file(s); _state.json.last_lennysdata_pull updated")
    elif failed:
        update_state(state_path, lennysdata_pulled_today=False)


if __name__ == "__main__":
    main()
