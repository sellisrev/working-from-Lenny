---
name: pmify-inbox
description: Translate a message between plain English and corporate PM-speak, then footnote the result with deadpan citations to the bad-PM-behavior corpus. pm-ify takes a message from outside the office and renders it as a PM would write it to a sales VP (capacity language, Q2 deprioritization, async-by-default, a "circling back"); de-pm-ify takes a real work message and translates it back to how you'd say it to a friend at a coffee shop. Reads `knowledge/topics/`. Use when the user says "PM-ify this", "translate this into PM-speak", "de-corporate this message", "what would a PM say", or pastes a message and wants the joke. The Claude Code skill version of the Working from Lenny PM-ify My Inbox app.
---

# pmify-inbox

The skill version of the #51 PM-ify My Inbox. A two-mode translator with corpus-cited footnotes. The prompt is the product; there is no scoring engine and no state. A self-aware PM-meta humor app. Consumes the knowledge base for the footnote citations.

## Why this exists

The humor lands because the patterns are real, not because the translation is over the top. Translating a "call your mother" text into capacity-and-deprioritization language is funny precisely because it maps onto behaviors the corpus actually documents. The footnotes are the payload: each one names a real bad-PM pattern, deadpan and single-line.

## When to use

Trigger on "PM-ify this", "translate this into PM-speak", "de-corporate this message", "what would a PM say". Pick the mode from context: a message from outside the office defaults to pm-ify; a real work message the user wrote defaults to de-pm-ify.

## The two modes

```
pm-ify (default)  -- input is a message from outside the office (family, friend, dentist, contractor).
                     Translate it as the PM would send the same message to a sales VP. Use capacity
                     language, Q2 deprioritization framing, async-by-default scheduling, and at least
                     one "circling back". 4-6 sentences.
de-pm-ify         -- input is a real work decline/scheduling message the user sent. Translate it back to
                     plain English, as if speaking to a friend at a coffee shop. 4-6 sentences.
```

## The footnotes (the payload)

After the translation, on a new line, output 2-4 footnotes naming the bad-PM patterns the translation triggers (pm-ify) or the original demonstrated (de-pm-ify). Format: `"1. {pattern_name} - {one-sentence diagnosis}."` Pull pattern names from these corpus themes only: `pm-pitfalls`, `spotting-bad-pm-behaviors`, `saying-no`, and the process-vs-outcomes theme (grounded in `velocity-core4.md`; see anchors). The full prompt and worked examples live in `apps/51-pmify-inbox/prompt.md`.

## Output rules

- Never explain the joke. The translation is the joke.
- Footnotes are deadpan, single-line.
- Translation + footnotes under 300 words total.
- No "Translation:" or "Footnotes:" headers. Just the translated message, a blank line, then the numbered footnotes.

## Corpus anchors

- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/pm-pitfalls.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/spotting-bad-pm-behaviors.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/saying-no.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/velocity-core4.md (the "process-vs-outcomes" theme; substitution established for #53)

All four verified present. Check obsolete/caution layers.

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Deadpan. The footnotes are diagnostic, not winking. The corporate-speak in pm-ify mode should be plausible, not cartoonish.

## Workflow

1. Pick the mode from the pasted message (or honor an explicit mode request).
2. Translate per the mode's rules.
3. Append 2-4 footnotes from the four allowed corpus themes, one diagnosis line each.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The two modes are corpus-agnostic; the footnote pattern names re-anchor to another corpus's failure-mode themes.
