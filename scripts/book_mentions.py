#!/usr/bin/env python3
"""
book_mentions.py: find every place in the corpus where a given book is referenced.

Returns excerpts of paragraphs mentioning the book title or a distinctive phrase.

Usage:
  python3 book_mentions.py --book <slug> --books-yml <path> --corpus <path>
"""
import argparse
import json
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required: pip install pyyaml")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--book", required=True)
    ap.add_argument("--books-yml", required=True)
    ap.add_argument("--corpus", required=True)
    ap.add_argument("--normalized", default=None)
    ap.add_argument("--max-chars-per-mention", type=int, default=1200)
    args = ap.parse_args()

    skill_root = Path(__file__).resolve().parent.parent
    norm_path = Path(args.normalized) if args.normalized else (skill_root / "references" / "_corpus_normalized.json")
    with open(norm_path) as f:
        norm = json.load(f)
    rows = norm["rows"]

    with open(args.books_yml) as f:
        books = yaml.safe_load(f) or {}
    if args.book not in books.get("books", {}):
        sys.exit(f"book '{args.book}' not in {args.books_yml}")
    book = books["books"][args.book]

    title = book.get("title", "")
    author = book.get("author", "")
    aliases = [title] + (book.get("aliases") or [])
    aliases = [a for a in aliases if a]
    if not aliases:
        sys.exit(f"no searchable strings for book {args.book}")

    pattern = re.compile("|".join(re.escape(a) for a in aliases), re.IGNORECASE)

    mentions = []
    for r in rows:
        path = Path(r["abs_path"])
        if not path.exists():
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        if not pattern.search(text):
            continue
        for para in re.split(r"\n\s*\n", text):
            if pattern.search(para):
                mentions.append({
                    "file": r["filename"],
                    "date": r.get("date"),
                    "kind": r["kind"],
                    "guest_or_author": r.get("guest_or_author") or "",
                    "title": r["title"],
                    "post_url": r.get("post_url"),
                    "excerpt": para[: args.max_chars_per_mention],
                })

    mentions.sort(key=lambda m: (m.get("date") or "0000-00-00"))
    print(json.dumps({
        "book": args.book,
        "title": title,
        "author": author,
        "mention_count": len(mentions),
        "items": mentions,
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
