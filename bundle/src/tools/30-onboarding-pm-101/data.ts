export type RoleEnum = "engineer" | "designer" | "sales" | "customer-success" | "other-cross-functional";
export type StageEnum = "seed" | "series-a-b" | "growth" | "enterprise";
export type PmRatioEnum = "solo-pm" | "pm-per-squad" | "heavy-pm-org";

export const LESSONS = [
  { id: 1, title: "What artifacts you'll see, and what they actually mean" },
  { id: 2, title: "When and how to push back" },
  { id: 3, title: "What a good PM looks like vs a bad one" },
  { id: 4, title: "How to be useful in cross-functional rituals" },
  { id: 5, title: "When to escalate" },
] as const;

export const LESSON_ANCHORS: Record<number, string[]> = {
  1: ["how-x-builds-product", "product-strategy", "okrs"],
  2: ["getting-buy-in", "communicating-tradeoffs", "saying-no"],
  3: ["top-1-percent-pm", "spotting-bad-pm-behaviors", "pm-pitfalls"],
  4: ["continuous-discovery", "getting-buy-in"],
  5: ["communicating-bad-news", "managing-up", "decision-making-frameworks"],
};

export const ROLE_LENS: Record<RoleEnum, string> = {
  engineer:
    "Artifacts: the spec is a hypothesis, not a contract; read the why behind the ticket, not just the what. Push-back: estimate honesty and scope challenge are your strongest moves. Rituals: your build signal is discovery data — make it land.",
  designer:
    "Artifacts: where your craft judgment outranks the PM's, and where it does not. Push-back: name the user experience problem before proposing a solution. Rituals: discovery is your home turf — own the research posture.",
  sales:
    "Artifacts: the roadmap is not a promise you can sell; read commit vs. aspiration carefully. Push-back: deal-blocking gaps need a clear path to a decision, not a feature request. Rituals: your customer signal is primary discovery data — make the PM act on it.",
  "customer-success":
    "Artifacts: your churn signal and customer verbatims are discovery data; turn them into bets, not complaints. Push-back: translate a specific complaint into a pattern the PM can size. Rituals: retros and planning are your window to close the loop on customer promises.",
  "other-cross-functional":
    "Artifacts: the roadmap tells you what and when; ask for the why so you can align your work. Push-back: flag misaligned priorities early, before dependencies lock in. Rituals: your seat in cross-functional meetings is most useful when you bring a clear constraint or signal.",
};

export const STAGE_CALIBRATION: Record<StageEnum, string> = {
  seed:
    "Most of this lives in a Slack thread, a Notion doc, or a conversation at the whiteboard — and that is fine. Lightweight process is appropriate; the PM is probably a founder.",
  "series-a-b":
    "Process is forming. There are PRDs now, probably OKRs, and a planning cadence that may still shift every quarter. Expect some ambiguity as the rituals gel.",
  growth:
    "The rituals are real. Planning is quarterly, specs are expected, and cross-functional alignment is a deliberate activity. Learn the cadence early.",
  enterprise:
    "The ritual is heavy by design. There are planning layers, approval gates, and multiple PM stakeholders. Invest in reading the process as much as the product.",
};

export function allCorpusAnchors(): string[] {
  return Array.from(
    new Set(Object.values(LESSON_ANCHORS).flat()),
  );
}
