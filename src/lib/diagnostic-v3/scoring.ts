import {
  SCORING_VERSION,
  type Answers,
  type Qualification,
  type Scoring,
} from "./contracts";
const points = (value: string | undefined, map: Record<string, number>) =>
  value ? (map[value] ?? 0) : 0;
const max = (values: string[] | undefined, map: Record<string, number>) =>
  Math.max(0, ...(values ?? []).map((v) => map[v] ?? 0));
export function score(a: Answers, q?: Qualification): Scoring {
  const pain =
    points(a.absence, {
      wait: 4,
      discuss: 4,
      escalate: 4,
      distrust: 2,
      handles: 0,
      unsure: 1,
    }) +
    max(a.impact, {
      delivery: 4,
      customer: 4,
      cross: 3,
      time: 2,
      development: 2,
      confidence: 2,
      strategy: 2,
    }) +
    points(a.frequency, { several: 2, weekly: 1, monthly: 1 });
  const urgency =
    points(a.duration, { first: 0, weeks: 1, months: 2, long: 3, system: 3 }) +
    points(a.frequency, { several: 3, weekly: 2, monthly: 1 }) +
    max(a.impact, {
      customer: 4,
      delivery: 3,
      cross: 2,
      strategy: 2,
      time: 1,
      development: 1,
      confidence: 1,
    });
  const attempts = (a.attempts ?? []).filter(
    (v) => !["nothing", "other"].includes(v),
  ).length;
  const readiness =
    (attempts >= 2 ? 4 : attempts === 1 ? 2 : 0) +
    (a.desired && a.desired !== "other" ? 3 : 0) +
    ((a.impact ?? []).some((v) => !["little", "other"].includes(v)) ? 3 : 0);
  const fit = q
    ? points(q.role, {
        cto: 6,
        vp: 6,
        head_director: 6,
        group: 5,
        em: 3,
        other: 0,
      }) +
      points(q.org_size, {
        under20: 0,
        "20_50": 2,
        "51_100": 4,
        "101_250": 4,
        "251plus": 3,
      })
    : null;
  const total = fit === null ? null : fit + pain + urgency + readiness;
  let route: Scoring["route"] = "nurture",
    rule = "6_other";
  if (fit === null) {
    route = "unqualified_nurture";
    rule = "1_missing_fit";
  } else if (pain <= 3) {
    route = "self_service";
    rule = "2_low_pain";
  } else if (total! >= 28 && fit >= 6 && pain >= 6) {
    route = "conversation";
    rule = "3_threshold";
  } else if (
    pain >= 9 &&
    urgency >= 9 &&
    ["cto", "vp", "head_director", "group"].includes(q!.role)
  ) {
    route = "conversation_override";
    rule = "4_severe_override";
  } else if (total! < 18) {
    route = "self_service";
    rule = "5_low_total";
  }
  return {
    scoring_version: SCORING_VERSION,
    fit_status: fit === null ? "unknown" : "known",
    fit,
    pain,
    urgency,
    readiness,
    total,
    route,
    rule,
  };
}
