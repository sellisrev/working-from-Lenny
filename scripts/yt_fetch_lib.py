"""
yt_fetch_lib: shared YouTube auto-caption fetching engine.

Used by `fetch_how_i_ai.py` (Claire Vo's How I AI) and `fetch_lenny_yt.py`
(Lenny's main podcast). Both produce markdown files with `transcript_quality:
auto` frontmatter; the lenny-actualize skill weights such rows as a secondary
signal under the two-corpus weighting policy.

Pipeline used by both wrappers:
  1. yt-dlp `--flat-playlist` lists channel videos (PO-token-friendly).
  2. yt-dlp `--dump-json` (single-video) fetches metadata.
  3. youtube_transcript_api fetches captions (bypasses yt-dlp's PO-token
     blockade on direct subtitle URL downloads).
  4. Captions are deduped + normalized into prose paragraphs.
  5. Markdown written with frontmatter; `_index.json` updated.

Requires:
  pip3 install --user yt-dlp youtube-transcript-api
"""
from __future__ import annotations

import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path


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


def write_markdown(
    out_dir: Path,
    info: dict,
    body: str,
    video_id: str,
    channel_url: str,
    *,
    kind: str,
    fm_type: str,
    host: str,
    frontmatter_extra: dict | None = None,
):
    """Write a single video's markdown + return its index row.

    `kind` and `fm_type` typically match (e.g., "how-i-ai") but stay separate
    so callers can decorate. `frontmatter_extra` is appended to the YAML block
    verbatim (one line per key) for caller-specific provenance, e.g.
    `dedup_basis: "newer-than-corpus-max 2026-04-19"`.
    """
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
        f'type: "{fm_type}"',
        f'host: "{host}"',
        'transcript_quality: "auto"',
        f'youtube_id: "{video_id}"',
        f'youtube_url: "https://www.youtube.com/watch?v={video_id}"',
        f"duration_seconds: {duration if duration is not None else 'null'}",
        f"word_count: {word_count}",
        f'source_channel: "{channel_url}"',
    ]
    if frontmatter_extra:
        for k, v in frontmatter_extra.items():
            if isinstance(v, str):
                v_str = f'"{v}"'
            elif v is None:
                v_str = "null"
            else:
                v_str = str(v)
            fm_lines.append(f"{k}: {v_str}")
    fm_lines += ["---", ""]
    if description:
        truncated = description[:600] + ("..." if len(description) > 600 else "")
        fm_lines += ["> " + truncated.replace("\n", "\n> "), ""]
    fm_lines.append(body)
    md_path.write_text("\n".join(fm_lines), encoding="utf-8")

    row = {
        "id": slug,
        "kind": kind,
        "filename": f"{out_dir.name}/{md_path.name}",
        "title": title,
        "date": date_str,
        "guest_or_author": "",
        "host": host,
        "transcript_quality": "auto",
        "youtube_id": video_id,
        "youtube_url": f"https://www.youtube.com/watch?v={video_id}",
        "duration_seconds": duration,
        "word_count": word_count,
    }
    if frontmatter_extra:
        for k, v in frontmatter_extra.items():
            row[k] = v
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


def existing_ids_from_index(index_path: Path) -> set[str]:
    if not index_path.exists():
        return set()
    try:
        data = json.loads(index_path.read_text())
    except Exception:
        return set()
    return {r["youtube_id"] for r in data.get("rows", []) if r.get("youtube_id")}
