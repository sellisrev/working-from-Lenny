#!/usr/bin/env python3
"""
find_external_overlap.py: given a topic slug, list community repos whose
covers_topics include that slug. Used by the agent when writing
knowledge/obsolete/<slug>.md to add a "Community skill packs that may be stale"
footer.

Usage:
  python3 find_external_overlap.py --topic <slug>
"""
import argparse
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip install pyyaml")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", required=True)
    ap.add_argument("--external-yml", default=None)
    args = ap.parse_args()

    skill_root = Path(__file__).resolve().parent.parent
    ext_yml = Path(args.external_yml) if args.external_yml else (skill_root / "references" / "external_skills.yml")
    with open(ext_yml) as f:
        data = yaml.safe_load(f) or {}
    matches = []
    for slug, repo in (data.get("repos") or {}).items():
        if args.topic in (repo.get("covers_topics") or []):
            matches.append({
                "slug": slug,
                "name": repo.get("name"),
                "url": repo.get("url"),
                "kind": repo.get("kind"),
                "description": repo.get("description"),
            })
    if not matches:
        print(f"# no community repos explicitly cover topic '{args.topic}'")
        return
    print(f"# Community skills/SOPs that may need a stale-advice flag for topic '{args.topic}':")
    for m in matches:
        print(f"- [{m['name']}]({m['url']}) ({m['kind']}): {m['description']}")


if __name__ == "__main__":
    main()
