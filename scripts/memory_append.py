#!/usr/bin/env python3
"""
memory_append.py: append one invocation entry to the auto memory log.

The lenny-actualize skill calls this at the end of every invocation. The
memory file accumulates a record of what the user has asked, which facets
of their profile were active, what knowledge files surfaced, and any
recurring themes the skill noticed. Future invocations read this for
context without ceremony.

File location: <home>/.lenny-actualize/memory/<slug>.md (resolved via
scripts/paths.py).

Format: one H2 per invocation, newest at top:

  ## 2026-05-07T17:23 — lenny-actualize
  - input: "what about hiring in early-stage medtech?"
  - facets-active: founder/medtech, gtm-advisor
  - surfaced: knowledge/topics/hiring-early-team.md, knowledge/topics/...
  - themes: hiring, medtech
  - blind-spots:

Usage:
  python3 memory_append.py --skill lenny-actualize \
      --input "what about hiring in early-stage medtech?" \
      --facets founder/medtech,gtm-advisor \
      --surfaced knowledge/topics/hiring-early-team.md \
      --themes hiring,medtech
"""
from __future__ import annotations

import argparse
import datetime as dt
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from paths import DEFAULT_SLUG, memory_path

HEADER = "# Memory log\n\nNewest at top. Auto-appended by lenny-actualize.\n\n"


def split_csv(s: str | None) -> list[str]:
    if not s:
        return []
    return [x.strip() for x in s.split(",") if x.strip()]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", default=DEFAULT_SLUG)
    ap.add_argument("--skill", required=True)
    ap.add_argument("--input", required=True, dest="input_summary",
                    help="One-line summary of what the user asked")
    ap.add_argument("--facets", default="", help="comma list of active facet labels")
    ap.add_argument("--surfaced", default="", help="comma list of file paths surfaced")
    ap.add_argument("--themes", default="", help="comma list of recurring themes")
    ap.add_argument("--blind-spots", default="", dest="blind_spots",
                    help="comma list of blind-spot flags")
    args = ap.parse_args()

    timestamp = dt.datetime.now().strftime("%Y-%m-%dT%H:%M")
    facets = ", ".join(split_csv(args.facets)) or "(none)"
    surfaced = ", ".join(split_csv(args.surfaced)) or "(none)"
    themes = ", ".join(split_csv(args.themes)) or "(none)"
    blind_spots = ", ".join(split_csv(args.blind_spots)) or "(none)"

    entry = (
        f"## {timestamp} — {args.skill}\n"
        f"- input: \"{args.input_summary}\"\n"
        f"- facets-active: {facets}\n"
        f"- surfaced: {surfaced}\n"
        f"- themes: {themes}\n"
        f"- blind-spots: {blind_spots}\n\n"
    )

    path = memory_path(args.slug)
    if path.exists():
        existing = path.read_text(encoding="utf-8")
        if existing.startswith("# Memory log"):
            split = existing.split("\n\n", 2)
            head = "\n\n".join(split[:2]) + "\n\n"
            tail = split[2] if len(split) > 2 else ""
            path.write_text(head + entry + tail, encoding="utf-8")
        else:
            path.write_text(HEADER + entry + existing, encoding="utf-8")
    else:
        path.write_text(HEADER + entry, encoding="utf-8")

    print(f"appended to {path}")


if __name__ == "__main__":
    main()
