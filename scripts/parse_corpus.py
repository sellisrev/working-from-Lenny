#!/usr/bin/env python3
"""
parse_corpus.py: normalize the Lenny corpus index.json into a flat row-per-file table.

Plumbing only. No claim extraction, no LLM calls. Reads index.json, emits
references/_corpus_normalized.json with one row per file:

  {
    "id": "<filename without dir/ext>",
    "kind": "podcast" | "newsletter",
    "filename": "03-podcasts/cat-wu.md",
    "abs_path": "/abs/path/to/03-podcasts/cat-wu.md",
    "title": "...",
    "date": "YYYY-MM-DD" | null,
    "guest_or_author": "...",
    "tags": [...],
    "word_count": int,
    "description": "...",
    "post_url": "..." | null
  }

The agent reads this output, derives the fine-grained topic taxonomy, and writes references/topics.yml.
"""
import argparse
import json
import os
import sys
from datetime import date, datetime
from pathlib import Path


def normalize(corpus_root: Path) -> list[dict]:
    index_path = corpus_root / "01-start-here" / "index.json"
    if not index_path.exists():
        sys.exit(f"index.json not found at {index_path}")
    with open(index_path) as f:
        idx = json.load(f)

    rows: list[dict] = []
    for p in idx.get("podcasts", []):
        rows.append({
            "id": Path(p["filename"]).stem,
            "kind": "podcast",
            "filename": p["filename"],
            "abs_path": str(corpus_root / p["filename"]),
            "title": p.get("title", ""),
            "date": p.get("date"),
            "guest_or_author": p.get("guest", ""),
            "tags": p.get("tags", []),
            "word_count": p.get("word_count", 0),
            "description": p.get("description", ""),
            "post_url": None,
            "transcript_quality": "human",
        })
    for n in idx.get("newsletters", []):
        rows.append({
            "id": Path(n["filename"]).stem,
            "kind": "newsletter",
            "filename": n["filename"],
            "abs_path": str(corpus_root / n["filename"]),
            "title": n.get("title", ""),
            "date": n.get("date"),
            "guest_or_author": "",
            "tags": n.get("tags", []),
            "word_count": n.get("word_count", 0),
            "description": n.get("subtitle", ""),
            "post_url": n.get("post_url"),
            "transcript_quality": "human",
        })

    hia_index = corpus_root / "04-how-i-ai" / "_index.json"
    if hia_index.exists():
        try:
            hia = json.loads(hia_index.read_text())
            for h in hia.get("rows", []):
                rows.append({
                    "id": h.get("id"),
                    "kind": "how-i-ai",
                    "filename": h.get("filename"),
                    "abs_path": str(corpus_root / h.get("filename", "")),
                    "title": h.get("title", ""),
                    "date": h.get("date"),
                    "guest_or_author": h.get("guest_or_author", "") or "",
                    "host": h.get("host", "Claire Vo"),
                    "tags": ["ai", "how-i-ai"],
                    "word_count": h.get("word_count", 0),
                    "description": "",
                    "post_url": h.get("youtube_url"),
                    "transcript_quality": h.get("transcript_quality", "auto"),
                })
        except Exception as e:
            print(f"  [warn] failed to read {hia_index}: {e}", file=sys.stderr)

    rows.sort(key=lambda r: (r["date"] or "0000-00-00", r["id"]))
    return rows


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", required=True, help="path to corpus root (contains 01-start-here/index.json)")
    ap.add_argument("--out", default=None, help="output JSON path (default: <skill>/references/_corpus_normalized.json)")
    args = ap.parse_args()

    corpus_root = Path(args.corpus).expanduser().resolve()
    rows = normalize(corpus_root)

    out_path = Path(args.out) if args.out else (Path(__file__).resolve().parent.parent / "references" / "_corpus_normalized.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w") as f:
        json.dump({
            "corpus_root": str(corpus_root),
            "row_count": len(rows),
            "rows": rows,
        }, f, indent=2)

    n_pod = sum(1 for r in rows if r["kind"] == "podcast")
    n_news = sum(1 for r in rows if r["kind"] == "newsletter")
    n_hia = sum(1 for r in rows if r["kind"] == "how-i-ai")
    dated = [r["date"] for r in rows if r["date"]]
    print(f"wrote {out_path}")
    print(f"  podcasts: {n_pod}, newsletters: {n_news}, how-i-ai: {n_hia}, total: {len(rows)}")
    if dated:
        max_date = max(dated)
        print(f"  date range: {min(dated)} .. {max_date}")
        try:
            md = datetime.strptime(max_date, "%Y-%m-%d").date()
            gap_days = (date.today() - md).days
            if gap_days > 90:
                print(f"  WARNING: corpus is {gap_days} days behind today.")
                print(f"  The Lenny archive intentionally omits the last 3 months of newsletters.")
                print(f"  When processing topics where freshness matters (AI workflows, recent")
                print(f"  product launches), expect to lean more on web-search citations or paste")
                print(f"  missing posts manually before running. Note this in CHANGELOG.md.")
        except ValueError:
            pass


if __name__ == "__main__":
    main()
