---
name: how-you-build
description: Generate a parody of the breathless-reverence-profile genre about a small product team, in one of three modes: a 600-900 word reverence profile (six sections, including an architecture diagram that relabels Notion/Slack/Linear as proprietary systems), a 100-150 word LinkedIn humblebrag, or an 80-120 word Acquired-podcast cold open. Takes team composition, tools, rituals, and the last thing shipped as structured input. Use when the user says "write a reverence profile of my team", "how [we] build product", "make my team sound like a unicorn", "write the LinkedIn post / Acquired cold open about my team". The Claude Code skill version of the Working from Lenny How [You] Build Product app.
---

# how-you-build

The skill version of the #52 How [You] Build Product. A generator that parodies the breathless-reverence-profile genre: it takes a small team's actual setup and writes the profile that elevates it as if it were a Series B unicorn's secret. The joke is the genre; the tone is earnest. A self-aware PM-meta humor app. No scoring, no state.

## Why this exists

The genre canonizes minor process choices as proprietary methodology. The parody works by playing it completely straight: the reader should be 30% of the way through before realizing the team has three ICs and one Notion page. Never break the fourth wall, never acknowledge the parody.

## When to use

Trigger on "write a reverence profile of my team", "how [we] build product", "make my team sound like a unicorn", "write the LinkedIn post / Acquired cold open about my team". Pick the mode the user names, default to reverence-profile.

## Structured input (collect or infer)

```
Team composition  -- PMs / engineers / designers (three numbers)
Tools used        -- comma-separated (e.g., Notion, Linear, Slack)
Rituals           -- comma-separated (e.g., Mon/Wed/Fri standups, pinned roadmap, Friday demos)
Last shipped      -- one sentence
```

## The three modes

```
reverence-profile (default) -- 600-900 words, six sections: Pull quote / How [Team] builds product (3 paras) /
   Architecture diagram (ASCII, relabels each tool as a proprietary system: Notion -> "the Atlas knowledge
   graph", Slack -> "the Signal mesh", Linear -> "the Throughput engine") / Origin story (2 paras, a decision
   made over coffee or on a walk) / Rituals (4-6 bullets, each starts with a cadence) / What every Series B can
   learn from [Team] (the lesson is just "they have a Slack thread").
linkedin-humblebrag -- 100-150 words. A confession-style opener, one paragraph elevating a banal artifact into a
   methodology, a rhetorical engagement-bait question to the comment section. One subtle "tell" of overstatement.
acquired-cold-open -- 80-120 words. 4-6 short sentences, each its own beat; mythologize one small detail from the
   input; end on a hook line. The cadence is the joke; never deliver the punchline directly.
```

The full per-mode prompts, constraints, and worked examples live in `apps/52-how-you-build/prompt.md`.

## Constraints

- Earnest tone, total reverence, no hedging. Never acknowledge the parody.
- Reference at least one specific tool or ritual from the input by name. Use the input's people names or invent two plausible ones.
- Architecture diagram is boxes, arrows, labels only; at least three tools; no prose inside the diagram.

## Voice rules

- No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Em dashes are acceptable in the generated output: they are authentic to the reverence-profile genre. (This is the one app where the no-em-dash rule does not apply to the rendered content; keep them out of the LinkedIn and Acquired modes' constraints as specified.)
- Mythological vocabulary, specific made-up details over vague "the team".

## Workflow

1. Collect or infer the four structured fields.
2. Pick the mode (default reverence-profile).
3. Generate per the mode's structure and constraints.

## Portability

This is a parody generator, not a corpus consumer: it does not read `knowledge/topics/`. It is bundled with the skills library for the humor set. Portable as-is to any team description.
