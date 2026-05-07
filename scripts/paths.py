"""
paths: shared resolver for the per-user lenny-actualize state directory.

Layout under the home dir (default `~/.lenny-actualize/`):
  profiles/default.yml      auto-inferred multi-faceted profile
  memory/default.md         append-only invocation log
  decisions/default.md      append-only divergence log

Override the base via the `LENNY_ACTUALIZE_HOME` env var (useful for tests
and for running multiple isolated user profiles on one machine).
"""
from __future__ import annotations

import os
from pathlib import Path

DEFAULT_SLUG = "default"


def home_dir() -> Path:
    override = os.environ.get("LENNY_ACTUALIZE_HOME")
    base = Path(override) if override else Path.home() / ".lenny-actualize"
    base.mkdir(parents=True, exist_ok=True)
    return base


def profiles_dir() -> Path:
    p = home_dir() / "profiles"
    p.mkdir(parents=True, exist_ok=True)
    return p


def memory_dir() -> Path:
    p = home_dir() / "memory"
    p.mkdir(parents=True, exist_ok=True)
    return p


def decisions_dir() -> Path:
    p = home_dir() / "decisions"
    p.mkdir(parents=True, exist_ok=True)
    return p


def profile_path(slug: str = DEFAULT_SLUG) -> Path:
    return profiles_dir() / f"{slug}.yml"


def memory_path(slug: str = DEFAULT_SLUG) -> Path:
    return memory_dir() / f"{slug}.md"


def decisions_path(slug: str = DEFAULT_SLUG) -> Path:
    return decisions_dir() / f"{slug}.md"
