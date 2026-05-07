#!/usr/bin/env python3
"""
profile_load.py: emit the active user profile as JSON for the skill to read.

There is one profile per machine by default (`default.yml`), auto-populated
by the lenny-actualize skill from observed interactions. The skill reads
this file at the start of every invocation to shape its output.

If the profile file does not exist yet, this prints `{}` and exits 0 — the
skill should treat the absence as "first invocation, no facets yet" and
proceed without ceremony.

Usage:
  python3 profile_load.py
  python3 profile_load.py --slug default
  python3 profile_load.py --pretty
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from paths import DEFAULT_SLUG, profile_path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip install pyyaml")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", default=DEFAULT_SLUG)
    ap.add_argument("--pretty", action="store_true")
    args = ap.parse_args()

    path = profile_path(args.slug)
    if not path.exists():
        print("{}")
        return

    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as e:
        sys.exit(f"profile YAML at {path} is malformed: {e}")

    indent = 2 if args.pretty else None
    print(json.dumps(data, indent=indent, ensure_ascii=False))


if __name__ == "__main__":
    main()
