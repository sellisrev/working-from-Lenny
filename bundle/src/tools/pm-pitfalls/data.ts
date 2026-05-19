export interface Pitfall {
  id: number;
  text: string;
  leverage: 1 | 2 | 3;
  anchors: string[];
  quote: string;
}

/**
 * The twenty pitfalls. Source of truth: apps/44-pm-pitfalls/prompt.md.
 * IDs and leverage values are locked; reordering breaks the URL-share format
 * and the persisted answer array layout.
 */
export const PITFALLS: Pitfall[] = [
  {
    id: 1,
    text: "Letting AI write the spec without owning the judgment behind it",
    leverage: 3,
    anchors: ["pm-pitfalls", "ai-pm-skills"],
    quote:
      "If you can't defend every call in that spec without reading the AI output back at people, you don't own the spec. You're a copy editor.",
  },
  {
    id: 2,
    text: "Shipping AI features without an eval set",
    leverage: 3,
    anchors: ["evals-for-ai-products"],
    quote:
      "\"Prompts may make headlines, but evals quietly decide whether your product thrives or dies.\" No eval set means you're shipping by gut feel at scale. (Aman Khan, Lenny's Newsletter)",
  },
  {
    id: 3,
    text: "No paying-customer conversation in the last 30 days",
    leverage: 3,
    anchors: ["top-1-percent-pm", "continuous-discovery"],
    quote:
      "Top 1% PMs quote specific customers in conversations. If your last paying-customer call was more than 30 days ago, you're building from memory.",
  },
  {
    id: 4,
    text: "Conflating roadmap with strategy",
    leverage: 3,
    anchors: ["product-strategy", "good-strategy-rumelt"],
    quote:
      "Ravi Mehta: every roadmap item needs to connect back through goals, strategy, and vision. If yours don't, you don't have a strategy. You have a backlog.",
  },
  {
    id: 5,
    text: "Stakeholder-pleasing over bet-defending",
    leverage: 3,
    anchors: ["spotting-bad-pm-behaviors", "defending-big-bets"],
    quote:
      "The Feature Factory: the roadmap is reactive to the loudest stakeholder, not driven by a hypothesis about user value. The team sees it, even when the PM doesn't.",
  },
  {
    id: 6,
    text: "Not measuring shipped features after launch",
    leverage: 3,
    anchors: ["pm-pitfalls"],
    quote:
      "Shipping without measuring is how you end up with a product full of features nobody uses. The PM who built it is the only one with the context to diagnose it.",
  },
  {
    id: 7,
    text: 'OKRs as activity lists ("ship X" instead of "Y users adopt X")',
    leverage: 3,
    anchors: ["okrs"],
    quote:
      '"Ship the redesign" is not a key result. A key result measures an outcome users experience. "Ship X" means you\'ve already given up on knowing whether X worked.',
  },
  {
    id: 8,
    text: "Spending time on the roadmap when the unanswered question is the bet",
    leverage: 3,
    anchors: ["defending-big-bets"],
    quote:
      'If the real question is "should we be building this at all," a polished roadmap won\'t answer it. That document is covering for a decision you haven\'t made yet.',
  },
  {
    id: 9,
    text: "Theatre standups: status ritual, no real coordination",
    leverage: 2,
    anchors: ["pm-pitfalls", "spotting-bad-pm-behaviors"],
    quote:
      'The Coordinator in real time: the standup becomes a status broadcast, not a coordination tool. Engineers answer "what did you do yesterday," then return to their desks unchanged.',
  },
  {
    id: 10,
    text: "Treating internal stakeholders as customers",
    leverage: 2,
    anchors: ["spotting-bad-pm-behaviors", "continuous-discovery"],
    quote:
      "When the answer to 'why are we building this?' is a stakeholder's name, not a user problem, you've confused internal approval for product-market fit.",
  },
  {
    id: 11,
    text: 'Letting "data-driven" replace a hard judgment call',
    leverage: 2,
    anchors: ["pm-pitfalls"],
    quote:
      "Data can inform the call without making it. Saying 'the data says X' is often a way of avoiding the harder sentence: 'I think X is right and here's why.'",
  },
  {
    id: 12,
    text: "Confusing consensus with alignment",
    leverage: 2,
    anchors: ["spotting-bad-pm-behaviors"],
    quote:
      "Alignment means the team can execute the direction even if they'd have chosen differently. Consensus means they'd all have picked it. Waiting for consensus before calling something decided is the 'avoiding decisions' pattern. Everyone feels the call is theirs because the PM never made it.",
  },
  {
    id: 13,
    text: 'Avoiding the hard "no"',
    leverage: 2,
    anchors: ["saying-no"],
    quote:
      "Yes-by-default is the most expensive habit in tech. Every yes commits future capacity. The bill comes due in the quarter where you can't do the one thing that actually matters. (Lenny, Saying No, 2021)",
  },
  {
    id: 14,
    text: "Over-indexing on the loudest customer complaint",
    leverage: 2,
    anchors: ["continuous-discovery"],
    quote:
      "The loudest complaint is a signal, not a mandate. The customer who tracked you down in Slack is one data point. Weekly story-based interviews across a diverse set of users is what separates signal from noise.",
  },
  {
    id: 15,
    text: "Velocity as a goal rather than a side effect",
    leverage: 2,
    anchors: ["velocity-core4"],
    quote:
      "Velocity is a side effect of a team that knows what to build and is empowered to build it well. When it becomes the goal itself, you get faster delivery of the wrong things. Lenny's Core 4: optimizing throughput alone produces feature factories without business value.",
  },
  {
    id: 16,
    text: 'Skipping the "why" in every spec',
    leverage: 2,
    anchors: ["pm-pitfalls"],
    quote:
      "The Coordinator on paper: the spec tells everyone who does what by when. When you ask 'why are we building this?' it has no answer. That's not a spec. It's a project plan with delusions of strategy.",
  },
  {
    id: 17,
    text: "Not noticing when politics shift around your bet",
    leverage: 2,
    anchors: ["defending-big-bets"],
    quote:
      "The kill signal rarely arrives as a formal cancellation. It's the exec sponsor going quiet, the resource conversations getting vague, the next planning cycle starting without your bet on the agenda. If you didn't notice, that's the pitfall.",
  },
  {
    id: 18,
    text: "Hiding from the post-mortem when something flops",
    leverage: 2,
    anchors: ["top-1-percent-pm", "spotting-bad-pm-behaviors"],
    quote:
      "Owns outcomes is the cleanest test. Running the post-mortem as a blame-diffusion exercise, or skipping it entirely, signals to everyone who wrote code that the next risky bet is on them if it fails.",
  },
  {
    id: 19,
    text: "Hoarding credit from engineers and designers",
    leverage: 2,
    anchors: ["spotting-bad-pm-behaviors"],
    quote:
      "Camille Fournier's first engineer-side complaint: hoarding credit. Engineers remember. Designers remember. The PM who presents the team's work as their own is borrowing against trust they'll need when something goes wrong.",
  },
  {
    id: 20,
    text: "Confusing being busy with being useful",
    leverage: 1,
    anchors: ["top-1-percent-pm"],
    quote:
      "Top 1% PMs don't confuse activity with progress, per Ian McAllister. The full calendar isn't output. What shipped? What did you learn this week? Two questions that matter.",
  },
];

export function pitfallById(id: number): Pitfall {
  const p = PITFALLS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown pitfall id ${id}`);
  return p;
}

export function answerValue(a: "always" | "sometimes" | "never"): number {
  if (a === "always") return 2;
  if (a === "sometimes") return 1;
  return 0;
}
