import type { DiagnosticSession } from "./types";

export function formatDiagnosticFitContext(session: DiagnosticSession | null): string {
  if (!session?.result) return "";
  return [
    `Observed pattern: ${session.result.observedPattern}`,
    `Working hypothesis: ${session.result.hypothesis.explanation}`,
    `Experiment: ${session.result.experiment.action}`,
  ].join("\n");
}
