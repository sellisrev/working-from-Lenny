import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  LadderCalibrateInput,
  LadderCalibrateOutput,
} from "../../shared/schemas";
import { buildLadderCalibrateBrief } from "../../lib/build-ladder-calibrate-brief";

export const meta: ToolMeta = {
  name: "pm_ladder_calibrate",
  description:
    "Packages a manager-calibration delta brief — the unique-to-this-tool wedge that distinguishes the PM Ladder from a static rubric. Takes the user's per-dimension levels (from a prior pm_ladder_score call) plus the verbatim text of their manager's last performance review, and returns a narration brief that identifies the 1-3 dimensions of widest divergence between the two views, with a discussion question per dimension for the next 1:1. Pure compute — no persistence side-effect. The host chat model renders the user-facing delta from the brief. Manager review text is forwarded into the brief and is NOT persisted to disk by the bundle. `manager_review_text` minimum 50 characters; the upper bound is 8000 characters which covers verbose orgs (typical written reviews run 1,500-4,000 chars).",
  inputSchema: LadderCalibrateInput,
  outputSchema: LadderCalibrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof LadderCalibrateInput>;
type Output = z.infer<typeof LadderCalibrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildLadderCalibrateBrief({
    dimension_levels: args.dimension_levels,
    manager_review_text: args.manager_review_text,
    user_context: args.user_context,
  });
};
