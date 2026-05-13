---
app-id: 52
app-name: How [You] Build Product
phase: 0
type: structured-input + LLM-generated parody (multi-mode)
updated: 2026-05-13
---

# Parody prompt — #52 How [You] Build Product

> Parody of the breathless-reverence-profile genre. The prompt holds the structure; the LLM fills in the earnest treatment of whatever the user pasted.
>
> Updated 2026-05-13: replaced free-form paste box with structured fields and added two new modes alongside the original reverence profile. The original "paste a sentence" version had no replay value; structured input scaffolds the joke and the mode toggle gives the parody somewhere to go after the first read.

## Structured input

Four fields collected by the page:

| Field | Type | Placeholder / example |
|---|---|---|
| Team composition | Three number inputs: PMs, engineers, designers | 3 / 9 / 2 |
| Tools you use | Comma-separated text | "Notion, Linear, Slack" |
| Rituals you have | Comma-separated text | "Mon/Wed/Fri standups, pinned roadmap, Friday demos" |
| Last thing you shipped | Short text (one sentence) | "the new onboarding flow last quarter" |

These get assembled into a `[INPUT]` block that every mode's prompt receives:

```
Team composition: {pm_count} PMs, {eng_count} engineers, {des_count} designers
Tools used: {tools}
Rituals: {rituals}
Last shipped: {last_shipped}
```

## Three modes

User picks one mode at a time. Each mode is a separate prompt structure that wraps the same `[INPUT]` block.

### Mode: `reverence-profile` (default)

The original parody. 600-900 word reverence profile in six sections.

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
{structured_input_block}
```

### Mode: `linkedin-humblebrag` (new)

Short. One paragraph. The LinkedIn post the founder would write to celebrate a banal artifact as the secret of the team's success. Ends with the engagement-bait question to the comment section.

```
You are writing the LinkedIn post a startup founder would write about
their own team. It is a humblebrag: the post celebrates a banal team
artifact (a tool, a meeting, a doc) as if it were the secret of the
company's success. The tone is earnest with one slight tell that the
author is overstating things — a hedge, a contradictory aside, or a
suspiciously specific detail.

Format:
- One short opening line that sounds like a confession or a "real
  talk" admission.
- One paragraph (3-5 sentences) that elevates a specific tool or
  ritual from the input into a methodology.
- One closing line that asks the LinkedIn comment section a
  rhetorical question. Bait for engagement.
- 100-150 words total. No hashtags. No emojis except optional one
  at the very start if it fits.

Constraints:
- No AI tells: no "delve", "leverage", "unlock", "unpack", "in
  today's fast-paced".
- Reference at least one specific tool or ritual from the input.
- The "tell" should be subtle — not a wink at the reader, just a
  word or phrase that a real over-poster would write without
  realizing.

User input follows [INPUT].

[INPUT]
{structured_input_block}
```

### Mode: `acquired-cold-open` (new)

Acquired-podcast-style cold open. 80-120 words. The narrative cadence is the joke — slow setup, mythologized small choice, hook line at the end.

```
You are writing the cold open for an Acquired podcast episode about
a small product team. The cold open is 80-120 words and establishes
the team's mythology through one specific story — a meeting, a tool
adoption, a hallway conversation. The cadence is the joke: confident,
slightly slowed-down, every line earns the next one, never deliver
the punchline directly.

Format:
- 4-6 short sentences, each its own beat.
- Tell one specific story drawn from the input (a ritual, a tool,
  a recent ship). Mythologize one small detail.
- End with a hook line that promises the rest of the episode (e.g.,
  "This is the story of how that one pinned Slack thread became the
  reason they shipped on time." or "In this episode, we go inside
  the room where that decision was made.")

Constraints:
- No AI tells.
- No music cues, no episode numbers, no production notes — only the
  narrator's words.
- Reference at least one specific tool or ritual from the input by
  name (not paraphrased).
- The narrator never acknowledges the smallness of the team. The
  reverence is total.

User input follows [INPUT].

[INPUT]
{structured_input_block}
```

## Phase 0 URL-trick handoff

Page assembles the structured input block, picks the right prompt template based on the mode, fills in the `[INPUT]` slot, URL-encodes the whole prompt, and opens `claude.ai/new?q=<encoded>`. The user's Claude subscription generates the output.

URL template:
```
https://claude.ai/new?q={url_encoded_prompt}
```

Encoded prompts: reverence-profile is ~3-5 KB; LinkedIn and Acquired modes are smaller. All fit comfortably in claude.ai's URL.

## Phase 1 Worker inference

Same three prompts submitted to Gemini Flash via the Cloudflare Worker. Output streams back to the page.

User input is NOT logged.

## Phase 2 MCP App

Tool callable from inside Claude Desktop with mode selection. State: optional "team profile" saved per user, default off — lets the user iterate the input over time and try different modes against the same team description.

## Example structured input

| Field | Example value |
|---|---|
| PM count | 3 |
| Engineer count | 9 |
| Designer count | 2 |
| Tools | Notion, Linear, Slack |
| Rituals | Mon/Wed/Fri standups, pinned roadmap, Friday demos |
| Last shipped | the new onboarding flow last quarter |

Assembled `[INPUT]` block:
```
Team composition: 3 PMs, 9 engineers, 2 designers
Tools used: Notion, Linear, Slack
Rituals: Mon/Wed/Fri standups, pinned roadmap, Friday demos
Last shipped: the new onboarding flow last quarter
```

## Expected output flavor per mode (for QA, not shipped)

**Reverence profile (excerpt):**

> The Tuesday cadence is not a meeting. It is the operating system of how their product gets shipped.

> Architecture diagram:
> ```
> ┌─────────────────────┐
> │   the Atlas KG      │  (Notion)
> │   (single source)   │
> └──────────┬──────────┘
>            │
>            ▼
> ┌─────────────────────┐      ┌─────────────────────┐
> │   the Throughput    │ ←──→ │   the Signal mesh   │
> │   engine (Linear)   │      │   (Slack pinned     │
> │                     │      │    threads)         │
> └─────────────────────┘      └─────────────────────┘
> ```

**LinkedIn humblebrag (excerpt):**

> Most founders treat their pinned Slack threads like a junk drawer. We treat ours like a load-bearing wall. The team's roadmap has lived in one pinned thread for fourteen months and counting. (We've re-pinned it twice. That's not a metric we share often.) Three PMs, nine engineers, two designers — and a Slack thread that, on a quiet Tuesday, is doing more for our org clarity than the last three offsites combined.
>
> Curious: where does YOUR team's roadmap live? Be honest.

**Acquired cold-open (excerpt):**

> Three PMs. Nine engineers. Two designers. And a Slack thread that, depending on who you ask, is either a coincidence or the reason the company shipped on time last quarter. It started, as these things do, with a question Marcus asked over coffee in February. He didn't expect it to outlast the offsite. In this episode, we go inside the team that turned a pinned message into an operating system.
