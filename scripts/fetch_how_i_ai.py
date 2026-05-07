#!/usr/bin/env python3
"""
fetch_how_i_ai.py: pull YouTube auto-captions from the How I AI podcast channel,
convert to clean markdown, and write to <corpus>/04-how-i-ai/.

How I AI is Claire Vo's AI-workflow-focused podcast in Lenny's Podcast Network.
Transcripts are not published as a downloadable archive; YouTube auto-captions
are the next-best machine-readable source. They're lower-quality than the
human-edited Lenny transcripts, so each output file is tagged
`transcript_quality: auto` and the lenny-actualize skill weights them as a
secondary signal.

Thin wrapper over `yt_fetch_lib`. The generic engine is shared with
`fetch_lenny_yt.py`.

Usage:
  python3 fetch_how_i_ai.py --corpus <path> [--limit N] [--newest-only]
                            [--channel <url>] [--skip-existing] [--dry-run]
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

# Allow `python scripts/fetch_how_i_ai.py` invocation (no package install).
sys.path.insert(0, str(Path(__file__).resolve().parent))
from yt_fetch_lib import (
    existing_ids_from_index,
    fetch_metadata,
    fetch_transcript,
    list_videos,
    transcript_to_text,
    update_index,
    write_markdown,
)

DEFAULT_CHANNEL = "https://www.youtube.com/@howiaipodcast/videos"
OUT_SUBDIR = "04-how-i-ai"
KIND = "how-i-ai"
FM_TYPE = "how-i-ai"
HOST = "Claire Vo"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", required=True)
    ap.add_argument("--channel", default=DEFAULT_CHANNEL)
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--newest-only", action="store_true")
    ap.add_argument("--skip-existing", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--sleep-between", type=float, default=1.5,
                    help="seconds to sleep between video fetches (politeness)")
    args = ap.parse_args()

    corpus_root = Path(args.corpus).expanduser().resolve()
    out_dir = corpus_root / OUT_SUBDIR
    out_dir.mkdir(parents=True, exist_ok=True)
    index_path = out_dir / "_index.json"

    limit = 1 if args.newest_only else args.limit
    print(f"listing videos from {args.channel} (limit={limit})...")
    videos = list_videos(args.channel, limit)
    if not videos:
        sys.exit("no videos returned by yt-dlp; check channel URL or network")
    print(f"  found {len(videos)} videos")

    existing_ids = existing_ids_from_index(index_path) if args.skip_existing else set()

    if args.dry_run:
        for v in videos:
            mark = "[skip]" if v["id"] in existing_ids else "[fetch]"
            print(f"  {mark} {v['id']}  {v['title'][:80]}")
        return

    new_rows = []
    for i, v in enumerate(videos):
        vid = v["id"]
        if not vid:
            continue
        if vid in existing_ids:
            print(f"  [skip] {vid} already indexed")
            continue
        title_preview = (v["title"] or "")[:60]
        print(f"  [{i+1}/{len(videos)}] fetching {vid}: {title_preview}")
        info = fetch_metadata(vid)
        if not info:
            print(f"    [warn] no metadata for {vid}; skipping")
            continue
        segments = fetch_transcript(vid)
        if not segments:
            print(f"    [warn] no transcript available for {vid}; skipping")
            continue
        body = transcript_to_text(segments)
        if not body.strip():
            print(f"    [warn] empty transcript text for {vid}; skipping")
            continue
        md_path, row = write_markdown(
            out_dir, info, body, vid, args.channel,
            kind=KIND, fm_type=FM_TYPE, host=HOST,
        )
        new_rows.append(row)
        print(f"    wrote {md_path.relative_to(corpus_root)} ({row['word_count']} words, {len(segments)} segments)")
        if args.sleep_between and i < len(videos) - 1:
            time.sleep(args.sleep_between)

    if not new_rows:
        print("no new episodes fetched")
        return

    update_index(index_path, new_rows)
    print(f"updated {index_path}: {len(new_rows)} new rows")


if __name__ == "__main__":
    main()
