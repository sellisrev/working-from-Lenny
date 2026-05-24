import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";

/**
 * Launcher home (PHASE2_BUILD decision #10). Reads the build-time catalog.json
 * (assembled by scripts/build-html.ts from every app's catalog block) and
 * returns the menu grouped by theme, featured apps first. No state, no
 * sampling — a pure read over the generated catalog. The host renders the
 * menu as a list when it does not mount the ui:// home resource.
 */

const HomeInput = z.object({}).strict();

const MenuEntry = z.object({
  name: z.string(),
  one_liner: z.string(),
  entry_tool: z.string(),
  ui_resource: z.string(),
  skill_url: z.string(),
  launch_hint: z.string(),
});

const Section = z.object({
  theme: z.string(),
  label: z.string(),
  apps: z.array(MenuEntry),
});

const HomeOutput = z.object({
  type: z.literal("home_menu"),
  title: z.string(),
  intro: z.string(),
  render_directive: z.string(),
  featured: z.array(MenuEntry),
  sections: z.array(Section),
  total_apps: z.number().int(),
  skill_base_url: z.string(),
});

export const meta: ToolMeta = {
  name: "wfl_home",
  description:
    "The starting interface for Working from Lenny. CALL THIS when the user opens Working from Lenny, says hi, or asks what's available / what you can do / what tools there are. Returns the full menu of apps grouped by theme (featured always-fresh apps first), each with a one-liner, the tool that launches it, and a link to use it as a Claude Code skill instead. Render it as a short menu: featured apps first, then each themed section as a labeled list; for each app show the name, the one-liner, and how to start it (mount its ui:// resource or call its entry tool). Do not invent apps that are not in the returned catalog.",
  inputSchema: HomeInput,
  outputSchema: HomeOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/home",
};

type Input = z.infer<typeof HomeInput>;
type Output = z.infer<typeof HomeOutput>;

interface CatalogApp {
  app_id: string;
  name: string;
  theme: string;
  featured: boolean;
  order_hint: number;
  one_liner: string;
  entry_tool: string;
  ui_resource: string;
  skill_slug: string;
}

// Canonical theme ordering + labels (STATUS.md "4c"). Sections render in this
// order; the featured band (ask-and-learn) is pulled out and pinned on top.
const SECTION_ORDER = [
  "self-reflective",
  "business",
  "for-non-pms",
  "just-for-fun",
] as const;

const SECTION_LABELS: Record<string, string> = {
  "ask-and-learn": "Ask & learn (always fresh)",
  "self-reflective": "Self-reflective as PM",
  business: "Business questions",
  "for-non-pms": "For non-PMs / working with product",
  "just-for-fun": "Just for fun",
};

const SKILL_BASE_URL =
  "https://github.com/sellisrev/working-from-Lenny/tree/main/skills";

async function loadCatalog(): Promise<CatalogApp[]> {
  const catalogPath = path.join(__dirname, "catalog.json");
  const raw = await fs.readFile(catalogPath, "utf8");
  const parsed = JSON.parse(raw) as { apps?: CatalogApp[] };
  return Array.isArray(parsed.apps) ? parsed.apps : [];
}

function toMenuEntry(app: CatalogApp): z.infer<typeof MenuEntry> {
  const launch_hint = app.ui_resource
    ? `Mount ${app.ui_resource}, or call ${app.entry_tool} to start.`
    : `Call ${app.entry_tool} to start.`;
  return {
    name: app.name,
    one_liner: app.one_liner,
    entry_tool: app.entry_tool,
    ui_resource: app.ui_resource,
    skill_url: app.skill_slug ? `${SKILL_BASE_URL}/${app.skill_slug}` : SKILL_BASE_URL,
    launch_hint,
  };
}

export const invoke: ToolHandler<Input, Output> = async () => {
  const apps = await loadCatalog();

  const featured = apps
    .filter((a) => a.featured)
    .sort((a, b) => a.order_hint - b.order_hint)
    .map(toMenuEntry);

  const sections = SECTION_ORDER.map((theme) => ({
    theme,
    label: SECTION_LABELS[theme] ?? theme,
    apps: apps
      .filter((a) => !a.featured && a.theme === theme)
      .sort((a, b) => a.order_hint - b.order_hint)
      .map(toMenuEntry),
  })).filter((s) => s.apps.length > 0);

  return HomeOutput.parse({
    type: "home_menu",
    title: "Working from Lenny",
    intro:
      "Small PM tools drawn from Lenny's Newsletter and How I AI. Pick one, or ask anything in the always-fresh apps up top.",
    render_directive:
      "Render this as the Working from Lenny menu. Lead with the featured apps, then each themed section as a short labeled list. For every app give its name, its one-liner, and how to start it (mount the ui:// resource where the host supports it, otherwise call the entry_tool). Mention that any app can be used as a Claude Code skill via its skill_url. Keep it scannable; do not add apps that are not listed.",
    featured,
    sections,
    total_apps: apps.length,
    skill_base_url: SKILL_BASE_URL,
  });
};
