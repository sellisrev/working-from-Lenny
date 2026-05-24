---
app-id: 54
app-name: Lenny AMA (always fresh)
phase: 3
type: open Q&A / router (corpus-wide retrieval, no state)
updated: 2026-05-24
---

# Page copy — #54 Lenny AMA (always fresh)

> Three blocks per `apps/_shared/aeo-seo-template.md`. This is the featured app; it sits first on the launcher home and the site grid (STATUS.md "4c", "Ask & learn").

---

## Block 1: Value first

The working interface. On `/lenny-ama` (and the featured question box at the top of the launcher home):

A single question box. Type anything about product, growth, strategy, hiring, career, or leadership. Press ask.

Submit button: "Ask."

Output (renders in chat):
- **A direct answer**, in a PM lens, grounded in the current corpus.
- **What's changed** (when it applies): if the corpus's older advice on your topic has decayed or drew strong audience pushback, the answer says so and what changed, rather than repeating advice that expired.
- **Sources**: the topic files it leaned on and the guests/dates behind the claim.
- **Next**: one concrete next step, not a summary.
- **A nudge to the right tool** (when one fits): "this is really a north star question, want the NSM Finder?"

There's no form and no score. Ask, get a grounded answer, optionally get pointed at the specific tool that goes deeper.

Below the output:
- `ask another`
- `open the suggested tool`
- `keep going in Claude`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Most of the tools here have one job. This one has all of them, plus the questions that don't fit any single tool. Ask anything a product person might ask, or any question where product thinking is the useful lens ("how do I prioritize across three things my boss wants?", "is this a good metric?"), and get an answer drawn from the current corpus, in plain language, with its sources named. The difference from asking a generic assistant is freshness: this answer reads the latest synthesis and actively checks what the corpus has walked back. If a claim you're asking about has decayed (the old SEO playbook, say) or drew strong audience pushback (a guest declaring the PM role dead), the answer tells you that and what changed, instead of confidently repeating something that stopped being true. It is the front door: when your question really belongs to a specific tool, it points you there; when it doesn't, it just answers.

### 2b. How it works

You ask; the tool retrieves across the whole knowledge base at once (not one app's fixed sources but the full synthesis), pulls the most relevant passages, and hands the chat assistant a grounded brief to answer from. It reads three layers: the current-consensus topics, an "obsolete" layer of advice the corpus has retired (with what replaced it), and a "cautions" layer of popular claims that drew heavy audience pushback (with the vote counts and the rebuttals). When a retrieved passage comes from the obsolete or cautions layer, the answer flags it. Because it reads the live knowledge base at answer time, every monthly refresh makes it better with no rework. Your question is not stored.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape PROPOSED 2026-05-24 (DECISIONS.md): freshness-caveat. Owner sign-off needed (voice shapes are owner-locked). Per PROCEDURAL_REFERENCE.md the blurb foregrounds freshness/decay, not catch-all breadth.

**Draft:**

Ask anything. You'll get an answer, and which part of it expired last quarter.

**Alternate:**

No wrong question. A few of the old answers, though.

---

## Editorial notes

- Block 2a leads with the freshness/decay wedge, not the catch-all breadth, per the voice-catalog note. The breadth is the hook; the decay-flagging is the reason to trust it over a generic assistant.
- Block 2b explains the three-layer retrieval (topics / obsolete / cautions) in plain terms, since that layering is the whole differentiator and a reviewer should see it spelled out.
- Block 3 foregrounds the freshness caveat. The alternate is punchier; keep the first for the clearer "answer + expiry" beat.
- No history tool by design (single-call, stateless); Block 2b says "your question is not stored" so a reviewer doesn't expect persistence.
