#!/usr/bin/env python3
"""
export_digest.py: concatenate knowledge/topics/*.md into a single domain-grouped
digest file. Pulls the "Current consensus" section from each topic file and
links to the full topic file for detail.

Usage:
  python3 export_digest.py [--out <path>] [--format consensus|full]

`consensus` (default) emits only the Current consensus section per topic.
`full` emits the full topic body.

Domain grouping is derived from references/topics.yml `related_tags` field;
topics with no related_tags fall under "uncategorized".
"""
import argparse
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip install pyyaml")


CONSENSUS_RE = re.compile(r"^## Current consensus\s*\n(.*?)(?=^## |\Z)", re.MULTILINE | re.DOTALL)


def extract_consensus(md: str) -> str:
    m = CONSENSUS_RE.search(md)
    if not m:
        return ""
    return m.group(1).strip()


def extract_body(md: str) -> str:
    parts = md.split("---", 2)
    return parts[2].strip() if len(parts) >= 3 else md


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=None)
    ap.add_argument("--format", choices=["consensus", "full"], default="consensus")
    ap.add_argument("--topics-yml", default=None)
    args = ap.parse_args()

    skill_root = Path(__file__).resolve().parent.parent
    topics_yml = Path(args.topics_yml) if args.topics_yml else (skill_root / "references" / "topics.yml")
    knowledge_dir = skill_root / "knowledge" / "topics"
    out_path = Path(args.out) if args.out else (skill_root / "knowledge" / f"DIGEST_{args.format}.md")

    with open(topics_yml) as f:
        tdata = yaml.safe_load(f) or {}
    topics = tdata.get("topics") or {}

    by_domain: dict[str, list[tuple[str, dict, Path]]] = {}
    for slug, t in topics.items():
        path = knowledge_dir / f"{slug}.md"
        if not path.exists() or path.name.startswith("_"):
            continue
        related = t.get("related_tags") or []
        domain = related[0] if related else "uncategorized"
        by_domain.setdefault(domain, []).append((slug, t, path))

    lines = [
        f"# Lenny knowledge digest ({args.format})",
        f"",
        f"_Generated {datetime.now(timezone.utc).strftime('%Y-%m-%d')} from `knowledge/topics/`._",
        f"",
        f"_For full sources, citations, and obsolete claims, follow the per-topic links._",
        f"",
    ]
    total_topics = 0
    for domain in sorted(by_domain.keys()):
        lines.append(f"## {domain}")
        lines.append("")
        for slug, t, path in sorted(by_domain[domain]):
            total_topics += 1
            lines.append(f"### {t.get('display_name', slug)}")
            lines.append("")
            lines.append(f"_Topic file: [`topics/{slug}.md`](topics/{slug}.md)_")
            lines.append("")
            md = path.read_text(encoding="utf-8")
            if args.format == "consensus":
                content = extract_consensus(md) or "_(no consensus section yet)_"
            else:
                content = extract_body(md)
            lines.append(content)
            lines.append("")
        lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {out_path}: {total_topics} topics across {len(by_domain)} domains")


if __name__ == "__main__":
    main()
