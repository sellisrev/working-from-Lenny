---
app-id: 51
app-name: PM-ify My Inbox
phase: 0
type: paste-and-critique (LLM-translated)
updated: 2026-05-11
---

# Page copy — #51 PM-ify My Inbox

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/pmify`:

- Mode toggle at the top: **PM-ify** (default) | **De-PM-ify**.
- Paste box below the toggle. Placeholder text rotates: "Mom asking you to call more often", "Roommate's grocery list", "Dentist appointment reminder" for PM-ify; "A real work decline you sent" for De-PM-ify.
- Submit button: "Translate" (PM-ify) or "Re-humanize" (De-PM-ify).
- Output renders below, in-page. Footnotes appear under the translation, each linking to the matching corpus topic page.

No preamble above the toggle. The paste box is the landing.

Below the output:
- `share this translation` (copies a URL with the input + mode encoded, optional — privacy default is off)
- `fuller version in Claude` (URL-trick handoff if the user wants the longer treatment)
- `try the other mode` (toggles)

User input is not stored. Per the plan's privacy posture: only the tool-invocation timestamp is logged, no payload.

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Paste a message from outside the office — your mother asking you to call more often, a friend wondering about Saturday, a teacher's note, a dentist reminder — and the app returns the corporate-PM-translated version you'd send a sales VP, with footnotes naming the bad-PM patterns each line triggers. A second mode goes the other way: paste a real work decline you sent recently and see what it sounds like in normal-human English. Built for the PM who has caught themselves typing "I'll need to deprioritize that ask" to their own family, and the family member who has noticed and wonders if it's a phase.

### 2b. How it works

Two modes share one prompt structure: translate the pasted message in one direction or the other, then footnote the output with citations from the corpus's pm-pitfalls, spotting-bad-pm-behaviors, saying-no, and process-vs-outcomes themes. The translation runs through Gemini Flash on the web, with the free-tier ceiling described in the foundation block. If it's hit, a single click hands the same translation off to Claude in your own subscription. Your pasted text is not stored; only the count of translations done that day, which is what the rate limit tracks.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Owner-locked. Single-line shape — deliberately breaks the two-beat used on #53 and #44 to keep the Block 3 sequence from feeling formulaic.

There is no Q3 in human relationships.

---

## Editorial notes

- Block 2a uses PM jargon ("deprioritize", "ask") as part of the self-mocking PM-meta posture — #51 is in the set where the jargon IS the joke. Kept understated.
- Block 2b is explicit about the privacy posture because the input is more sensitive than a quiz score (it's literally a message from the user's life). Better to state it than to hide it.
- Block 3 is intentionally a single line, not a two-beat. The Block 3 sequence across apps should vary in shape; the voice stays constant (ironic-but-humble, owner's voice, no em dashes, no AI tells) but the structure should not.
