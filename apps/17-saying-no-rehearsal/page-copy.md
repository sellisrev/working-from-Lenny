---
app-id: 17
app-name: "Saying No" Rehearsal
phase: 3
type: multi-turn rehearsal (host-driven dialog from a Path 4 brief)
updated: 2026-05-24
---

# Page copy — #17 "Saying No" Rehearsal

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/saying-no`:

A short setup, then the rehearsal runs in chat.

1. **Who are you saying no to?** CEO / biggest customer / sales VP / eng peer / board member. Each pushes back differently.
2. **What's the ask?** The specific request you need to decline.
3. **Your real constraint** (optional). Why you have to say no (capacity, strategy, risk), so the coach can tell whether you're leading with the right reason.
4. **Mode.** Rehearse (you practice, the coach reacts) or show-me (skip practice, just give me the canonical firm no).

Submit button: "Start the rehearsal."

The rehearsal (in chat):
- The coach opens in character with the ask, the way that stakeholder would.
- You respond with your no. It pushes back once, fairly.
- After at most three of your turns, it breaks character and gives you:
  - **How that landed**: firmness, brevity, leading with the right rationale, closing the door cleanly, protecting the relationship.
  - **Where you weakened**: the single most important fix.
  - **The version that lands** for that stakeholder: the polite, firm no, with why it works.

The iframe's job after submit is small: confirm the stakeholder and ask were captured and tell you the rehearsal is starting in chat.

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

You already know the answer is no. This is about the sentence that comes after it. Pick the stakeholder and the ask, and rehearse declining it in a short back-and-forth with a coach who plays the part, pushes back fairly, and then tells you exactly where your no held and where it leaked: the hedge, the over-explanation, the door left cracked for renegotiation. You leave with the corpus-canonical version of a polite, firm no tuned to the person across the table, because a CEO, a board member, and your biggest customer each need to hear a different reason. Built for anyone who says yes too often and wants to practice the no before the meeting, not during it.

### 2b. How it works

This is the first tool here that holds a real conversation, and it does it without any special inference machinery: the chat assistant runs the role-play directly from a rehearsal brief the tool hands it (the stakeholder's persona, a five-part scoring rubric, the canonical firm-no for that stakeholder, and a turn limit). Nothing tracks the back-and-forth behind the scenes; the conversation itself is the state. The personas and the canonical responses are grounded in `saying-no.md`, `communicating-tradeoffs.md`, `getting-buy-in.md`, `managing-up.md`, and `defending-big-bets.md`. The tool only remembers your setup, so "rehearse my no" picks up where you left off; it does not store the transcript. Text only for now; your inputs stay local.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape owner-approved 2026-05-23 (DECISIONS.md): rehearsal-cue.

**Draft:**

The no you practice is the no that lands. The one you wing leaves the door cracked.

**Alternate:**

You already know the answer is no. This is about the sentence that comes after it.

---

## Editorial notes

- Block 2a opens with the alternate Block-3 line because it's the cleanest statement of the value (the no is decided; the delivery is the skill).
- Block 2b explains the host-driven multi-turn honestly in plain language ("the conversation itself is the state") so a curious reader understands why it works without special machinery, and states what is and isn't stored.
- Block 3 is the owner-approved rehearsal-cue shape (practice-vs-improvise resolving to the cracked-door image). The alternate is the strong Block-2a opener; keep the first as the blurb.
