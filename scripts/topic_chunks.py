#!/usr/bin/env python3
"""
topic_chunks.py: emit excerpts from corpus files matching a topic, sorted oldest -> newest.

Plumbing only. Filters files by:
  1. tag membership against topics.yml `related_tags`
  2. seed-keyword match against title/description (case-insensitive)
  3. for matched files, scans body for paragraphs containing seed keywords (1 paragraph above + matched + 1 below as excerpt)

Outputs a JSON list of:
  {file, date, kind, guest_or_author, title, excerpt}

The agent uses these excerpts to extract claims, then drops them from context.

Usage:
  python3 topic_chunks.py --topic <slug> --topics-yml <path> --corpus <path> [--max-files N] [--max-chars-per-file C]
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


def load_topic(topics_yml: Path, slug: str) -> dict:
    with open(topics_yml) as f:
        data = yaml.safe_load(f) or {}
    topics = data.get("topics", {})
    if slug not in topics:
        sys.exit(f"topic '{slug}' not in {topics_yml}. Known: {sorted(topics.keys())[:20]}...")
    return topics[slug]


def file_matches(row: dict, topic: dict) -> bool:
    """Match by metadata only. Body match happens later during excerpt extraction.

    Strategy:
      - REQUIRE a seed-keyword hit in title/description/id (this is the topic signal).
      - Tags alone are too coarse (one tag like `pricing` covers many topics);
        we use them only as a tiebreaker when title-level match is ambiguous.
    """
    seed_keywords = [kw.lower() for kw in (topic.get("seed_keywords") or [])]
    if not seed_keywords:
        return False
    haystack = " ".join([
        row.get("title", "") or "",
        row.get("description", "") or "",
        row.get("id", "") or "",
    ]).lower()
    return any(kw in haystack for kw in seed_keywords)


def file_matches_body(row: dict, topic: dict, abs_path: Path) -> bool:
    """Secondary matcher: keyword anywhere in the body. Used to broaden
    when title-level matches are too few (< 3)."""
    seed_keywords = [kw.lower() for kw in (topic.get("seed_keywords") or [])]
    if not seed_keywords or not abs_path.exists():
        return False
    related_tags = set(topic.get("related_tags") or [])
    if related_tags and not related_tags.intersection(set(row.get("tags") or [])):
        return False
    try:
        text = abs_path.read_text(encoding="utf-8", errors="replace").lower()
    except Exception:
        return False
    return any(kw in text for kw in seed_keywords)


def extract_excerpt(path: Path, seed_keywords: list[str], max_chars: int) -> str:
    if not path.exists():
        return ""
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        return f"[unreadable: {e}]"
    paragraphs = re.split(r"\n\s*\n", text)
    keep_idx: list[int] = []
    kws = [re.escape(kw) for kw in seed_keywords if kw]
    if not kws:
        joined = "\n\n".join(paragraphs[:5])
        return joined[:max_chars]
    pattern = re.compile(r"\b(" + "|".join(kws) + r")\b", re.IGNORECASE)
    for i, para in enumerate(paragraphs):
        if pattern.search(para):
            for j in (i - 1, i, i + 1):
                if 0 <= j < len(paragraphs) and j not in keep_idx:
                    keep_idx.append(j)
    keep_idx.sort()
    excerpt_paras = [paragraphs[i] for i in keep_idx]
    excerpt = "\n\n".join(excerpt_paras)
    return excerpt[:max_chars]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", required=True)
    ap.add_argument("--topics-yml", required=True)
    ap.add_argument("--corpus", required=True, help="corpus root, used if _corpus_normalized.json is missing")
    ap.add_argument("--normalized", default=None, help="path to _corpus_normalized.json")
    ap.add_argument("--max-files", type=int, default=40)
    ap.add_argument("--max-chars-per-file", type=int, default=4000)
    args = ap.parse_args()

    skill_root = Path(__file__).resolve().parent.parent
    norm_path = Path(args.normalized) if args.normalized else (skill_root / "references" / "_corpus_normalized.json")
    if not norm_path.exists():
        sys.exit(f"normalized corpus not found at {norm_path}; run parse_corpus.py first")

    with open(norm_path) as f:
        norm = json.load(f)
    rows = norm["rows"]

    topic = load_topic(Path(args.topics_yml), args.topic)
    seed_keywords = topic.get("seed_keywords") or []

    matched = [r for r in rows if file_matches(r, topic)]
    if len(matched) < 3:
        seen = {r["filename"] for r in matched}
        for r in rows:
            if r["filename"] in seen:
                continue
            if file_matches_body(r, topic, Path(r["abs_path"])):
                matched.append(r)
    matched.sort(key=lambda r: (r.get("date") or "0000-00-00"))

    if len(matched) > args.max_files:
        first_half = matched[: args.max_files // 2]
        last_half = matched[-args.max_files // 2 :]
        matched = first_half + last_half

    out = []
    for r in matched:
        excerpt = extract_excerpt(Path(r["abs_path"]), seed_keywords, args.max_chars_per_file)
        if not excerpt.strip():
            continue
        out.append({
            "file": r["filename"],
            "date": r.get("date"),
            "kind": r["kind"],
            "guest_or_author": r.get("guest_or_author") or "",
            "title": r["title"],
            "post_url": r.get("post_url"),
            "excerpt": excerpt,
        })

    print(json.dumps({
        "topic": args.topic,
        "display_name": topic.get("display_name", args.topic),
        "match_count": len(out),
        "items": out,
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
