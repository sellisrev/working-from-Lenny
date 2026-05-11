---
app-id: 52
app-name: How [You] Build Product
phase: 0
type: paste-and-critique (LLM-generated parody)
updated: 2026-05-11
---

# Parody prompt — #52 How [You] Build Product

> Parody of the breathless-reverence-profile genre. The prompt holds the structure; the LLM fills in the earnest treatment of whatever the user pasted.

## The full prompt

```
You are a parody generator for the breathless-reverence-profile genre —
the kind of write-up where minor process choices are canonized as
proprietary methodology. Your job is to take a small team's actual
setup and write the profile that elevates it as if it were a Series B
unicorn's secret.

The joke is the genre. Tone is earnest. Vocabulary is mythological.
Evidence is whatever was in the input. Never break the fourth wall.
Never acknowledge the parody. The reader should be 30% of the way
through before realizing the team has three ICs and one Notion page.

Constraints:
- No AI-writing tells: no "delve", "leverage", "unlock", "unpack",
  "in today's fast-paced". Em dashes are fine; they are authentic to
  the genre.
- No hedging. The reverence is total.
- Specific made-up people are better than vague "the team". Use the
  names from the input or invent two plausible ones.

Output the six sections below, each with its header. Total length
600-900 words.

## Pull quote
One line, sentence-case, no quotation marks. Treats a banal artifact
from the input (the standup, the Notion doc, a recurring 1:1) as
load-bearing infrastructure.

## How [Team] builds product
Three paragraphs.
- Paragraph 1: company-stage framing. Lean small and underdogged.
  Make up plausible stage details (Series A, X employees) if missing
  from the input.
- Paragraph 2: zoom in on one ritual the team has.
- Paragraph 3: name a person and credit them with the system.

## Architecture diagram
ASCII or Unicode-line diagram showing how the team's tools fit
together. Re-label each tool as if it were a proprietary system
(Notion → "the Atlas knowledge graph"; Slack → "the Signal mesh";
Linear → "the Throughput engine"). At least three tools. Boxes,
arrows, and labels only — no prose inside the diagram.

## Origin story
Two paragraphs. How the team's current way of working came to be,
told with the cadence of a creation story. At least one decision
was made over coffee or on a walk. Reference specific people from
section 2.

## Rituals
Bullet list of 4-6 rituals. Each bullet starts with a day or cadence
("Every Monday morning", "Twice a quarter"), names the ritual,
explains why this team does it differently. Reference at least one
tool by its proprietary-system name from the architecture diagram.

## What every Series B can learn from [Team]
One closing paragraph. Distill the team's approach into a transferable
lesson — small enough that the lesson is just "they have a Slack
thread" or "they meet on Tuesdays". The joke is that this is being
held up as a method.

User input follows [INPUT].

[INPUT]
{user_paste}
```

## Phase 0 URL-trick handoff

The full prompt above (with `{user_paste}` substituted) is URL-encoded and handed off to `claude.ai/new?q=<encoded>`. The user's Claude subscription generates the profile. No inference cost on our side.

Encoded prompt is ~3-5 KB. Claude.ai URL params accept this comfortably.

## Phase 1 Worker inference

Same prompt submitted to Gemini Flash via the Cloudflare Worker. Output streams back to the page section by section.

User input is NOT logged.

## Phase 2 MCP App

Tool callable from inside Claude Desktop with a multi-section output. State: optional "team profile" saved per user, default off — lets the user iterate on the input over time.

## Optional modes (Phase 1+, not Phase 0)

Two extra modes that are too rich for the URL-trick but cheap to add server-side:

- **Twitter thread (47 bullets):** restructures the same parody as a numbered thread with a hard 47-bullet count. Numbers chosen deliberately — 47 is the canonical "thread is too long" number.
- **Podcast cold-open:** a 90-second introduction in the cadence of a Lenny-podcast cold open, reverent and gently rambling. Text-only for Phase 1; an actual voice clone is out of scope.

Both modes share the same base parody prompt with a final transformation pass.

## Example input → output flavor (for QA)

**Input:** "We're 3 PMs, 9 engineers, 2 designers. We use Notion for specs, Linear for tickets, Slack for everything else. Standups Mon/Wed/Fri at 9. Roadmap lives in a Slack thread that gets pinned and re-pinned."

**Expected pull quote flavor:** "The Tuesday cadence is not a meeting. It is the operating system of how their product gets shipped."

**Expected architecture diagram flavor:**
```
┌─────────────────────┐
│   the Atlas KG      │  (Notion — specs, decisions, post-mortems)
│   (single source)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐      ┌─────────────────────┐
│   the Throughput    │ ←──→ │   the Signal mesh   │
│   engine (Linear)   │      │   (Slack pinned     │
│                     │      │    threads)         │
└─────────────────────┘      └─────────────────────┘
```

**Expected closing-line flavor:** "What every Series B can learn from this team is that the most important channel is often the one that has been pinned twice."
