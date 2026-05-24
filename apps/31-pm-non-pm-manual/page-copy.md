---
app-id: 31
app-name: PM-for-Non-PMs Operating Manual
phase: 3
type: generator (per-domain artifact set, no scoring state)
updated: 2026-05-24
---

# Page copy — #31 PM-for-Non-PMs Operating Manual

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/pm-non-pm-manual`:

A short form, single page.

1. **Your domain.** School principal / nonprofit executive director / hospital service-line lead / research-lab PI. (Parenting is intentionally not here; that domain already has a dedicated tool.)
2. **Scale** (optional). Small / mid / large. Sets how many stakeholders you juggle and how formal the rituals are.
3. **Biggest friction** (optional, one line). The decision or tension you most want a framework for.

Submit button: "Build my manual."

Output (renders in chat, not in the iframe, since there's no score):
- **Your three working artifacts**, adapted to your domain:
  1. A jobs-to-be-done interview kit: who to talk to, what to ask, what to discount.
  2. A prioritization rubric: a RICE-style scorecard relabeled for your decisions, with the one override that beats the score.
  3. A "stop doing" list: what your domain over-invests in, and the script for stopping it given who you have to tell.
- If you named a friction, a short coda that points you to whichever artifact resolves it.

The iframe's job after submit is small: confirm your domain and scale and tell you the three artifacts are rendering in chat. You can ask the assistant to format the manual as a doc for a planning offsite or a board packet.

Below the output:
- `format as a doc`
- `keep going in Claude`
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

You run something real, a school or a nonprofit or a hospital service line or a research lab, and you have heard that "product thinking" might help, but every tool for it assumes you ship software. This translates three core PM tools into your world, adapted to your actual stakeholders. You get a jobs-to-be-done interview kit so you can separate what people ask for from the job they are really hiring you to do. You get a prioritization rubric, a RICE-style scorecard relabeled for your decisions, with the one override that always beats the score (safety in a hospital, a mandate in a school, restricted funding in a nonprofit, the grant cycle in a lab). And you get a "stop doing" list, because the move that transfers hardest is the no, especially the no to whoever funds you. It does not lecture you about how tech does it better. The frameworks adapt to your domain, in your language. It pairs with the non-PM orientation (#30) and the bad-PM field guide (#46) as the cross-domain sibling.

### 2b. How it works

There's no quiz and no score. A deterministic step validates your domain and scale, resolves the stakeholder roster, the relabeled rubric axes, the override gate, and the over-investment candidates for your domain, and selects the corpus anchors; the three artifacts themselves are rendered by the chat assistant from a corpus-grounded brief. The content draws on `jobs-to-be-done.md` and `continuous-discovery.md` for the interview kit, `prioritization-frameworks.md` and `decision-making-frameworks.md` for the rubric, and `saying-no.md` and `communicating-tradeoffs.md` for the stop-doing list, with `getting-buy-in.md` (and `okrs.md` for the research-lab framing) grounding the shared "your stakeholders don't report to you" reality. It runs once per domain, as a generator; there's no history to keep. Your inputs stay local and are not stored remotely.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape PROPOSED 2026-05-24 (DECISIONS.md): transfer-reveal. Owner sign-off needed (voice shapes are owner-locked).

**Draft:**

Your stakeholders don't report to you either. That part transfers. The roadmap part is easier than you think.

**Alternate:**

Principals, EDs, lab PIs: same job, different stop-doing list.

---

## Editorial notes

- Block 1 names the parenting omission explicitly and points at "a dedicated tool" without naming tinyStakeholders, so the page reads as deliberate rather than incomplete.
- Block 2a leads with the user's own competence ("you run something real") before offering the transfer, which is the trust move for a reader who is not a PM and is mildly skeptical of PM-speak.
- Block 2b is explicit that there is no stateful follow-up, matching the spec's no-history note so a reviewer doesn't expect a calibration tool (same posture as #30).
- Block 3 is the proposed transfer-reveal shape (hidden commonality, then de-risk the unfamiliar part). The alternate is punchier and names the domains; keep the first for the reassurance arc, but the alternate is strong if review prefers the concrete list.
