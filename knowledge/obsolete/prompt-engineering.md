---
topic_slug: prompt-engineering
display_name: Prompt engineering techniques
last_updated: 2026-05-07
last_model: claude-opus-4-7
---

# Obsolete advice: Prompt engineering techniques

## "Add 'take a deep breath' / 'I will tip you $200' / 'this is very important to my career' to improve quality"

- **Claim**: Emotion-prompting tactics popularized 2023-2024, suggesting psychological framings could elicit higher-quality responses. Mike Taylor's 2024-10 newsletter included emotion prompting as one of the five techniques.
- **Originally said by**: widespread folklore from 2023; Mike Taylor codified into Lenny corpus 2024-10-29.
- **Why obsolete**: Frontier models (GPT-4o and later, Claude 3.5 Sonnet and later, especially reasoning models) have been RLHF'd to behave consistently regardless of these phrasings. In some cases the trainers have actively penalized them. Schulhoff (2025-06) describes self-criticism + few-shot-with-reasoning as the techniques with durable evidence; emotion-prompting is not in that durable list.
- **Where it may still apply**:
  - On open-source / smaller models that haven't been RLHF'd against these tactics.
  - For tone-shaping rather than quality-boosting (asking the model to adopt a serious or playful register can still produce different stylistic output).
- **Replaced by**: self-criticism, few-shot-with-reasoning, decomposition; see [Current consensus](../topics/prompt-engineering.md#current-consensus).
- **Confidence in retirement**: medium-high — the empirical evidence has shifted; legacy advice is still circulating in older content.

## "Always include 'think step by step' / chain-of-thought instruction"

- **Claim**: Chain-of-thought prompting, especially the "think step by step" instruction, was foundational 2022-2024 advice for getting better reasoning out of models.
- **Originally said by**: Wei et al. 2022 chain-of-thought paper; widely quoted in corpus.
- **Why obsolete**: Reasoning models (OpenAI o1/o3, Claude with extended thinking, Gemini 2.0 Flash Thinking) do this internally. Adding "think step by step" to prompts going to these models is at best redundant, at worst counter-productive (can interfere with the model's internal reasoning chain). For non-reasoning models the instruction still helps but is rarely the bottleneck.
- **Where it may still apply**:
  - On non-reasoning models when you genuinely need explicit reasoning steps in the output.
  - When you specifically need the reasoning trace visible to the user (debugging, explanation features).
- **Replaced by**: model-specific reasoning controls (extended thinking budgets, reasoning effort parameters); see [Current consensus](../topics/prompt-engineering.md#current-consensus).
- **Confidence in retirement**: medium — depends heavily on which model you're targeting.

## "Prompt engineering is dying / will be obsolete with the next model release"

- **Claim**: A recurring "prompt engineering is dead" thesis has appeared multiple times since 2023.
- **Originally said by**: not a single corpus quote; Schulhoff (2025-06) explicitly calls this out as the recurring claim he was about to refute at AI Engineer World's Fair.
- **Why obsolete**: Schulhoff's empirical answer: studies continue to show prompt engineering produces 30-90% accuracy deltas, and product-mode prompts are still the highest-leverage engineering artifact in many AI products. The terminology has shifted to "context engineering" but the discipline has grown, not shrunk.
- **Where it may still apply**:
  - For purely conversational / casual use of frontier models, the marginal return on technique-shopping has dropped substantially. The "prompt engineering is becoming less important for casual users" subset of the claim is partially true.
- **Replaced by**: context engineering as the durable framing; see [Current consensus](../topics/prompt-engineering.md#current-consensus).
- **Confidence in retirement**: high — Schulhoff's data + the corpus's continued centrality of the topic refutes the wholesale claim.

## "Hire a prompt engineer as a dedicated role"

- **Claim**: 2023-2024 wave of prompt-engineer job postings (Anthropic, Klarity, Amazon, TikTok, etc.) suggested the role was becoming a discipline.
- **Originally said by**: implied by Lenny's 2024-09 job market report tracking the role.
- **Why obsolete**: By 2026, the work has folded into AI engineer / context engineer / eval engineer roles. Standalone "prompt engineer" job postings are increasingly rare; the skill is now a layer of every AI-engineering role rather than a job title.
- **Where it may still apply**:
  - At very large frontier labs or companies running thousands of distinct production prompts (Anthropic, OpenAI, Google) where specialization is justified.
  - In pure red-teaming / adversarial testing roles (Schulhoff's HackAPrompt-style work).
- **Replaced by**: AI engineer / eval engineer roles that include prompt-craft as a sub-skill.
- **Confidence in retirement**: medium — still a valid title at some large companies.

## Community skill packs that may need updating

- [RefoundAI/lenny-skills](https://github.com/RefoundAI/lenny-skills) and [qingxuantang/Lennys-to-sop-and-skills](https://github.com/qingxuantang/Lennys-to-sop-and-skills) likely contain prompt-engineering skills derived from 2024-era content. Recommend reviewing whether their guidance distinguishes conversational vs product mode and avoids overemphasis on emotion-prompting / "take a deep breath" tactics that don't survive on 2026 frontier models.
- [arjunlall/lenny-for-claude](https://github.com/arjunlall/lenny-for-claude) — semantic search may surface 2024 Mike Taylor content over 2025 Sander Schulhoff content if not date-weighted; recommend confirming.
