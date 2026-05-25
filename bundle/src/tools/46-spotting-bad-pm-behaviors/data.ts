export type ActionRung =
  | "private_feedback"
  | "document_then_feedback"
  | "document_and_escalate"
  | "reframe_or_leave";

export type ObservedFrequency = "often" | "sometimes" | "havent-seen-it";

export interface Behavior {
  id: number;
  text: string;
  severity_weight: 1 | 2 | 3;
  anchors: string[];
}

export const BEHAVIORS: Behavior[] = [
  { id: 1, text: "Never talks to paying customers, but speaks for them constantly", severity_weight: 3, anchors: ["spotting-bad-pm-behaviors", "continuous-discovery"] },
  { id: 2, text: "Dismisses details as \"small\" without understanding why they aren't", severity_weight: 3, anchors: ["spotting-bad-pm-behaviors"] },
  { id: 3, text: "Presents the team's work as their own; engineers and designers go uncredited", severity_weight: 3, anchors: ["spotting-bad-pm-behaviors"] },
  { id: 4, text: "Can't say why you're building something beyond a stakeholder's name", severity_weight: 3, anchors: ["pm-pitfalls", "spotting-bad-pm-behaviors"] },
  { id: 5, text: "Avoids the decision; waits for consensus and calls the wait \"alignment\"", severity_weight: 3, anchors: ["spotting-bad-pm-behaviors", "decision-making-frameworks"] },
  { id: 6, text: "Roadmap whiplash; priorities reorder every week with no new information", severity_weight: 3, anchors: ["pm-pitfalls", "defending-big-bets"] },
  { id: 7, text: "Says yes to everyone; never defends a tradeoff to a stakeholder", severity_weight: 2, anchors: ["saying-no"] },
  { id: 8, text: "Specs hand over the what and the when but never the why", severity_weight: 2, anchors: ["pm-pitfalls"] },
  { id: 9, text: "Runs standup as a status broadcast, not coordination", severity_weight: 2, anchors: ["pm-pitfalls", "spotting-bad-pm-behaviors"] },
  { id: 10, text: "Ships and moves on; never asks whether the last thing worked", severity_weight: 2, anchors: ["pm-pitfalls"] },
  { id: 11, text: "Hides from the post-mortem, or runs it as blame-diffusion", severity_weight: 2, anchors: ["spotting-bad-pm-behaviors", "top-1-percent-pm"] },
  { id: 12, text: "\"Data-driven\" is a way to avoid owning a judgment call", severity_weight: 2, anchors: ["pm-pitfalls"] },
  { id: 13, text: "Treats internal stakeholders as if they were the customer", severity_weight: 2, anchors: ["continuous-discovery"] },
  { id: 14, text: "Over-rotates on the loudest complaint; one Slack message reorders the quarter", severity_weight: 1, anchors: ["continuous-discovery"] },
  { id: 15, text: "Confuses being busy with being useful; the calendar is full, the why is empty", severity_weight: 1, anchors: ["top-1-percent-pm"] },
];

export const CORPUS_ANCHORS = [
  "spotting-bad-pm-behaviors",
  "pm-pitfalls",
  "continuous-discovery",
  "saying-no",
  "defending-big-bets",
  "decision-making-frameworks",
  "top-1-percent-pm",
  "getting-buy-in",
  "communicating-bad-news",
  "managing-up",
];

export function observedScore(answer: ObservedFrequency): number {
  if (answer === "often") return 2;
  if (answer === "sometimes") return 1;
  return 0;
}

export function computeSeverityTier(total: number): "green" | "yellow" | "red" {
  if (total <= 6) return "green";
  if (total <= 16) return "yellow";
  return "red";
}

/**
 * Deterministic action-rung selection per prompt.md spec.
 * countSev3Active = number of severity-3 behaviors the user rated often or sometimes.
 * When 3+ severity-3 behaviors are active, those escalate to reframe_or_leave.
 */
export function computeActionRung(
  observed: ObservedFrequency,
  severity: 1 | 2 | 3,
  countSev3Active: number,
): ActionRung {
  if (observed === "havent-seen-it") return "private_feedback";
  if (countSev3Active >= 3 && severity === 3) return "reframe_or_leave";
  if (observed === "often" && severity === 3) return "document_and_escalate";
  if (observed === "often" && severity === 2) return "document_then_feedback";
  if (observed === "sometimes" && severity === 3) return "document_then_feedback";
  return "private_feedback";
}

export function behaviorById(id: number): Behavior {
  const b = BEHAVIORS.find((x) => x.id === id);
  if (!b) throw new Error(`Unknown behavior id ${id}`);
  return b;
}
