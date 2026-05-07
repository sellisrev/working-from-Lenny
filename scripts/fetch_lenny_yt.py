#!/usr/bin/env python3
"""
fetch_lenny_yt.py: pull YouTube auto-captions from Lenny's main podcast channel.

Lenny's main podcast YouTube re-publishes the same episodes that appear in the
licensed corpus under `03-podcasts/` as human-edited transcripts. The licensed
archive lags ~3 months, so YouTube auto-captions can fill the gap. Each output
file is tagged `transcript_quality: auto` so the lenny-actualize skill weights
it as a secondary signal under the two-corpus weighting policy (same treatment
as `04-how-i-ai/`).

Default mode: `--newer-than-corpus-max`. Reads the max date among podcast rows
in `01-start-here/index.json`, only fetches YouTube videos with `upload_date`
strictly newer. This avoids duplicating already-human-transcribed material.

Override flags:
  --since YYYY-MM-DD    fetch videos with upload_date >= the given date
  --all                 fetch every video on the channel; perform title-fuzzy
                        + same-date dedup against existing podcast rows

Each fetched markdown gets a frontmatter line `dedup_basis` so the rationale
is auditable downstream.

Usage:
  python3 fetch_lenny_yt.py --corpus <path>                    # newer-than-corpus-max (default)
  python3 fetch_lenny_yt.py --corpus <path> --since 2026-04-01
  python3 fetch_lenny_yt.py --corpus <path> --all
  python3 fetch_lenny_yt.py --corpus <path> --dry-run --limit 20
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from yt_fetch_lib import (
    existing_ids_from_index,
    fetch_metadata,
    fetch_transcript,
    list_videos,
    slugify,
    transcript_to_text,
    update_index,
    write_markdown,
)

DEFAULT_CHANNEL = "https://www.youtube.com/@LennysPodcast/videos"
OUT_SUBDIR = "06-lennys-podcast-yt"
KIND = "lennys-podcast-yt"
FM_TYPE = "lennys-podcast-yt"
HOST = "Lenny Rachitsky"


def read_corpus_podcast_rows(corpus_root: Path) -> list[dict]:
    index_path = corpus_root / "01-start-here" / "index.json"
    if not index_path.exists():
        return []
    try:
        idx = json.loads(index_path.read_text(encoding="utf-8"))
    except Exception:
        return []
    return list(idx.get("podcasts", []))


def max_podcast_date(corpus_root: Path) -> str | None:
    rows = read_corpus_podcast_rows(corpus_root)
    dates = [r.get("date") for r in rows if r.get("date")]
    return max(dates) if dates else None


def yt_upload_date_to_iso(raw: str | None) -> str | None:
    if not raw or len(raw) != 8:
        return None
    return f"{raw[0:4]}-{raw[4:6]}-{raw[6:8]}"


def title_norm(s: str) -> str:
    return slugify(s, max_len=80)


def build_dedup_set(corpus_root: Path) -> set[tuple[str, str]]:
    """Return set of (date, normalized_title_prefix) for existing podcast rows."""
    out = set()
    for r in read_corpus_podcast_rows(corpus_root):
        d = r.get("date") or ""
        t = title_norm(r.get("title") or "")
        if d and t:
            out.add((d, t[:40]))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", required=True)
    ap.add_argument("--channel", default=DEFAULT_CHANNEL)
    ap.add_argument("--limit", type=int, default=None,
                    help="cap on videos listed from the channel (newest first)")
    ap.add_argument("--newest-only", action="store_true")
    ap.add_argument("--skip-existing", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--sleep-between", type=float, default=1.5)

    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--newer-than-corpus-max", action="store_true",
                      help="(default) only fetch videos newer than max corpus podcast date")
    mode.add_argument("--since", type=str, default=None,
                      help="fetch videos with upload_date >= YYYY-MM-DD")
    mode.add_argument("--all", action="store_true",
                      help="fetch all; dedup against existing corpus by (date, title-prefix)")

    args = ap.parse_args()

    if not (args.newer_than_corpus_max or args.since or args.all):
        args.newer_than_corpus_max = True

    corpus_root = Path(args.corpus).expanduser().resolve()
    out_dir = corpus_root / OUT_SUBDIR
    out_dir.mkdir(parents=True, exist_ok=True)
    index_path = out_dir / "_index.json"

    cutoff_date: str | None = None
    dedup_set: set[tuple[str, str]] = set()
    dedup_basis_label: str

    if args.newer_than_corpus_max:
        cutoff_date = max_podcast_date(corpus_root)
        if not cutoff_date:
            sys.exit("--newer-than-corpus-max requires 01-start-here/index.json with podcast dates; "
                     "run parse_corpus.py first or use --all / --since")
        dedup_basis_label = f"newer-than-corpus-max {cutoff_date}"
        print(f"mode: newer-than-corpus-max (cutoff = {cutoff_date}, exclusive)")
    elif args.since:
        cutoff_date = args.since
        dedup_basis_label = f"since {args.since}"
        print(f"mode: since {args.since} (inclusive)")
    else:
        dedup_set = build_dedup_set(corpus_root)
        dedup_basis_label = f"all-with-fuzzy-dedup ({len(dedup_set)} corpus rows)"
        print(f"mode: --all with title-fuzzy dedup against {len(dedup_set)} corpus rows")

    limit = 1 if args.newest_only else args.limit
    print(f"listing videos from {args.channel} (limit={limit})...")
    videos = list_videos(args.channel, limit)
    if not videos:
        sys.exit("no videos returned by yt-dlp; check channel URL or network")
    print(f"  found {len(videos)} videos")

    existing_ids = existing_ids_from_index(index_path) if args.skip_existing else set()

    candidates = []
    print("filtering candidates by metadata (dates / dedup)...")
    for i, v in enumerate(videos):
        vid = v["id"]
        if not vid:
            continue
        if vid in existing_ids:
            print(f"  [skip-indexed] {vid}  {(v['title'] or '')[:70]}")
            continue
        info = fetch_metadata(vid)
        if not info:
            print(f"  [warn] no metadata for {vid}; skipping")
            continue
        upload_iso = yt_upload_date_to_iso(info.get("upload_date"))
        title = info.get("title") or ""
        if cutoff_date is not None:
            if not upload_iso:
                print(f"  [skip-no-date] {vid}  {title[:70]}")
                continue
            if args.newer_than_corpus_max and upload_iso <= cutoff_date:
                print(f"  [skip-too-old] {vid}  {upload_iso}  {title[:70]}")
                continue
            if args.since and upload_iso < cutoff_date:
                print(f"  [skip-before-since] {vid}  {upload_iso}  {title[:70]}")
                continue
        if args.all:
            t_norm = title_norm(title)[:40]
            if upload_iso and (upload_iso, t_norm) in dedup_set:
                print(f"  [skip-dedup] {vid}  {upload_iso}  {title[:70]}")
                continue
        candidates.append((vid, info, upload_iso, title))
        if args.sleep_between and i < len(videos) - 1:
            time.sleep(args.sleep_between)

    print(f"  {len(candidates)} videos pass filters")

    if args.dry_run:
        for vid, _info, upload_iso, title in candidates:
            print(f"  [fetch] {vid}  {upload_iso}  {title[:80]}")
        return

    new_rows = []
    for j, (vid, info, _upload_iso, title) in enumerate(candidates):
        print(f"  [{j+1}/{len(candidates)}] fetching transcript for {vid}: {title[:60]}")
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
            frontmatter_extra={"dedup_basis": dedup_basis_label},
        )
        new_rows.append(row)
        print(f"    wrote {md_path.relative_to(corpus_root)} ({row['word_count']} words)")
        if args.sleep_between and j < len(candidates) - 1:
            time.sleep(args.sleep_between)

    if not new_rows:
        print("no new episodes fetched")
        return

    update_index(index_path, new_rows)
    print(f"updated {index_path}: {len(new_rows)} new rows")


if __name__ == "__main__":
    main()
