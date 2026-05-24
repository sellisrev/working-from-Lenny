#!/usr/bin/env python3
"""
list_topics.py: list all topics in references/topics.yml, with match counts against the normalized corpus.

Useful for picking the next topic to process, or validating taxonomy coverage.

Usage:
  python3 list_topics.py [--topics-yml <path>] [--unmatched-only]
"""
import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip install pyyaml")

sys.path.insert(0, str(Path(__file__).resolve().parent))
from topic_chunks import file_matches  # noqa: E402


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--topics-yml", default=None)
    ap.add_argument("--normalized", default=None)
    ap.add_argument("--unmatched-only", action="store_true")
    ap.add_argument("--knowledge-dir", default=None, help="report which topics already have a knowledge/topics file")
    args = ap.parse_args()

    skill_root = Path(__file__).resolve().parent.parent
    topics_yml = Path(args.topics_yml) if args.topics_yml else (skill_root / "references" / "topics.yml")
    norm_path = Path(args.normalized) if args.normalized else (skill_root / "references" / "_corpus_normalized.json")
    knowledge_dir = Path(args.knowledge_dir) if args.knowledge_dir else (skill_root / "knowledge" / "topics")

    with open(topics_yml, encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    with open(norm_path, encoding="utf-8") as f:
        norm = json.load(f)
    rows = norm["rows"]

    out = []
    for slug, topic in (data.get("topics") or {}).items():
        matches = sum(1 for r in rows if file_matches(r, topic))
        processed = (knowledge_dir / f"{slug}.md").exists()
        if args.unmatched_only and matches > 0:
            continue
        out.append({
            "slug": slug,
            "display_name": topic.get("display_name", slug),
            "match_count": matches,
            "processed": processed,
        })

    out.sort(key=lambda x: (-x["match_count"], x["slug"]))
    for o in out:
        marker = "[done]" if o["processed"] else "[todo]"
        print(f"{marker} {o['slug']:<45} {o['match_count']:>4} matches  {o['display_name']}")
    print(f"\ntotal: {len(out)} topics")


if __name__ == "__main__":
    main()
