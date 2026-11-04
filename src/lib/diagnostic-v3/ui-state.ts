import type { Answers } from "./contracts";

export const MAX_MULTI_SELECT = 3;

export function toggleMultiAnswer(
  answers: Answers,
  key: "attempts" | "impact",
  value: string,
): Answers {
  const current = answers[key] ?? [];
  if (current.includes(value)) {
    return { ...answers, [key]: current.filter((item) => item !== value) };
  }

  const exclusive = key === "attempts" ? "nothing" : "little";
  const selected = value === exclusive
    ? [value]
    : [...current.filter((item) => item !== exclusive), value];
  if (selected.length > MAX_MULTI_SELECT) return answers;
  return { ...answers, [key]: selected };
}

export function shouldAutoAdvance(
  step: number,
  answers: Answers,
): boolean {
  if (step === 4) return Boolean(answers.duration && answers.frequency);
  if (step === 5 || step === 6 || step === 8) return false;
  return true;
}
