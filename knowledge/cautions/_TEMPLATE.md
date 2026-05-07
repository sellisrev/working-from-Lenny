<!-- Template for knowledge/cautions/<slug>.md.

A "caution" is a guest claim that audience comments (high-votes pushback)
explicitly call out as bad/dangerous/disconnected-from-reality advice.

Cautions are NOT the same as obsolete advice:
  - Obsolete = was once correct, no longer fully holds (decay over time).
  - Caution = was probably never wise; reflects the speaker's blind spot,
    not a generally accepted prior practice.

Both types of advice should be flagged for the reader, but cautions get
surfaced even when there's no temporal decay signal.
-->
---
topic_slug: <slug>
display_name: <Display Name>
last_updated: YYYY-MM-DD
last_model: claude-<model>
---

# Caution: claims to treat with skepticism on <Display Name>

The corpus contains advice on this topic that audience pushback has flagged as
out-of-touch, ethically dubious, or not safely generalizable. Take these with
extreme care; they often come from speakers whose vantage point (extreme
wealth, privileged role, narrow context) makes their prescriptions a poor fit
for most readers.

## <Short claim summary>

- **Claim**: <full claim, paraphrased>
- **Said by**: <guest>, <episode/post title>, <YYYY-MM-DD>, <youtube_url>
- **Audience pushback (top comments by likes)**:
  - "<top comment text, truncated>" — <author>, <vote_count> votes
  - "<second comment>" — <author>, <vote_count> votes
- **Why this is flagged as a caution** (not just disagreement):
  - <e.g., "the speaker's frame requires a position of unusual privilege; uncritical adoption by general audience risks burnout, ethical issues, or career damage">
- **Where (if anywhere) the claim might still apply**:
  - <e.g., "founder-mode contexts where the founder owns the cost of being wrong; not for managers prescribing to reports">
- **Cross-checks**:
  - Other guests on similar topic: <list with links>
  - External authoritative sources: <list>
- **Confidence level**: high | medium | low — <rationale>

## <Short claim summary>

(repeat as needed)

## How this section was generated

- Source comments: `<corpus>/05-comments/<youtube-id>.json`
- Top comment threshold: claims surfaced when at least one comment with >= <N> votes (or >= <N>x median) explicitly disputes the claim, AND the dispute is substantive (not just snark).
- LLM screening: each candidate comment was checked for substantive critique vs noise. Removed: pure ad hominem, off-topic, single-word reactions.
- The reader should still apply their own judgment; this is a heuristic flag, not a verdict.
