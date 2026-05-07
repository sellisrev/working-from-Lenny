#!/usr/bin/env python3
"""
fetch_how_i_ai.py: pull YouTube auto-captions from the How I AI podcast channel,
convert to clean markdown, and write to <corpus>/04-how-i-ai/.

How I AI is Claire Vo's AI-workflow-focused podcast in Lenny's Podcast Network.
Transcripts are not published as a downloadable archive; YouTube auto-captions
are the next-best machine-readable source. They're lower-quality than the
human-edited Lenny transcripts, so each output file is tagged
`transcript_quality: auto` and the lenny-actualize skill weights them as a
secondary signal: reinforcing when they agree with a decay already detected
in the main corpus, warning when they contradict the main corpus alone.

Pipeline:
  1. yt-dlp `--flat-playlist` lists channel videos (PO-token-friendly).
  2. yt-dlp `--dump-json` (single-video) fetches metadata.
  3. youtube_transcript_api fetches captions (bypasses the PO-token blockade
     that yt-dlp hits when it tries to download subtitle URLs directly).
  4. Captions are deduped, normalized, written as markdown with frontmatter.
  5. `<corpus>/04-how-i-ai/_index.json` is updated.

Requires:
  pip3 install --user yt-dlp youtube-transcript-api

Usage:
  python3 fetch_how_i_ai.py --corpus <path> [--limit N] [--newest-only]
                            [--channel <url>] [--skip-existing] [--dry-run]
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import subprocess
import sys
import time
from pathlib import Path

DEFAULT_CHANNEL = "https://www.youtube.com/@howiaipodcast/videos"


def slugify(s: str, max_len: int = 60) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:max_len].rstrip("-")


def list_videos(channel_url: str, limit):
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--flat-playlist",
        "--dump-json",
        "--no-warnings",
        channel_url,
    ]
    if limit is not None:
        cmd += ["--playlist-end", str(limit)]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.returncode != 0:
        sys.exit(f"yt-dlp listing failed:\n{proc.stderr}")
    out = []
    for line in proc.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            d = json.loads(line)
        except json.JSONDecodeError:
            continue
        out.append({
            "id": d.get("id"),
            "title": d.get("title") or "",
        })
    return out


def fetch_metadata(video_id: str):
    """Use yt-dlp --dump-json on a single video URL (no subtitle download)."""
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--dump-json",
        "--skip-download",
        "--no-warnings",
        f"https://www.youtube.com/watch?v={video_id}",
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.returncode != 0 or not proc.stdout.strip():
        return None
    try:
        return json.loads(proc.stdout.splitlines()[0])
    except (json.JSONDecodeError, IndexError):
        return None


def fetch_transcript(video_id: str, languages=("en",)):
    """Use youtube-transcript-api to fetch captions.

    Returns list of {text, start, duration} or None if unavailable.
    Tries the new fetch() API first, falls back to the legacy classmethod.
    """
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        sys.exit("youtube-transcript-api required: pip3 install --user youtube-transcript-api")

    try:
        api = YouTubeTranscriptApi()
        fetched = api.fetch(video_id, languages=list(languages))
        return [{"text": s.text, "start": s.start, "duration": s.duration} for s in fetched]
    except AttributeError:
        try:
            return YouTubeTranscriptApi.get_transcript(video_id, languages=list(languages))
        except Exception as e:
            print(f"    [warn] transcript fetch failed (legacy): {e}", file=sys.stderr)
            return None
    except Exception as e:
        print(f"    [warn] transcript fetch failed: {e}", file=sys.stderr)
        return None


def transcript_to_text(segments) -> str:
    """Join caption segments into clean prose. Drop adjacent duplicates and
    rolling-window repeats common in YouTube auto-captions."""
    pieces: list[str] = []
    last = ""
    for s in segments:
        text = (s.get("text") or "").strip()
        if not text:
            continue
        text = re.sub(r"\s+", " ", text)
        text = text.replace("[Music]", "").replace("[Applause]", "").strip()
        if not text:
            continue
        if text == last:
            continue
        if last and (text in last or last in text) and abs(len(text) - len(last)) < 40:
            if len(text) > len(last):
                pieces[-1] = text
                last = text
            continue
        pieces.append(text)
        last = text

    paragraphs: list[str] = []
    buf: list[str] = []
    char_count = 0
    for p in pieces:
        buf.append(p)
        char_count += len(p) + 1
        if char_count > 600 and (p.endswith(".") or p.endswith("?") or p.endswith("!")):
            paragraphs.append(" ".join(buf))
            buf = []
            char_count = 0
    if buf:
        paragraphs.append(" ".join(buf))
    return "\n\n".join(paragraphs)


def write_markdown(out_dir: Path, info: dict, body: str, video_id: str, channel_url: str):
    title = info.get("title") or video_id
    upload_date_raw = info.get("upload_date")
    if upload_date_raw and len(upload_date_raw) == 8:
        date_str = f"{upload_date_raw[0:4]}-{upload_date_raw[4:6]}-{upload_date_raw[6:8]}"
    else:
        date_str = None
    description = (info.get("description") or "").strip()
    duration = info.get("duration")
    word_count = len(body.split())

    slug = slugify(title) or video_id
    md_path = out_dir / f"{slug}.md"
    n = 2
    while md_path.exists():
        md_path = out_dir / f"{slug}-{n}.md"
        n += 1

    safe_title = title.replace('"', "'")
    fm_lines = [
        "---",
        f'title: "{safe_title}"',
        f'date: "{date_str or ""}"',
        'type: "how-i-ai"',
        'host: "Claire Vo"',
        'transcript_quality: "auto"',
        f'youtube_id: "{video_id}"',
        f'youtube_url: "https://www.youtube.com/watch?v={video_id}"',
        f"duration_seconds: {duration if duration is not None else 'null'}",
        f"word_count: {word_count}",
        f'source_channel: "{channel_url}"',
        "---",
        "",
    ]
    if description:
        truncated = description[:600] + ("..." if len(description) > 600 else "")
        fm_lines += ["> " + truncated.replace("\n", "\n> "), ""]
    fm_lines.append(body)
    md_path.write_text("\n".join(fm_lines), encoding="utf-8")

    row = {
        "id": slug,
        "kind": "how-i-ai",
        "filename": f"04-how-i-ai/{md_path.name}",
        "title": title,
        "date": date_str,
        "guest_or_author": "",
        "host": "Claire Vo",
        "transcript_quality": "auto",
        "youtube_id": video_id,
        "youtube_url": f"https://www.youtube.com/watch?v={video_id}",
        "duration_seconds": duration,
        "word_count": word_count,
    }
    return md_path, row


def update_index(index_path: Path, new_rows):
    if index_path.exists():
        try:
            existing = json.loads(index_path.read_text())
        except Exception:
            existing = {"rows": []}
    else:
        existing = {"rows": []}
    by_id = {r["youtube_id"]: r for r in existing.get("rows", [])}
    for r in new_rows:
        by_id[r["youtube_id"]] = r
    rows = sorted(by_id.values(), key=lambda r: r.get("date") or "0000-00-00")
    existing.update({
        "schema_version": "1.0",
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "row_count": len(rows),
        "rows": rows,
    })
    index_path.write_text(json.dumps(existing, indent=2, ensure_ascii=False))


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
    out_dir = corpus_root / "04-how-i-ai"
    out_dir.mkdir(parents=True, exist_ok=True)
    index_path = out_dir / "_index.json"

    limit = 1 if args.newest_only else args.limit
    print(f"listing videos from {args.channel} (limit={limit})...")
    videos = list_videos(args.channel, limit)
    if not videos:
        sys.exit("no videos returned by yt-dlp; check channel URL or network")
    print(f"  found {len(videos)} videos")

    existing_ids = set()
    if args.skip_existing and index_path.exists():
        try:
            existing_ids = {r["youtube_id"] for r in json.loads(index_path.read_text()).get("rows", []) if r.get("youtube_id")}
        except Exception:
            pass

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
        md_path, row = write_markdown(out_dir, info, body, vid, args.channel)
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
