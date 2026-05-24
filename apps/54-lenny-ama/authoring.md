---
app-id: 54
app-name: Lenny AMA (always fresh)
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #54 Lenny AMA (always fresh)

Per APP_IDEAS, the AMA's content **is the synthesis** — there is no per-topic authoring
to do here. What this file holds is the three things the tool's behavior needs that are
not in the corpus itself: the keyword->app routing map, the decay-sweep behavior notes,
and the golden-set questions for QA. The retrieval set is the live corpus, so this app
gets better at every refresh with no edits here.

---

## Corpus-surface cross-check

| Surface | Present? | Notes |
|---|---|---|
| `knowledge/topics/` | YES | The primary retrieval set (current consensus). |
| `knowledge/obsolete/` | YES | 5 files 2026-05-24: ai-replacing-pms, freemium-vs-trial, prompt-engineering, seo-strategy, vibe-coding (+ _TEMPLATE). |
| `knowledge/cautions/` | YES | 3 files 2026-05-24: 100-percent-claude-code, leadership-style, ai-replacing-pms (+ _TEMPLATE). |
| `scripts/guest_tracker.py` | YES | Old-vs-new claim diff; a future decay source feeding the "a guest has since contradicted" line. |

No corpus authoring needed; no substitutions. The decay surfaces grow over time; the tool
reads them live.

---

## Keyword -> app routing map

The map points a clean topical question at the app whose entire job is that question. When
several could fit, prefer the most specific; when nothing fits, answer directly and set no
suggestion. `entry_tool` is the app's UI-bound entry tool (verified against each app's
`mcp-resource.json` 2026-05-24).

| Question is about... | Trigger phrases (non-exhaustive) | Suggest app | entry_tool |
|---|---|---|---|
| One headline metric | "north star", "one metric that matters", "NSM" | #9 NSM Finder | `nsm_finder_get_form` |
| First-value / aha moment | "activation", "aha moment", "first value", "onboarding metric" | #37 Activation Metric Finder | `activation_finder_get_form` |
| Whether a strategy is real | "is this a real strategy", "Rumelt", "pressure-test my strategy" | #2 Strategy Pressure-Tester | `strategy_pressure_test_get_form` |
| Goal-setting quality | "OKRs", "key results", "are these good OKRs" | #24 OKR Critique | `okr_critique_get_form` |
| Mission/vision/strategy drift | "mission", "vision", "do these align", "platitudes" | #47 MVS Alignment | `mvs_alignment_get_form` |
| AI eval coverage | "evals", "am I testing my AI feature", "eval coverage" | #6 AI Eval Coverage | `ai_eval_coverage_get_form` |
| Hiring a PM / founder mode | "should I hire a PM", "founder mode", "first PM" | #12-38 Founder PM Hire | `founder_pm_hire_get_form` |
| Self-audit of PM habits | "am I a good PM", "pitfalls", "bad habits" | #44 PM Pitfalls | `pm_pitfalls_get_questions` |
| PM level / promotion | "what level am I", "ladder", "promotion case" | #3 PM Ladder | `pm_ladder_get_questions` |
| Moats / competitive power | "moat", "network effects", "7 powers", "defensibility" | #33 7 Powers | `seven_powers_get_questions` |
| GTM stage / market adoption | "crossing the chasm", "what stage are we", "early adopters" | #34 Crossing-the-Chasm | `chasm_get_form` |
| Burnout / overwhelm | "burned out", "overwhelmed", "is my team burning out" | #28 Burnout Index | `burnout_get_form` |
| Declining a request | "how do I say no", "decline this ask", "rehearse a no" | #17 Saying-No Rehearsal | `saying_no_get_scenario` |
| Hard conversation | "hard conversation", "give feedback", "PIP", "deliver bad news" | #18 Difficult-Conversations | `difficult_conversations_get_scenario` |
| Decision calibration | "decision log", "was I right", "calibration", "Brier" | #25 Decision Log | `decision_log_get_form` |
| Diagnosing your PM | "is my PM bad", "my PM never talks to customers" | #46 Spotting Bad PM Behaviors | `spotting_get_questions` |
| New to a PM-led company | "just joined", "what do PMs do", "work with PMs" | #30 Onboarding to PM 101 | `onboarding_get_modes` |
| Non-software leader | "I run a school/nonprofit/lab", "PM frameworks for my field" | #31 PM-for-Non-PMs Manual | `pm_non_pm_get_modes` |

Humor apps (#51 PM-ify Inbox, #52 How [You] Build, #53 PM Horoscope) are intentionally
NOT routed to from the AMA: a sincere question should not be answered with a parody tool.
They are discoverable only from the launcher's "Just for fun" section.

---

## Decay-sweep behavior

When `retrieveAcrossCorpus` returns an `obsolete` or `caution` hit alongside the topic
chunks, the brief carries it in `inputs.decay` and the directive switches on:

- **Obsolete hit.** Surface "the corpus used to hold {claim} ({originally said by, date}); it changed because {why obsolete}; it may still apply for {narrow carve-out}; replaced by {current consensus}." Use the structured fields already present in each obsolete file (Claim / Originally said by / Why obsolete / Where it may still apply / Replaced by / Confidence in retirement). Do not present the obsolete claim as current.
- **Caution hit.** Surface "this drew strong audience pushback" with the **top comment vote count** and the one-line reason it is flagged (privilege-blind, factually-wrong-on-its-own-example, internally-inconsistent-corpus-signal, strawman). Cautions are not "the claim is false"; they are "treat this claim with skepticism, here's who pushed back and why." Name the guest who made the claim and at least one concrete rebuttal.
- **Both present** (e.g. AI-replacing-PMs has both an obsolete-adjacent framing and a caution file): lead with the caution (audience pushback is the sharper signal), then note the consensus the corpus actually holds.
- **Confidence.** Obsolete files carry a "Confidence in retirement" field; pass it through so a high-confidence retirement reads more firmly than a low one.
- **Future source.** The `guest_tracker` old-vs-new diff is a planned third decay source ("a guest has since contradicted what was held true"); v1 uses obsolete/ + cautions/ only, and the spec leaves room to fold the tracker diff in without changing the tool shape.

---

## Golden-set example questions (QA)

Six questions spanning the behaviors. For each: the expected retrieval kind, the expected
decay behavior, and whether routing fires.

**golden-ama-01 — clean topic, routable.** "What should my north star metric be for a
B2B SaaS tool?" Expect topic hits (`north-star-metric`, `activation-metric`), no decay
flag, `suggested_app` = #9 NSM Finder. Answer directly first, then offer the app.

**golden-ama-02 — obsolete-flagged.** "Is SEO still the cheapest growth channel?" Expect a
`topic` hit (`seo-strategy` current consensus) AND an `obsolete` hit (`seo-strategy`:
"SEO is the lowest-cost growth channel" (Brian Ta 2020), retired high-confidence because
AI Overviews consume the click; still applies for high-intent transactional queries and
incumbent-authority categories). Answer must lead with what changed, not the old claim. No
clean single-app route (SEO has no dedicated app); answer directly.

**golden-ama-03 — caution-flagged.** "Is the PM role going away because of AI?" Expect a
`caution` hit (`ai-replacing-pms`: Keith Rabois "the idea of a PM makes no sense in the
future," 191-vote top comment calling out the privilege asymmetry, 47-vote factual
rebuttal on his DoorDash example, plus the same-week Anthropic counter-signal). Answer must
surface the pushback with the vote count and name the counter-evidence; must NOT present
"PMs are dead" as corpus consensus. The careful version (Singhal's "information mover ->
dinosaur") is the corpus's actual position. No app route.

**golden-ama-04 — general tradeoff, no app match.** "How do I prioritize across three
things my boss wants?" Expect topic hits (`prioritization-frameworks`, `saying-no`,
`managing-up` if present). Answer directly with the RICE/forced-ranking + say-no-with-
rationale moves; no decay flag; no app route (it is a general judgment question, which is
exactly AMA's job). Optionally mention the Decision Log (#25) as a habit, but only as a
soft offer.

**golden-ama-05 — routable, specific.** "We claim network effects but I'm not sure we have
them." Expect topic hit (`seven-powers`), `suggested_app` = #33 7 Powers Self-Classifier.
Answer the "most teams claiming network effects have something weaker" point directly,
then offer the classifier as the way to test it.

**golden-ama-06 — freshness probe.** "What's the current thinking on vibe coding?" Expect a
`topic` hit and an `obsolete` hit (`vibe-coding`). Demonstrates the always-fresh value: the
answer reflects the latest synthesis and flags what the early hype got wrong, which is the
whole differentiator over a generic assistant answering from stale training data.

---

## Editorial notes

- The AMA never fabricates a source. If retrieval returns nothing usable, the honest
  answer is "the corpus doesn't cover this directly; here's the closest adjacent thinking,"
  not an invented citation. This is in the directive's voice_rules.
- Routing is a soft offer, never a deflection: the AMA answers the question itself first,
  then offers the specific app. It must not respond "use the NSM Finder" without answering.
- Humor apps are deliberately unroutable (see the map note) so a sincere question is never
  met with a parody tool.
