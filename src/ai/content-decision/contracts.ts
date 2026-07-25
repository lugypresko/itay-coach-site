import { z } from "zod";

const idSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a canonical kebab-case ID");
const idArraySchema = z.array(idSchema).min(1);

export const contentDecisionStatusOptions = ["draft", "active", "archived"] as const;
export const contentDecisionValidationStatusOptions = ["unvalidated", "valid", "invalid", "stale"] as const;
export const contentDecisionJourneyStageOptions = ["awareness", "consideration", "decision", "coach_intent"] as const;

export const contentDecisionSchema = z.object({
  id: idSchema,
  decisionVersion: z.number().int().positive(),
  primaryAudienceEntityId: idSchema,
  primaryProblemId: idSchema,
  symptomIds: idArraySchema,
  primaryFrameworkEntityId: idSchema,
  primaryOfferId: idSchema,
  primaryCtaId: idSchema,
  journeyStage: z.enum(contentDecisionJourneyStageOptions),
  claimIds: idArraySchema,
  evidenceIds: z.array(idSchema),
  canonicalPath: z.string().trim().startsWith("/").refine((value) => value.length > 1, "canonicalPath must not be root"),
  sourceInsightIds: idArraySchema,
  status: z.enum(contentDecisionStatusOptions),
  lastValidatedAt: z.string().datetime({ offset: true }).nullable(),
  validationStatus: z.enum(contentDecisionValidationStatusOptions),
}).strict();

export type ContentDecision = z.infer<typeof contentDecisionSchema>;
