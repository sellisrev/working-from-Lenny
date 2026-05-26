export type StakeholderEnum = "ceo" | "biggest-customer" | "sales-vp" | "eng-peer" | "board-member";
export type SayingNoModeEnum = "rehearse" | "show-me";

export interface StakeholderData {
  label: string;
  pressure_style: string;
  opening_line: string;
  what_they_can_hear: string;
  canonical_no: string;
}

export const STAKEHOLDER_DATA: Record<StakeholderEnum, StakeholderData> = {
  ceo: {
    label: "CEO",
    pressure_style: "Big-picture urgency. Frames every ask as the most important thing for the company right now. Doesn't ask for detail; expects you to figure it out.",
    opening_line: "I need you to add this to the roadmap for next quarter. It's strategic.",
    what_they_can_hear: "Opportunity cost framing: show what the yes trades away. A CEO will hear 'if we do X, we can't ship Y by Q3' more readily than 'I don't have bandwidth.'",
    canonical_no: "I hear that this is important. To add it for next quarter I'd have to push out [specific committed item]. I'd rather not make that call unilaterally — can we align on the trade? Here's what I'd recommend deprioritizing instead.",
  },
  "biggest-customer": {
    label: "Biggest customer",
    pressure_style: "Revenue leverage. Implies their contract or renewal is at risk. Expects product to move for them.",
    opening_line: "We need this feature before renewal. It's a dealbreaker for us.",
    what_they_can_hear: "Acknowledgment + transparency about the trade. Name the queue, give a realistic date. Customers respect honesty more than vague promises. Offer what you can do now.",
    canonical_no: "I appreciate you telling me directly. This isn't in our next release, and I'd rather be straight with you now than overpromise. I can't commit to the feature by renewal. Here's what I can offer in that window: [specific alternative or workaround]. I want to keep you — let's talk about whether that works.",
  },
  "sales-vp": {
    label: "Sales VP",
    pressure_style: "Deal urgency and quota pressure. Frames the ask as 'we're losing deals because of this.'",
    opening_line: "We're losing three deals because we don't have this. When can we ship it?",
    what_they_can_hear: "Pattern versus one-off framing. A single deal need doesn't move the roadmap; a pattern from multiple deals does. Ask them to show you the pattern. Offer a workaround for the immediate deal.",
    canonical_no: "I take this seriously. If three deals are blocked on the same thing, I want to understand the pattern. Can you pull the CRM data showing how many opportunities cite this? If it's a real pattern, it changes my calculus. For this specific deal this quarter, here's what I can offer: [workaround / custom config / timeline transparency].",
  },
  "eng-peer": {
    label: "Engineering peer",
    pressure_style: "Technical debt or architecture framing. Frames the ask as necessary for system health. Can escalate to their manager.",
    opening_line: "We really need to refactor this before we build on it. Can you prioritize it?",
    what_they_can_hear: "Collaborative framing: show you understand the cost, name the trade-off explicitly, and offer to solve it together — either a scoped version or a later window with a real date.",
    canonical_no: "I agree the debt is real and I don't want to ignore it. Right now I can't shift the roadmap — we have [committed item] due in [timeframe]. Here's what I can offer: either a scoped cleanup that takes under a sprint so we're not blocked, or I put a real date on the full refactor in Q[X] and we commit jointly. Which is more useful?",
  },
  "board-member": {
    label: "Board member",
    pressure_style: "Strategic or investor angle. May cite a portfolio company or market trend. Carries informal authority beyond their governance role.",
    opening_line: "I was talking to another portfolio company — they're doing X and seeing great results. Have you considered this?",
    what_they_can_hear: "Take the signal seriously, name your current strategic bet, and explain why it's the right one. Board members want to see conviction and clarity, not defensiveness. Invite them into the thinking without capitulating.",
    canonical_no: "Thank you for bringing this — I'm familiar with what that company is doing. Our bet is different: we're focused on [specific strategy] because [one-sentence reason]. I'm not dismissing what they've seen, but adding this now would split our focus. I'd love to walk you through why we've prioritized this way if you think I'm missing something important.",
  },
};

export const SAYING_NO_RUBRIC = [
  { id: "firmness", label: "Firmness", what_to_watch: "Did you actually say no, or did you hedge into a vague 'maybe later'? A firm no is kinder than false hope." },
  { id: "brevity", label: "Brevity", what_to_watch: "Did you over-explain? A no that needs a paragraph of justification often sounds defensive. One clear reason is enough." },
  { id: "rationale-fit", label: "Rationale fit", what_to_watch: "Did you give a reason the stakeholder could hear — opportunity cost for the CEO, pattern vs. one-off for sales — rather than a generic 'we don't have bandwidth'?" },
  { id: "door-management", label: "Door management", what_to_watch: "Did you leave the door open appropriately — a clear path for reconsideration if something changes — without leaving it so open that the no feels soft?" },
  { id: "relationship", label: "Relationship", what_to_watch: "Did you keep the stakeholder relationship intact? A no should not leave them feeling dismissed. Respect their ask even while declining it." },
] as const;

export const CORPUS_ANCHORS = [
  "saying-no",
  "communicating-tradeoffs",
  "getting-buy-in",
  "managing-up",
  "defending-big-bets",
] as const;

export const TURN_LIMIT = 3;
