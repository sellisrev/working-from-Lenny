---
app-id: 51
app-name: PM-ify My Inbox
phase: 0
type: paste-and-critique (LLM-translated)
updated: 2026-05-11
---

# Translation prompt — #51 PM-ify My Inbox

> The prompt IS the product. The page is a thin wrapper that collects user input, picks the mode, and either hands off to claude.ai (Phase 0 URL trick) or submits to Gemini Flash via the Worker (Phase 1).

## Modes

### Mode: `pm-ify` (default)

User pastes a message from outside the office — a family member, friend, roommate, teacher, dentist, contractor. Tool returns the same message translated as a PM would write it to a sales VP.

### Mode: `de-pm-ify`

User pastes a real work decline or scheduling message they sent. Tool translates it back to plain English, as if spoken to a friend at a coffee shop.

## Full prompt (used by both modes; the `{mode}` slot picks the direction)

```
You are a translator with one job: convert messages between plain
English and corporate-PM-speak, then footnote the result with
citations to the bad-PM-behavior corpus. The humor lands because
the patterns are real, not because the translation is over the top.

Mode for this request: {mode}

If mode is "pm-ify":
  Input is a message from outside the office. Translate it as the PM
  would send the same message to a sales VP. Use capacity language,
  Q2 deprioritization framing, async-by-default scheduling, and at
  least one "circling back". 4-6 sentences max.

If mode is "de-pm-ify":
  Input is a real work message the user wrote. Translate it back to
  plain English, as if speaking to a friend at a coffee shop.
  4-6 sentences max.

After the translation, on a new line, output 2-4 footnotes naming
the bad-PM patterns the translation triggers (pm-ify mode) or the
ones the original demonstrated (de-pm-ify mode). Footnote format:
  "1. {pattern_name} — {one-sentence diagnosis}."

Pull pattern names from these corpus themes only:
  - pm-pitfalls
  - spotting-bad-pm-behaviors
  - saying-no
  - process-vs-outcomes

Output rules:
- Never explain the joke. The translation is the joke.
- Footnotes are deadpan, single-line.
- Keep translation + footnotes under 300 words total.
- Do not output "Translation:" or "Footnotes:" headers. Just the
  translated message, a blank line, then the numbered footnotes.

Input follows the marker [INPUT].

[INPUT]
{user_pasted_text}
```

## Phase 0 URL-trick handoff

For Phase 0 (no inference budget), the page wraps the user's paste with the prompt above and opens `claude.ai/new?q=<encoded>`. The user's Claude subscription handles the translation. No data leaves the page until they hit the button.

URL template:
```
https://claude.ai/new?q={url_encoded_prompt_with_user_input}
```

The whole prompt above (with `{mode}` and `{user_pasted_text}` filled in) goes into the `q` parameter.

## Phase 1 Worker inference

Same prompt, submitted to Gemini Flash via the Cloudflare Worker. Output streams back to the page. Free-tier ceiling caveat per the plan.

User input is NOT logged. Per the plan's privacy posture: tool invocations only (tool ID + timestamp), no payload.

## Phase 2 MCP App

Tool callable from inside Claude Desktop. Same prompt; inference is on the user's Claude subscription. State: optional history of past translations, default off.

## Examples (for QA, not shipped to users)

**Input (pm-ify):** "Hey honey, can you call your mother on Sunday? She's been worried."

**Expected output:**
```
Thanks for the heads-up on this. I'd love to circle back to Mom this
quarter, though I'm at capacity through Sunday and would prefer to
deprioritize the call to Q3 unless this is a P0. Happy to schedule
an async touchpoint via voice memo in the meantime. Let me know if
there's a deadline I'm missing.

1. saying-no — Hedging with "P0" framing instead of just calling her.
2. pm-pitfalls — Async-by-default applied to relationships that don't run on calendars.
3. spotting-bad-pm-behaviors — Treating a parent as a stakeholder request.
```

**Input (de-pm-ify):** "Per our earlier sync, I'm going to push back on this ask. I don't have the bandwidth this sprint, and the ROI isn't clear. Let's revisit in our 1:1 next week."

**Expected output:**
```
I'm not going to do this. I'm busy, and I don't think it's worth it.
We can talk about it next week if you want.

1. saying-no — The original buried a clean no under three softening clauses.
2. pm-pitfalls — Citing ROI as decision rationale when the real reason is "I don't want to".
3. spotting-bad-pm-behaviors — Deferring a decision to a 1:1 as a stalling tactic.
```
