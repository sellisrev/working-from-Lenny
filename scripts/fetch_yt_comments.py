#!/usr/bin/env python3
"""
fetch_yt_comments.py: pull top YouTube comments by likes for Lenny + How I AI episodes.

Audience pushback comments are a high-signal source of bad-advice flags. When a
guest says something widely seen as out of touch (e.g., "no day off is a good
practice"), the most-upvoted comments often say so directly. This script
captures them so the lenny-actualize skill can produce `cautions/<topic>.md`
entries flagging guest claims to treat with extreme skepticism.

Pipeline:
  1. For each episode that has a YouTube ID (Lenny episodes searched via yt-dlp,
     How I AI episodes have IDs in `04-how-i-ai/_index.json`), fetch comments
     via youtube-comment-downloader (no auth needed for public comments).
  2. Keep top-N by vote count, normalize vote integers (handles "1.2K" etc).
  3. Write `<corpus>/05-comments/<episode-id>.json` with metadata + comment list.
  4. Maintain `<corpus>/05-comments/_index.json` mapping episode_id -> source +
     date + comment count + max votes.

Two consumption modes:
  - `--episode <youtube-id>` — fetch one episode (use when you already know the ID).
  - `--from-corpus <path>` — auto-discover all How I AI episodes (have IDs) and
    optionally Lenny episodes (resolved via search).
  - `--lenny-episode <slug>` — resolve Lenny episode slug to YouTube ID via search,
    then fetch.

Usage:
  python3 fetch_yt_comments.py --episode xCd9ykretlg --corpus <path>
  python3 fetch_yt_comments.py --lenny-episode keith-rabois --corpus <path>
  python3 fetch_yt_comments.py --from-corpus <path> --include-lenny --max-episodes 20

Requires: pip3 install --user youtube-comment-downloader yt-dlp
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


def parse_votes(v) -> int:
    """Convert YouTube's vote string ("1.2K", "856", "0") to int."""
    if isinstance(v, int):
        return v
    s = str(v or "").strip().upper().replace(",", "")
    if not s or s == "0":
        return 0
    try:
        if s.endswith("K"):
            return int(float(s[:-1]) * 1_000)
        if s.endswith("M"):
            return int(float(s[:-1]) * 1_000_000)
        return int(float(s))
    except ValueError:
        return 0


def fetch_comments(video_id: str, max_comments: int = 50) -> list[dict]:
    """Fetch up to `max_comments` comments sorted by popularity."""
    try:
        from youtube_comment_downloader import YoutubeCommentDownloader, SORT_BY_POPULAR
    except ImportError:
        sys.exit("youtube-comment-downloader required: pip3 install --user youtube-comment-downloader")

    dl = YoutubeCommentDownloader()
    url = f"https://www.youtube.com/watch?v={video_id}"
    out: list[dict] = []
    try:
        gen = dl.get_comments_from_url(url, sort_by=SORT_BY_POPULAR)
        for i, c in enumerate(gen):
            out.append({
                "votes": parse_votes(c.get("votes", 0)),
                "votes_raw": str(c.get("votes", "0")),
                "author": c.get("author") or "",
                "text": (c.get("text") or "").strip(),
                "time": c.get("time") or "",
                "comment_id": c.get("cid") or "",
                "reply_count": c.get("reply_count") or 0,
                "heart": bool(c.get("heart", False)),
            })
            if len(out) >= max_comments:
                break
    except Exception as e:
        print(f"    [warn] comment fetch failed for {video_id}: {e}", file=sys.stderr)
    out.sort(key=lambda c: c["votes"], reverse=True)
    return out


def search_lenny_youtube_id(slug: str, title: str = "") -> tuple[str | None, str | None]:
    """Resolve a Lenny podcast filename slug + title to a YouTube ID via yt-dlp search."""
    query = f"Lenny's Podcast {title or slug.replace('-', ' ')}"
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--print", "%(id)s||%(title)s||%(channel)s",
        "--default-search", "ytsearch3:",
        "--no-warnings",
        query,
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.returncode != 0:
        return None, None
    for line in proc.stdout.splitlines():
        line = line.strip()
        if "||" not in line:
            continue
        parts = line.split("||")
        if len(parts) < 3:
            continue
        vid, vtitle, channel = parts[0], parts[1], parts[2]
        if "Lenny" in channel:
            return vid, vtitle
    return None, None


def write_episode_comments(out_dir: Path, video_id: str, source: str,
                           episode_slug: str, episode_title: str,
                           episode_date: str | None, comments: list[dict]) -> dict:
    out_dir.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema_version": "1.0",
        "fetched_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "youtube_id": video_id,
        "youtube_url": f"https://www.youtube.com/watch?v={video_id}",
        "source_corpus": source,
        "episode_slug": episode_slug,
        "episode_title": episode_title,
        "episode_date": episode_date,
        "comment_count": len(comments),
        "max_votes": comments[0]["votes"] if comments else 0,
        "comments": comments,
    }
    fpath = out_dir / f"{video_id}.json"
    fpath.write_text(json.dumps(payload, indent=2, ensure_ascii=False))
    return {
        "youtube_id": video_id,
        "youtube_url": payload["youtube_url"],
        "source_corpus": source,
        "episode_slug": episode_slug,
        "episode_title": episode_title,
        "episode_date": episode_date,
        "comment_count": len(comments),
        "max_votes": payload["max_votes"],
        "fetched_at": payload["fetched_at"],
        "filename": f"05-comments/{fpath.name}",
    }


def update_index(index_path: Path, new_rows: list[dict]) -> None:
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
    rows = sorted(by_id.values(), key=lambda r: r.get("episode_date") or "0000-00-00")
    existing.update({
        "schema_version": "1.0",
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "row_count": len(rows),
        "rows": rows,
    })
    index_path.write_text(json.dumps(existing, indent=2, ensure_ascii=False))


def fetch_one(corpus_root: Path, video_id: str, source: str, slug: str,
              title: str, date_str: str | None, max_comments: int,
              out_dir: Path, index_rows: list[dict]) -> None:
    print(f"  fetching comments for {video_id} ({source}: {slug[:50]})")
    comments = fetch_comments(video_id, max_comments=max_comments)
    if not comments:
        print(f"    [warn] no comments retrieved for {video_id}")
        return
    row = write_episode_comments(out_dir, video_id, source, slug, title, date_str, comments)
    index_rows.append(row)
    print(f"    wrote {row['filename']}: {row['comment_count']} comments, max_votes={row['max_votes']}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", required=True, help="corpus root; outputs go to <corpus>/05-comments/")
    ap.add_argument("--episode", default=None, help="single YouTube ID")
    ap.add_argument("--lenny-episode", default=None, help="Lenny episode slug (filename stem)")
    ap.add_argument("--from-corpus", action="store_true", help="walk 04-how-i-ai/_index.json")
    ap.add_argument("--include-lenny", action="store_true", help="also resolve Lenny episodes via YouTube search")
    ap.add_argument("--max-episodes", type=int, default=None, help="cap when iterating")
    ap.add_argument("--max-comments", type=int, default=50, help="top-N comments per episode")
    ap.add_argument("--skip-existing", action="store_true")
    ap.add_argument("--sleep-between", type=float, default=2.0)
    args = ap.parse_args()

    corpus_root = Path(args.corpus).expanduser().resolve()
    out_dir = corpus_root / "05-comments"
    out_dir.mkdir(parents=True, exist_ok=True)
    index_path = out_dir / "_index.json"

    existing_ids = set()
    if args.skip_existing and index_path.exists():
        try:
            existing_ids = {r["youtube_id"] for r in json.loads(index_path.read_text()).get("rows", []) if r.get("youtube_id")}
        except Exception:
            pass

    new_rows: list[dict] = []

    if args.episode:
        if args.skip_existing and args.episode in existing_ids:
            print(f"  [skip] {args.episode} already indexed")
        else:
            fetch_one(corpus_root, args.episode, "manual", args.episode, "", None,
                      args.max_comments, out_dir, new_rows)

    if args.lenny_episode:
        slug = args.lenny_episode
        skill_root = Path(__file__).resolve().parent.parent
        norm = json.loads((skill_root / "references" / "_corpus_normalized.json").read_text())
        row = next((r for r in norm["rows"] if r["id"] == slug and r["kind"] == "podcast"), None)
        if not row:
            sys.exit(f"Lenny episode '{slug}' not in normalized corpus")
        title = row["title"]
        date_str = row.get("date")
        print(f"resolving YouTube ID for Lenny episode '{slug}'...")
        vid, found_title = search_lenny_youtube_id(slug, title)
        if not vid:
            sys.exit(f"could not resolve YouTube ID for {slug}")
        print(f"  resolved -> {vid} ({found_title})")
        if args.skip_existing and vid in existing_ids:
            print(f"  [skip] {vid} already indexed")
        else:
            fetch_one(corpus_root, vid, "lenny-podcast", slug, title, date_str,
                      args.max_comments, out_dir, new_rows)

    if args.from_corpus:
        hia_index = corpus_root / "04-how-i-ai" / "_index.json"
        if hia_index.exists():
            hia_rows = json.loads(hia_index.read_text()).get("rows", [])
            if args.max_episodes:
                hia_rows = hia_rows[-args.max_episodes:]
            print(f"iterating {len(hia_rows)} How I AI episodes...")
            for i, r in enumerate(hia_rows):
                vid = r.get("youtube_id")
                if not vid:
                    continue
                if args.skip_existing and vid in existing_ids:
                    print(f"  [skip] {vid} already indexed")
                    continue
                fetch_one(corpus_root, vid, "how-i-ai", r.get("id", ""),
                          r.get("title", ""), r.get("date"),
                          args.max_comments, out_dir, new_rows)
                if args.sleep_between and i < len(hia_rows) - 1:
                    time.sleep(args.sleep_between)

        if args.include_lenny:
            skill_root = Path(__file__).resolve().parent.parent
            norm = json.loads((skill_root / "references" / "_corpus_normalized.json").read_text())
            podcast_rows = [r for r in norm["rows"] if r["kind"] == "podcast"]
            podcast_rows.sort(key=lambda r: r.get("date") or "0000-00-00", reverse=True)
            if args.max_episodes:
                podcast_rows = podcast_rows[: args.max_episodes]
            print(f"iterating {len(podcast_rows)} Lenny podcast episodes...")
            for i, r in enumerate(podcast_rows):
                slug = r["id"]
                title = r["title"]
                vid, _ = search_lenny_youtube_id(slug, title)
                if not vid:
                    print(f"  [warn] could not resolve {slug}")
                    continue
                if args.skip_existing and vid in existing_ids:
                    print(f"  [skip] {vid} ({slug}) already indexed")
                    continue
                fetch_one(corpus_root, vid, "lenny-podcast", slug, title, r.get("date"),
                          args.max_comments, out_dir, new_rows)
                if args.sleep_between and i < len(podcast_rows) - 1:
                    time.sleep(args.sleep_between)

    if not new_rows:
        print("no new comment files written")
        return

    update_index(index_path, new_rows)
    print(f"updated {index_path}: {len(new_rows)} new rows")


if __name__ == "__main__":
    main()
