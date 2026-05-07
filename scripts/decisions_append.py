#!/usr/bin/env python3
"""
decisions_append.py: append one divergence entry to the auto decisions log.

The lenny-actualize skill calls this when it detects that the user has
chosen a different path than the skill recommended — explicit pushback,
"actually I'd do X instead", or a stated decision that contradicts the
skill's suggestion. The decisions file accumulates these as a calibration
set: future invocations consult it before recommending so prior priorities
re-weight current output.

File location: <home>/.lenny-actualize/decisions/<slug>.md (resolved via
scripts/paths.py).

Format: one H2 per divergence, newest at top:

  ## 2026-05-07T17:30 — lenny-actualize
  - recommendation: "hire a senior PM with regulated-domain experience"
  - user-action: "going to hire a junior PM and grow them"
  - reasoning: "budget constraints; long runway"
  - outcome: (pending — update when user reports back)

When the user later reports an outcome, the skill writes a new entry
referencing the prior decision (instead of mutating the original):

  ## 2026-06-15T10:00 — lenny-actualize (outcome update)
  - references: 2026-05-07T17:30
  - outcome: "hired junior PM in May; ramping fine; happy with choice"

Usage:
  python3 decisions_append.py --skill lenny-actualize \
      --recommendation "hire a senior PM with regulated-domain experience" \
      --user-action "going to hire a junior PM and grow them" \
      --reasoning "budget constraints; long runway"

  python3 decisions_append.py --skill lenny-actualize --outcome-update \
      --references 2026-05-07T17:30 \
      --outcome "hired junior PM in May; ramping fine"
"""
from __future__ import annotations

import argparse
import datetime as dt
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from paths import DEFAULT_SLUG, decisions_path

HEADER = ("# Decisions log\n\nNewest at top. Auto-appended by lenny-actualize "
          "when user diverges from a recommendation, or when an outcome is "
          "reported back later.\n\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", default=DEFAULT_SLUG)
    ap.add_argument("--skill", required=True)
    ap.add_argument("--outcome-update", action="store_true",
                    help="this entry reports an outcome on a prior decision")
    ap.add_argument("--references", default="",
                    help="(outcome-update) timestamp of the prior decision")
    ap.add_argument("--outcome", default="",
                    help="(outcome-update) what actually happened")
    ap.add_argument("--recommendation", default="",
                    help="(divergence) what the skill recommended")
    ap.add_argument("--user-action", default="", dest="user_action",
                    help="(divergence) what the user said they would do instead")
    ap.add_argument("--reasoning", default="",
                    help="(divergence) the user's stated reasoning")
    args = ap.parse_args()

    timestamp = dt.datetime.now().strftime("%Y-%m-%dT%H:%M")

    if args.outcome_update:
        if not args.references or not args.outcome:
            sys.exit("--outcome-update requires --references and --outcome")
        entry = (
            f"## {timestamp} — {args.skill} (outcome update)\n"
            f"- references: {args.references}\n"
            f"- outcome: \"{args.outcome}\"\n\n"
        )
    else:
        if not args.recommendation or not args.user_action:
            sys.exit("divergence entry requires --recommendation and --user-action")
        entry = (
            f"## {timestamp} — {args.skill}\n"
            f"- recommendation: \"{args.recommendation}\"\n"
            f"- user-action: \"{args.user_action}\"\n"
            f"- reasoning: \"{args.reasoning}\"\n"
            f"- outcome: (pending — update when user reports back)\n\n"
        )

    path = decisions_path(args.slug)
    if path.exists():
        existing = path.read_text(encoding="utf-8")
        if existing.startswith("# Decisions log"):
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
