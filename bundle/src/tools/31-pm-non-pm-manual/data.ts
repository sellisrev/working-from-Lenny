export type DomainEnum = "school-principal" | "nonprofit-ed" | "hospital-service-line" | "research-lab-pi";
export type ScaleEnum = "small" | "mid" | "large";

export const ARTIFACTS = [
  { id: 1, title: "Jobs-to-be-done interview kit" },
  { id: 2, title: "Prioritization rubric" },
  { id: 3, title: "'Stop doing' list" },
] as const;

export interface DomainData {
  label: string;
  stakeholders: { users: string[]; buyers_funders: string[] };
  rice_labels: { reach: string; impact: string; confidence: string; effort: string };
  override_gate: string;
  stop_doing_candidates: string[];
  artifact_anchors: Record<number, string[]>;
}

export const DOMAIN_DATA: Record<DomainEnum, DomainData> = {
  "school-principal": {
    label: "School principal",
    stakeholders: {
      users: ["teachers", "students"],
      buyers_funders: ["district administration", "school board", "parent associations"],
    },
    rice_labels: {
      reach: "Classrooms / staff members affected",
      impact: "Learning-outcome or staff-capacity uplift",
      confidence: "Quality of evidence (pilot data, research base)",
      effort: "Staff hours + coordination complexity",
    },
    override_gate: "Community buy-in required? (Yes forces stakeholder alignment before ranking — treat as a hard constraint even if reach or impact score lower.)",
    stop_doing_candidates: [
      "Running programs with no outcome data beyond participation counts",
      "Covering every meeting format when one cadence carries the real decision-making work",
      "Writing district reports that describe activity without surfacing what changed for students",
    ],
    artifact_anchors: {
      1: ["jobs-to-be-done", "continuous-discovery"],
      2: ["prioritization-frameworks", "decision-making-frameworks"],
      3: ["saying-no", "communicating-tradeoffs"],
    },
  },
  "nonprofit-ed": {
    label: "Nonprofit executive director",
    stakeholders: {
      users: ["program participants", "community members served"],
      buyers_funders: ["foundation funders", "major donors", "board of directors"],
    },
    rice_labels: {
      reach: "People served or communities reached",
      impact: "Mission-alignment + measurable outcome",
      confidence: "Program evidence quality (evaluation data, cohort outcomes)",
      effort: "Staff + volunteer hours + operational cost",
    },
    override_gate: "Funder-required? (Yes can override standard ranking — flag the trade-off explicitly so the board sees it.)",
    stop_doing_candidates: [
      "Accepting grants that pull programs away from your core theory of change",
      "Running legacy programs below minimum impact threshold out of inertia",
      "Board reporting formats that hide what is and isn't working",
    ],
    artifact_anchors: {
      1: ["jobs-to-be-done", "continuous-discovery"],
      2: ["prioritization-frameworks", "okrs"],
      3: ["saying-no", "communicating-tradeoffs"],
    },
  },
  "hospital-service-line": {
    label: "Hospital service-line lead",
    stakeholders: {
      users: ["patients", "clinical care teams"],
      buyers_funders: ["hospital administration", "payers", "health system leadership"],
    },
    rice_labels: {
      reach: "Patient volume impacted",
      impact: "Clinical quality outcome + patient experience uplift",
      confidence: "Clinical evidence grade (RCT / cohort / pilot / expert opinion)",
      effort: "FTEs + capital cost + regulatory and accreditation burden",
    },
    override_gate: "Regulatory or accreditation requirement? (Yes is a hard constraint — place at top regardless of score; document the mandate.)",
    stop_doing_candidates: [
      "Tracking activity metrics (visits, procedures) without linking them to outcomes",
      "Running committees that produce reports rather than decisions",
      "Launching initiatives without an identified physician champion",
    ],
    artifact_anchors: {
      1: ["jobs-to-be-done", "continuous-discovery"],
      2: ["prioritization-frameworks", "decision-making-frameworks"],
      3: ["saying-no", "communicating-tradeoffs"],
    },
  },
  "research-lab-pi": {
    label: "Research lab principal investigator",
    stakeholders: {
      users: ["graduate students", "postdocs", "research community"],
      buyers_funders: ["granting agencies (NSF, NIH, foundations)", "university administration"],
    },
    rice_labels: {
      reach: "Citation potential + replication / adoption value in the field",
      impact: "Field-advancement + training value for lab members",
      confidence: "Preliminary data quality + review-committee signal",
      effort: "Grant-writing burden + personnel months + time-to-first-publication",
    },
    override_gate: "Grant deliverable committed? (Yes hard-commits scope — do not deprioritize without PI sign-off and funder notice.)",
    stop_doing_candidates: [
      "Lab meetings that end without a stated decision or assigned action item",
      "Chasing every adjacent direction before landing a first paper in the core thread",
      "Funder reporting that describes work done without surfacing real progress or risks",
    ],
    artifact_anchors: {
      1: ["jobs-to-be-done", "continuous-discovery"],
      2: ["prioritization-frameworks", "decision-making-frameworks"],
      3: ["saying-no", "getting-buy-in"],
    },
  },
};

export const SCALE_CALIBRATION: Record<ScaleEnum, string> = {
  small: "Small scale: lean operations, decisions made by one or two people, light process appropriate. Focus on traction over coverage. Each artifact should be a one-pager.",
  mid: "Mid scale: some structure exists, cross-functional coordination is becoming real. Build habits that survive growth without becoming bureaucracy. Each artifact can run 1-2 pages.",
  large: "Large scale: coordination costs are real. Process is necessary — the risk is process for its own sake. Prioritize ruthlessly, name what you're not doing. Artifacts need clear owners and decision rights.",
};

export const CORPUS_ANCHORS = [
  "jobs-to-be-done",
  "continuous-discovery",
  "prioritization-frameworks",
  "decision-making-frameworks",
  "saying-no",
  "communicating-tradeoffs",
  "okrs",
  "getting-buy-in",
] as const;
