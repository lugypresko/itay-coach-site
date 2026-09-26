import type {
  DiagnosticAnswers,
  DiagnosticFitMetadata,
  DiagnosticLeadMetadata,
  DiagnosticResult,
  DiagnosticSession,
  DiagnosticSourceMetadata,
} from "./types";

export type DiagnosticSessionCreateInput = {
  source: DiagnosticSourceMetadata;
  status: DiagnosticSession["status"];
  answers: DiagnosticAnswers;
  result?: DiagnosticResult;
  lead?: DiagnosticLeadMetadata;
  fit?: DiagnosticFitMetadata;
};

export type DiagnosticSessionUpdateInput = Partial<DiagnosticSessionCreateInput>;

export type DiagnosticSessionRepository = {
  create(input: DiagnosticSessionCreateInput, now?: Date): Promise<DiagnosticSession>;
  read(id: string, now?: Date): Promise<DiagnosticSession | null>;
  update(id: string, input: DiagnosticSessionUpdateInput, now?: Date): Promise<DiagnosticSession>;
  isDeletionEligible(id: string, now?: Date): Promise<boolean>;
  delete(id: string, now?: Date): Promise<boolean>;
};
