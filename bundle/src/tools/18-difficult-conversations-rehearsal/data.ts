export type ScenarioEnum =
  | "poor-performance"
  | "peer-escalation"
  | "layoff-delivery"
  | "scope-cut-to-customer"
  | "killing-pet-project"
  | "pip-kickoff";

export type DifficultConvModeEnum = "rehearse" | "show-me" | "fournier";

export interface ScenarioData {
  label: string;
  counterparty_reaction: string;
  opening_line: string;
  trap: string;
  canonical_handling: string;
  silence_beat: string;
  fournier_structure: {
    keep: string;
    cut: string;
    one_move_missing: string;
  };
}

export const SCENARIO_DATA: Record<ScenarioEnum, ScenarioData> = {
  "poor-performance": {
    label: "Poor performance feedback",
    counterparty_reaction: "Likely defensive. May deflect to external factors, workload, or unclear expectations. May go quiet or agree too quickly without real change.",
    opening_line: "I wanted to talk with you about something important. I'm seeing a gap between what we need and what's happening, and I think we need to address it directly.",
    trap: "Over-softening the feedback until the message is lost. The counterparty leaves thinking it was a normal check-in.",
    canonical_handling: "Name the specific behavior, not the character. Give one or two concrete examples (not a laundry list). State the impact clearly. Pause after the main message — let it land. Ask what they think is happening before proposing a solution. End with a clear next step and a date to check in.",
    silence_beat: "[After stating the impact, pause for 5-10 seconds. Do not fill the silence. Let them respond first.]",
    fournier_structure: {
      keep: "Naming the specific behavior and its impact. Being direct rather than softening to the point of ambiguity. Giving one concrete example.",
      cut: "Over-explaining the feedback, listing every grievance, or hedging with phrases like 'I just think maybe possibly...' The counterparty needs one clear message, not a case file.",
      one_move_missing: "The silence beat. After naming the impact, stop talking. Most people fill the silence with softening that dilutes the message. The silence is where the message lands.",
    },
  },
  "peer-escalation": {
    label: "Peer escalation",
    counterparty_reaction: "Likely defensive and territorial. May frame their position as 'what's best for the company.' May escalate above you if they feel overridden.",
    opening_line: "I want to work through this disagreement directly with you before we involve anyone else. I think we're both trying to do the right thing but we have a real conflict here.",
    trap: "Turning the conversation competitive — needing to win rather than solve. Or soft-pedaling to avoid tension, leaving the conflict unresolved.",
    canonical_handling: "Name the conflict clearly without blame. Acknowledge their goal is also legitimate. Propose a decision framework: if we can't agree, here's how we'll decide (data, a third party, escalation with both perspectives represented). Make the process fair rather than the outcome certain.",
    silence_beat: "[After proposing the decision framework, pause and let them respond. Do not immediately argue for your position.]",
    fournier_structure: {
      keep: "Naming the conflict rather than dancing around it. Proposing a process for resolution rather than trying to win the argument on the spot.",
      cut: "Litigating who was right in past decisions. Framing the other person as the problem rather than the conflict as the problem to solve.",
      one_move_missing: "Naming what you're willing to give up. If you enter an escalation with no concession available, you're not negotiating — you're declaring war. Name one thing you can yield on to make the resolution feel fair.",
    },
  },
  "layoff-delivery": {
    label: "Layoff delivery",
    counterparty_reaction: "Shock, then anger or sadness. May ask why. May go quiet. May push back on the fairness of the decision.",
    opening_line: "I need to tell you something difficult. We're eliminating your position and your last day will be [date].",
    trap: "Over-explaining the business rationale during the initial delivery. The person is in shock; lengthy justification sounds like excuses.",
    canonical_handling: "State the decision in the first sentence — do not build to it. The decision is final; do not imply it is open. After the main statement, pause. When they respond, listen. Provide the logistics (severance, timeline, references) once the emotional reaction has had space. Close by naming one genuine thing you valued about them.",
    silence_beat: "[After the first two sentences — the decision and the date — pause completely. Let them respond. Do not fill the silence with explanation.]",
    fournier_structure: {
      keep: "Leading with the decision in the first sentence. Not hedging or building up to it. Pausing after the message rather than continuing to talk.",
      cut: "Explaining the business rationale at length before or immediately after the decision. Saying 'this was so hard for us' or centering your feelings. The person needs clarity and dignity, not your guilt.",
      one_move_missing: "Closing with something genuine. After logistics are covered, name one specific thing you valued about them and their work. Not platitudes — one real thing. That sentence will stay with them.",
    },
  },
  "scope-cut-to-customer": {
    label: "Scope cut to customer",
    counterparty_reaction: "Frustrated, possibly feeling misled. May argue you committed to the feature. May escalate to their own leadership or threaten churn.",
    opening_line: "I need to give you an update that I know isn't what you were expecting. We've had to cut [specific feature] from the upcoming release.",
    trap: "Softening so much that the customer doesn't understand the scope changed. Or over-committing to a future date to defuse the moment.",
    canonical_handling: "State the change clearly and early. Name the reason honestly (not a vague 'technical constraints'). Show that you investigated alternatives. Give a realistic future date or say you cannot commit to one — do not invent a date to end the conversation. Offer the best available alternative.",
    silence_beat: "[After stating the cut and the reason, pause before moving to alternatives. Let them express their reaction before you propose solutions.]",
    fournier_structure: {
      keep: "Stating the change clearly, naming a real reason, and being honest about whether there is a commitment on a future date.",
      cut: "Giving a vague reason ('the team hit some challenges') or a fabricated date ('we're targeting Q3') just to defuse the call. Both destroy trust when the truth emerges.",
      one_move_missing: "Bringing a specific alternative with you. The conversation goes better when you arrive with 'here's what I can offer now' rather than waiting to be asked. Even a workaround or a partial implementation changes the tone from a dead end to a path.",
    },
  },
  "killing-pet-project": {
    label: "Killing a pet project",
    counterparty_reaction: "Emotional investment. May argue the project just needs more time or resources. May feel the decision is personal rather than strategic.",
    opening_line: "I want to talk with you about [project name]. I've decided we're not going to continue it, and I want to explain why and make sure we do this well.",
    trap: "Being so diplomatic about the decision that the person doesn't hear it clearly. Or framing it as a mutual decision when it isn't.",
    canonical_handling: "Own the decision — don't frame it as 'the business decided' or 'market conditions'. Name the real reason clearly. Acknowledge the work and genuine contribution, then distinguish it from the outcome. Name what you learned from the project that will carry forward. Make a specific ask of the person (their insight, their transition plan, their help documenting the learnings).",
    silence_beat: "[After stating the decision and the reason, pause before speaking again. Let them respond. Their first reaction deserves space before you move to what's next.]",
    fournier_structure: {
      keep: "Owning the decision directly rather than attributing it to abstract forces. Distinguishing the person's work (real) from the project's continuation (not happening). Naming what you'll carry forward from their effort.",
      cut: "Hedging into 'we're putting it on hold' when you mean 'it's over.' The ambiguity is kindness in the moment and damage over time. People need a real answer to move on.",
      one_move_missing: "Making a specific ask of the person. Don't just deliver the news — invite them into the next step. 'I'd love your help writing up what we learned so it doesn't get lost' is concrete respect. A general 'your work mattered' without a specific ask lands as hollow.",
    },
  },
  "pip-kickoff": {
    label: "PIP kickoff",
    counterparty_reaction: "Anxiety or shock. May feel blindsided even if there have been prior conversations. May ask whether this is a firing process.",
    opening_line: "I want to be direct with you: I'm putting you on a performance improvement plan, starting today. I want to walk you through exactly what that means and what I need to see change.",
    trap: "Presenting the PIP so gently that the person doesn't understand the stakes. Or so harshly that they shut down and can't hear the specifics.",
    canonical_handling: "State that it's a PIP in the first sentence. Name the specific behaviors that need to change (not a general character critique). State the timeline clearly. Answer the 'am I being fired' question directly: the PIP is a real opportunity to change the outcome, but you are honest that the bar must be met. Commit to regular check-ins. Close with the documentation you will share.",
    silence_beat: "[After naming the behaviors and timeline, pause. Give them a moment to absorb before asking if they have questions.]",
    fournier_structure: {
      keep: "Naming the specific behaviors that need to change, not character. Being honest about the stakes. Giving a real timeline with real check-in dates.",
      cut: "Excessive softening ('this is a growth opportunity!') that makes the person think the PIP is routine development rather than a final warning. They need to understand the stakes, not be reassured.",
      one_move_missing: "Answering the 'is this a firing process' question before it's asked. If you wait for them to ask, you've already lost some trust. Say it directly: 'I want to be honest — if [X] doesn't change by [date], yes, we will have to part ways. I don't want that. I'm telling you now because I think you can change this.'",
    },
  },
};

export const DIFFICULT_CONV_RUBRIC = [
  { id: "empathy", label: "Empathy", what_to_watch: "Did you acknowledge the other person's reality before moving to your point? Empathy doesn't mean agreement — it means you heard them." },
  { id: "clarity", label: "Clarity", what_to_watch: "Was the main message clear, or did you soften it until it was ambiguous? After the conversation, would they know exactly what was said?" },
  { id: "decisiveness", label: "Decisiveness", what_to_watch: "Did you own the decision, or did you attribute it to process, the company, or market conditions? Hard conversations require a clear owner." },
  { id: "silence", label: "Silence", what_to_watch: "Did you let silence do its work — pausing after the hard statement rather than filling the space with softening? Silence is where the message lands." },
  { id: "dignity", label: "Dignity", what_to_watch: "Did the other person leave the conversation with their dignity intact? Hard news can be delivered in a way that respects the person, even when the content is painful." },
] as const;

export const CORPUS_ANCHORS = [
  "difficult-conversations",
  "communicating-bad-news",
  "giving-feedback-as-leader",
  "performance-reviews",
] as const;

export const TURN_LIMIT = 4;
