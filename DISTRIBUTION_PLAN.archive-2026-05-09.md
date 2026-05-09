> **OBSOLETED — archived snapshot, superseded 2026-05-09.**
>
> Kept for diff and history; the live plan is `DISTRIBUTION_PLAN.md`.
>
> Two facts dated this version:
> 1. **MCP Apps shipped Jan 2026** — MCP servers can now declare UI resources rendered inside Claude Desktop / ChatGPT / Goose / VS Code, distributed as `.mcpb` Desktop Extensions. The "MCP app needs a separate Electron/Tauri shell" framing below is wrong post-Jan-2026.
> 2. **Free-tier inference budget is much smaller than this plan claims** — combined ceiling across CW AI / Groq / Gemini 2.5 Flash is in the low thousands of requests per day after Google's Dec-2025 cuts. The three-provider "fallback chain" oversells robustness.
>
> The live plan promotes MCP App via `.mcpb` to primary serious-tool path, demotes the Cloudflare-inference web app to top-of-funnel + free-tier-bounded subset (Gemini canonical, Groq fallback only), rejects native mobile + Gemma for v1, and adds a Phase 0 URL-trick page as cheapest validation.

---

# Distribution plan — Lenny-actualize apps

## What this document is

A record of the options considered, the trade-offs between them, what composes well and what doesn't, and everything needed to build. No final decision has been made on the full stack. Hard constraint: something must be built on Replit, which means a web app is part of the baseline. Mobile app alongside it is a reasonable working assumption. MCP is under consideration as an addition, not a replacement.

---

## Options considered

### 1. "Open in Claude.ai" URL trick
Build a form that constructs a prompt and opens `https://claude.ai/new?q=<encoded-prompt>` in the user's browser. No backend, no inference cost.

**Why it was considered:** zero cost, zero friction, static hosting.

**Why it's not the primary path:** the corpus can't travel in a URL. URL length limits kill anything beyond a short structured prompt. Without the corpus injected, you're just building a nicer UI for asking Claude to do PM stuff — which anyone can already do. Only valid for the 4-5 lightest tools where prompt structure alone is the value.

**Status:** kept as a fallback only, for mobile web when no other inference path is available.

---

### 2. Web app + Cloudflare Workers inference stack
Static frontend (Replit) + Cloudflare Worker proxying inference through a fallback chain: Cloudflare Workers AI (Llama 3.3 70B) → Groq (Llama 3.3 70B) → Gemini 2.5 Flash. Corpus bundled as a static JS asset, client-side RAG, relevant chunks injected per request.

**Why it was considered:** public reach, no user accounts needed, three free inference tiers provide resilience.

**Trade-off vs MCP:** if MCP is also in the stack, running your own inference layer is redundant for users who have an AI client. But it serves users who don't — which is most of the public web audience. The fallback chain (CW AI → Groq → Gemini 2.5 Flash) is real engineering overhead, but it's a one-time setup and all three services are free with no credit card required.

**Status:** part of the baseline. Replit is a hard constraint, which means this gets built. The inference stack is the open question — whether to run it or route through the user's client.

---

### 3. Mobile app with bundled/downloaded Gemma 4
React Native + Google AI Edge SDK. Gemma 4 (1B or 4B) downloaded post-install into device storage. Corpus bundled as app JSON assets, updated via remote version check without app re-submission. Share sheet integration for users who have Claude or ChatGPT installed — app builds the full prompt, hands it off via iOS share sheet / Android intent.

**Why it was considered:** offline capability, no inference cost, no accounts needed, genuine mobile-first experience.

**Trade-offs:** more build complexity than a PWA, but better offline capability and better inference quality for users who don't have a Claude subscription. Full Gemma 4 is a post-install download (not bundled), keeping the app itself small. No app re-submission needed for corpus updates — corpus is fetched remotely. Share sheet integration (app builds the prompt, hands off to the user's installed LLM) is a lighter alternative for users who already have Claude or ChatGPT on their phone.

**Status:** under consideration alongside the web app. Reasonable working assumption that web + mobile is the baseline. Decision on whether this is a full native app or a PWA with share sheet is open.

---

### 4. Claude Code skills library (repo clone)
The existing lenny-actualize repo, cleaned up and made distributable. Users clone it, all tools run as `/skill-name` commands in Claude Code using full Claude with the full corpus in context.

**Why it was considered:** the repo is already structured this way. Highest inference quality. Zero build cost. Core audience already has Claude Code.

**Why it's not the primary path on its own:** CLI-only, no UI, no discoverability, not accessible to people who haven't set up Claude Code. But it's a distribution path that costs nothing to maintain alongside everything else.

**Status:** kept as-is regardless of what else gets built. Zero extra maintenance. If an MCP app is built, the skills library remains as a parallel entry point for Claude Code users who prefer CLI.

---

### 5. MCP server (tools/resources/prompts only, no custom UI)
An MCP server exposing the 24 tools as MCP tools, corpus files as MCP resources, and prompt templates as MCP prompts. Users connect it to Claude Desktop or Claude Code. No custom UI — interaction happens inside the AI client.

**Why it was considered:** clean protocol separation, Claude handles the UX, zero inference cost, integrates with the user's existing workflow.

**Why it's not the primary path:** no UI means no discoverability, no structured form inputs, no formatted output display. The experience depends entirely on the AI client's interface. Valid for power users wiring it into their own setup, but not a product.

**Status:** under consideration as an addition. Would be a natural layer to extract from the web app's prompt/corpus infrastructure if MCP is pursued. Can be offered standalone for users who want to wire tools into Claude Desktop without any custom UI.

---

### 6. MCP app — under consideration as an addition
A desktop application (Electron, Tauri, or a localhost server via `npx`) with a full UI — tool index, per-tool forms, output display — that uses MCP as the protocol layer to delegate inference to whichever AI client the user has. The app owns UX, corpus RAG, and prompt construction. The AI client owns inference.

**What it adds over the web app:**
- Inference quality matches whatever the user has — if they have Claude, they get Claude quality with no inference stack to maintain
- Fully local — no privacy surface, no hosting, no rate limits
- Works with Claude Desktop, Claude Code, Ollama, or any MCP-compatible client
- Multi-turn tools (#17, #18) and stateful tools (#25) work naturally without session management overhead
- Absorbs the skills library use case with better UX

**What it doesn't replace:**
- Public web reach — users without Claude Desktop or Claude Code still need the web app
- Mobile — MCP apps are a desktop story right now
- The Replit constraint — something needs to be built there regardless

**Honest caveat:** MCP apps with custom UI are an emerging pattern. Tooling for packaging and distributing them is still maturing. Building slightly ahead of the curve — not a blocker, but expect some rough edges in the ecosystem.

**Status:** under consideration as an addition to the web + mobile baseline, not a replacement for it. No decision made.

---

## What composes well

| Combination | Why it works |
|---|---|
| Web app (Replit) + mobile app | Covers the broadest audience. Replit is a hard constraint so the web app is built regardless. Mobile extends reach without redundancy. |
| Web app + Cloudflare inference stack | The fallback chain (CW AI → Groq → Gemini 2.5 Flash) gives the web app real inference quality at $0. No credit card on any of the three services. |
| Mobile app + share sheet | App builds the full prompt, hands off to the user's installed LLM (Claude, ChatGPT, etc.) via iOS share sheet / Android intent. Works without downloading Gemma 4. |
| Either of the above + CC skills library | Zero extra work. The skills library is the repo in its current form — a different entry point to the same corpus and tools for Claude Code users. |
| Web app + MCP addition | The prompt templates and corpus RAG built for the web app are directly reusable in an MCP layer. Adding MCP later doesn't require rebuilding anything. |
| MCP addition + standalone MCP server | The MCP server is extractable for power users who want to wire the tools into Claude Desktop without any UI wrapper. |

---

## What doesn't compose

| Combination | Why it's redundant or conflicting |
|---|---|
| Cloudflare inference stack + MCP app (as replacement) | If MCP replaces the web app, the inference stack is unnecessary. But MCP doesn't replace the web app — so both exist, serving different audiences. Only conflict is if you try to run inference in both for the same user. |
| Gemma 4 bundled native mobile app + mobile PWA | Two mobile builds for the same audience. Pick one: PWA with share sheet (lighter, faster to build) or native app with Gemma 4 (offline, better quality). Both together is redundant. |
| "Open in Claude.ai" URL trick as primary web inference | Without the corpus in the URL, it's not a product. Valid only as a fallback when the inference stack is unavailable. |
| Full skills library rebuild | The skills library is already the repo in its current form with minimal cleanup. Don't rebuild it as part of anything else — keep it as a separate zero-maintenance layer. |

---

## Working assumption for the stack

No final decision made. The working assumption based on the Replit constraint and the conversation so far:

```
Baseline:   Web app (Replit)         Public, Replit-hosted, Cloudflare inference
            Mobile app               Native or PWA — share sheet + optional Gemma 4
Bonus:      CC skills library        Repo clone, zero extra maintenance
Under       MCP addition             Desktop, local, routes to user's AI client
consideration:                       Builds on top of web app infrastructure
```

---

## Shared internal dependencies

These need to exist once and serve all paths.

| Dependency | What it is |
|---|---|
| **Corpus bundle** | All knowledge files as structured JSON, chunked by topic, with keyword tags |
| **version.json** | Hash of each corpus file; clients check this on launch and pull diffs from repo |
| **Tool-to-corpus map** | Which topic files are relevant to each of the 24 tools (~72 mappings) |
| **Prompt templates** | One per tool: system prompt + corpus injection slots + user input slots + output format |
| **Retrieval function** | Maps tool ID + user inputs → top 2-3 corpus chunks by topic tag. Keyword matching for v1, no embeddings needed. |
| **Output format specs** | Per tool: plain text, structured cards, multi-turn conversation |

---

## Tool classification

| Type | Tools | LLM needed | State | Multi-turn |
|---|---|---|---|---|
| Fully deterministic | #53 | No | No | No |
| Quiz + LLM narration | #44, #3, #28 | Optional | No | No |
| Paste-and-critique | #2, #24, #47, #6 | Yes | No | No |
| Wizard / diagnostic | #9, #12, #33, #34, #37, #38, #46 | Yes | No | No |
| Generator / translator | #51, #52, #30, #31 | Yes | No | No |
| Roleplay (multi-turn) | #17, #18 | Yes | Session | Yes |
| Stateful | #25 | Yes | Persistent | No |
| Gateway to skills only | #25 (web/mobile) | — | — | — |

Tools removed: #42 (layoffs prep).

---

## Corpus update mechanism

`knowledge/version.json` in the repo lists each file's hash. All clients (MCP app, mobile PWA) check this on launch against their cached version and pull only changed files from GitHub raw content URLs. A pre-commit hook or GitHub Action regenerates `version.json` whenever files in the `knowledge/` folder change.

Mobile PWA uses the same mechanism — no app re-submission needed since corpus files are content, not code.

---

## Analytics

No user inputs logged anywhere. Tool invocations only: tool ID + timestamp + which inference path was used. Web/PWA: Cloudflare Web Analytics for traffic (free, no credit card, no cookie banner required). Tool-level events: lightweight Worker endpoint or local aggregation. MCP app: local log, optionally synced to a lightweight endpoint.

---

## Per-tool descriptions

Each tool page has a short description below the output — ironic but humbly so, no AI writing artifacts (no em dashes, no "delve", no corporate cadence). Written 1-by-1 in the owner's voice, with each draft reviewed and corrected before the next is written. The corrections inform the next draft.

---

## Build order

**Phase 1:** Make the Claude Code skills library distributable. Clean `CLAUDE.md`, clean `README`, verify all skills work without owner-specific config. Days of work, not weeks. Fastest path to value for the Claude Code audience.

**Phase 2:** Web app on Replit. Static shell, tool index, corpus bundle and version-check mechanism. Start with #53 (no LLM needed) to prove the pattern, then wire the Cloudflare inference stack and unlock the single-shot tools in one batch.

**Phase 3:** Multi-turn and stateful tools on the web app. #17, #18 (session history passed client-side), #25 (gateway link to skills library).

**Phase 4:** Mobile. Decision point: native app with Gemma 4, or PWA with share sheet. Build whichever is lower effort first; add the other if there's evidence of demand for offline/private use.

**Phase 5 (conditional):** MCP addition. If there's appetite after the web + mobile baseline is live. Reuses the prompt templates and corpus RAG from the web app directly — no rebuild required.

**Phase 6 (conditional):** Standalone MCP server extraction. Package for users who want direct Claude Desktop integration without any UI.

