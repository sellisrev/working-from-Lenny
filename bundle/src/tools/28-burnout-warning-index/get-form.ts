import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  BurnoutGetFormInput,
  BurnoutGetFormOutput,
} from "../../shared/schemas";

export const meta: ToolMeta = {
  name: "burnout_get_form",
  description:
    "Entry tool for the Burnout Warning Index. Calling this triggers the host to mount the ui://working-from-lenny/burnout-index resource (a single short page: a load block of numbers and enums plus three qualitative checks and one optional textarea). If your host mounts the UI, that IS the input surface — do NOT additionally render the inputs in chat as a duplicate surface; the user will fill them in the iframe, which calls burnout_score directly. The returned `fields` array is the fallback for hosts that cannot mount ui:// resources. If the user already has all inputs in hand, call burnout_score directly. The check is short by design — a long burnout quiz is its own irony.",
  inputSchema: BurnoutGetFormInput,
  outputSchema: BurnoutGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/burnout-index",
};

type Input = z.infer<typeof BurnoutGetFormInput>;
type Output = z.infer<typeof BurnoutGetFormOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    fields: [
      { key: "meetings_per_week", label: "Meetings per week", kind: "number", required: true, min: 0, max: 100 },
      { key: "deep_work_blocks_remaining", label: "90-min deep-work blocks left in a typical week", kind: "number", required: true, min: 0, max: 40 },
      { key: "after_hours_meeting_pct", label: "After-hours meeting share (% of meetings outside core hours)", kind: "number", required: true, min: 0, max: 100 },
      { key: "weeks_since_real_vacation", label: "Weeks since a real vacation (phone off, no Slack)", kind: "number", required: true, min: 0, max: 520 },
      { key: "sleep_self_report", label: "Sleep quality", kind: "enum", required: true, options: ["solid", "uneven", "poor"] },
      { key: "last_good_day", label: "When did you last finish a workday feeling good about something specific?", kind: "enum", required: true, options: ["this-week", "this-month", "cant-remember"] },
      { key: "dread_signal", label: "How often do you feel dread before the workday starts?", kind: "enum", required: true, options: ["rarely", "some-mornings", "most-mornings"] },
      { key: "recovery_capacity", label: "What's the first thing that falls away when you're underwater? (optional)", kind: "text", required: false, max_length: 200 },
    ],
    note: "Submit all required inputs to burnout_score. The index is 0-100 (green <=30, yellow 31-60, red >=61). The dread-plus-no-good-day pair can override a green load read to yellow.",
  };
};
