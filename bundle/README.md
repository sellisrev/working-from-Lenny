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
pnpm run validate    # zod roundtrip + golden-set in-process + no-network check
pnpm run pack        # produces dist/working-from-lenny.mcpb
```

`pnpm run validate` is the routine pre-commit gate per [`../PHASE2_BUILD.md`](../PHASE2_BUILD.md). Sonnet refuses to commit if validate is red.

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
