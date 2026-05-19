# `working-from-lenny.mcpb` — bundle source

The Phase 2 MCP App bundle. Architecture is locked in [`../PHASE2_BUILD.md`](../PHASE2_BUILD.md); status in [`../STATUS.md`](../STATUS.md).

This directory is what `mcpb-pack` walks at release time to produce the `.mcpb` ZIP attached to GitHub Releases on `sellisrev/from-Lenny`.

## Layout

```
bundle/
├── manifest.json              canonical mcpb manifest
├── package.json
├── tsconfig.json              IDE/typecheck config (extends repo root)
├── tsconfig.build.json        tsc emit config for dist/
├── src/
│   ├── server.ts              MCP server entry — registers tools + resources
│   ├── tools/
│   │   └── pm-pitfalls/       worked example: score / narrate / drift
│   ├── lib/                   sampling, persistence, prompt-loader, corpus, host
│   ├── shared/                schemas, types
│   └── ui/                    HTML / CSS / mcp-rpc client helper
├── scripts/
│   ├── build.ts               wraps tsc + UI inline step
│   ├── build-html.ts          inlines styles.css + mcp-rpc.js into each UI HTML
│   ├── validate.ts            zod roundtrip + golden-set + no-network smoke
│   └── pack.ts                wraps mcpb-pack CLI
├── test/
│   └── golden/                fixture inputs per app
└── dist/                      build output (gitignored)
```

## Local dev/test

```sh
cd bundle
pnpm install
pnpm run build       # tsc -> dist/server.js + inlined UI HTMLs
pnpm run validate    # zod roundtrip + golden-set in-process + installed-layout + no-network
pnpm run smoke       # spawns server.js in a staged install-root and runs MCP client calls
pnpm run pack        # stages apps/+knowledge/topics/ then produces dist/working-from-lenny.mcpb
```

`pnpm run validate` is the routine pre-commit gate per [`../PHASE2_BUILD.md`](../PHASE2_BUILD.md). Sonnet refuses to commit if validate is red.

`pnpm run smoke` is the deeper pre-release gate: it stages the bundle into a fresh temp dir (same layout the installed `.mcpb` produces) and exercises every tool via the MCP SDK client over stdio. It's slower than validate and only needs to run before tagging a release or when a tool's contract changes.

`pnpm run pack` copies the read-only runtime assets into `bundle/apps/` and `bundle/knowledge/topics/` before invoking `mcpb pack`, then removes them. Both staging paths are gitignored. If you run `mcpb pack` directly, the resulting `.mcpb` will be missing prompts and corpus — always go through `pnpm run pack`.

## Owner smoke-test checklist (Claude Desktop)

`pnpm run smoke` exercises every code path Opus can verify without a host. The bits below need a real Claude Desktop install to confirm — run these before tagging the first public `.mcpb`:

1. **Install.** `pnpm run build && pnpm run pack`, then drag `dist/working-from-lenny.mcpb` into Claude Desktop -> Settings -> Extensions.
2. **List the UI resource.** The pitfalls UI should appear in the host's resource picker as `PM Pitfalls Self-Audit` (`ui://working-from-lenny/pitfalls`). Open it and confirm the twenty rows render with always/sometimes/never controls and a Score button.
3. **Score with host sampling.** Fill in the audit, hit Score. The host should call `pm_pitfalls_score` (deterministic — instant) and then `pm_pitfalls_narrate`. Narration should arrive via the host's sampling channel — meaning **no api-key prompt**. If you see the api-key prompt, host sampling failed or was declined; check the host's MCP logs.
4. **Drift persistence.** Re-take the audit later in the same session with two answers changed. The drift call should report two `shifted_pitfalls`, a `previous_audit_at` timestamp, and an `audit_count: 2`. The data file lives at `$WFL_DATA_DIR/<user_id>/pm-pitfalls.json` (host substitutes `${user_config_dir}/working-from-lenny`).
5. **Fallback path (optional).** In an MCP host that doesn't implement sampling, set `api_key` + `api_provider` in the extension's user_config screen and re-run step 3. Confirm narration arrives via the provider's API.

If any step fails, do **not** let the Sonnet routine start cloning this pattern across the other ten apps — fix the worked example first, since the bug will multiply.

## Worked example: #44 PM Pitfalls

Three tool shapes in one app — the pattern the routine will clone across the remaining ten:

- `pm_pitfalls_score` — deterministic. 20 answers (always/sometimes/never) -> score 0-20 + top-three pitfall IDs + exemplar quotes.
- `pm_pitfalls_narrate` — LLM-narrated. Takes score + top three + optional user_context, calls `sampling/createMessage` on the host (or the user_config API key fallback), returns personalized diagnosis + behaviors per pitfall.
- `pm_pitfalls_drift` — stateful. Persists each audit to `<data-dir>/<user_id>/pm-pitfalls.json` and reports calibration drift across re-audits.

The resource `ui://working-from-lenny/pitfalls` serves the bundled HTML UI for the host to render.

## Data dir

The bundle writes to `$WFL_DATA_DIR` (set by the host via `manifest.json` -> `mcp_config.env`). Local default when running under `pnpm dev`: `<os.homedir>/.working-from-lenny`.

No reads or writes happen outside that dir.

## Sampling fallback

`src/lib/sampling.ts` tries `sampling/createMessage` first. If the host returns `MethodNotFound`, it reads `user_config.api_key` + `user_config.api_provider` and calls the provider's HTTP API directly (Anthropic / Gemini / OpenAI, thin adapters under `src/lib/providers/`). If neither path works, the tool returns a structured error pointing the user at the api-key config screen.

No project-owner API key is ever bundled.
