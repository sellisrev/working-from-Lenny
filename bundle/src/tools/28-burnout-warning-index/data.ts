export type SleepEnum = "solid" | "uneven" | "poor";
export type LastGoodDayEnum = "this-week" | "this-month" | "cant-remember";
export type DreadSignalEnum = "rarely" | "some-mornings" | "most-mornings";
export type BurnoutTier = "green" | "yellow" | "red";

export type DriverKey =
  | "meetings_per_week"
  | "deep_work_blocks_remaining"
  | "after_hours_meeting_pct"
  | "weeks_since_real_vacation"
  | "sleep_self_report"
  | "last_good_day"
  | "dread_signal";

export const DRIVER_LABELS: Record<DriverKey, string> = {
  meetings_per_week: "Meeting load",
  deep_work_blocks_remaining: "Deep-work blocks remaining",
  after_hours_meeting_pct: "After-hours meeting share",
  weeks_since_real_vacation: "Weeks since real vacation",
  sleep_self_report: "Sleep quality",
  last_good_day: "Last good workday",
  dread_signal: "Morning dread",
};

export const CORPUS_ANCHORS = [
  "burnout-and-resilience",
  "long-healthy-life",
  "saying-no",
  "top-1-percent-pm",
] as const;

export type BurnoutInputs = {
  meetings_per_week: number;
  deep_work_blocks_remaining: number;
  after_hours_meeting_pct: number;
  weeks_since_real_vacation: number;
  sleep_self_report: SleepEnum;
  last_good_day: LastGoodDayEnum;
  dread_signal: DreadSignalEnum;
  recovery_capacity?: string;
};

function riskMeetings(n: number): number {
  if (n <= 15) return 0;
  if (n <= 25) return 1;
  return 2;
}

function riskDeepWork(n: number): number {
  if (n >= 3) return 0;
  if (n >= 1) return 1;
  return 2;
}

function riskAfterHours(n: number): number {
  if (n <= 10) return 0;
  if (n <= 30) return 1;
  return 2;
}

function riskVacation(n: number): number {
  if (n <= 12) return 0;
  if (n <= 26) return 1;
  return 2;
}

function riskSleep(v: SleepEnum): number {
  return v === "solid" ? 0 : v === "uneven" ? 1 : 2;
}

function riskLastGoodDay(v: LastGoodDayEnum): number {
  return v === "this-week" ? 0 : v === "this-month" ? 1 : 2;
}

function riskDread(v: DreadSignalEnum): number {
  return v === "rarely" ? 0 : v === "some-mornings" ? 1 : 2;
}

export interface ScoreResult {
  index: number;
  tier: BurnoutTier;
  override_fired: boolean;
  top_drivers: { key: DriverKey; label: string; weighted_points: number }[];
  phase_focus: { phase_1_anchor: string; phase_2_anchor: string; phase_3_anchor: string };
}

export function scoreInputs(inputs: BurnoutInputs): ScoreResult {
  const meetingsRisk = riskMeetings(inputs.meetings_per_week);
  const deepWorkRisk = riskDeepWork(inputs.deep_work_blocks_remaining);
  const afterHoursRisk = riskAfterHours(inputs.after_hours_meeting_pct);
  const vacationRisk = riskVacation(inputs.weeks_since_real_vacation);
  const sleepRisk = riskSleep(inputs.sleep_self_report);
  const lastGoodDayRisk = riskLastGoodDay(inputs.last_good_day);
  const dreadRisk = riskDread(inputs.dread_signal);

  // dread_signal counts double in the sum
  const rawSum =
    meetingsRisk +
    deepWorkRisk +
    afterHoursRisk +
    vacationRisk +
    sleepRisk +
    lastGoodDayRisk +
    2 * dreadRisk;

  const index = Math.round((100 * rawSum) / 16);

  let tier: BurnoutTier = index <= 30 ? "green" : index <= 60 ? "yellow" : "red";

  const overrideFired =
    inputs.dread_signal === "most-mornings" && inputs.last_good_day === "cant-remember";
  if (overrideFired && tier === "green") tier = "yellow";

  type RankedDriver = { key: DriverKey; label: string; weighted_points: number };
  // Rank by weighted_points for driver selection (dread uses 2x value)
  const allDrivers: RankedDriver[] = [
    { key: "meetings_per_week", label: DRIVER_LABELS["meetings_per_week"], weighted_points: meetingsRisk },
    { key: "deep_work_blocks_remaining", label: DRIVER_LABELS["deep_work_blocks_remaining"], weighted_points: deepWorkRisk },
    { key: "after_hours_meeting_pct", label: DRIVER_LABELS["after_hours_meeting_pct"], weighted_points: afterHoursRisk },
    { key: "weeks_since_real_vacation", label: DRIVER_LABELS["weeks_since_real_vacation"], weighted_points: vacationRisk },
    { key: "sleep_self_report", label: DRIVER_LABELS["sleep_self_report"], weighted_points: sleepRisk },
    { key: "last_good_day", label: DRIVER_LABELS["last_good_day"], weighted_points: lastGoodDayRisk },
    // dread uses its 2x weighted value for ranking
    { key: "dread_signal", label: DRIVER_LABELS["dread_signal"], weighted_points: 2 * dreadRisk },
  ];
  const ranked = allDrivers
    .filter((d) => d.weighted_points > 0)
    .sort((a, b) => {
      if (b.weighted_points !== a.weighted_points) return b.weighted_points - a.weighted_points;
      // qualitative signals first on tie
      const qualOrder: DriverKey[] = ["dread_signal", "last_good_day"];
      const aQ = qualOrder.indexOf(a.key);
      const bQ = qualOrder.indexOf(b.key);
      if (aQ !== -1 && bQ === -1) return -1;
      if (bQ !== -1 && aQ === -1) return 1;
      return 0;
    });

  const top_drivers = ranked.slice(0, 2);

  return {
    index,
    tier,
    override_fired: overrideFired,
    top_drivers,
    phase_focus: {
      phase_1_anchor: "burnout-and-resilience",
      phase_2_anchor: "long-healthy-life",
      phase_3_anchor: "saying-no",
    },
  };
}
