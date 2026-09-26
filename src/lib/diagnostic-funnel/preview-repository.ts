import { createPreviewSessionRepository } from "./preview-session-repository";
import type { DiagnosticSessionRepository } from "./session-repository";

const repositoryKey = "__itaycoachDiagnosticPreviewRepository";

export function getPreviewDiagnosticSessionRepository(): DiagnosticSessionRepository {
  const runtime = globalThis as typeof globalThis & {
    __itaycoachDiagnosticPreviewRepository?: DiagnosticSessionRepository;
  };
  runtime[repositoryKey as "__itaycoachDiagnosticPreviewRepository"] ??= createPreviewSessionRepository();
  return runtime[repositoryKey as "__itaycoachDiagnosticPreviewRepository"]!;
}
