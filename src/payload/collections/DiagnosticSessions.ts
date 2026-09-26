import type { CollectionConfig } from "payload";

/** Anonymous, short-lived state for the conversational diagnostic.
 * This collection intentionally has no contact fields or report identifiers.
 */
export const DiagnosticSessions: CollectionConfig = {
  slug: "diagnostic-sessions",
  admin: {
    description: "Short-lived anonymous diagnostic state; contains no PII.",
    useAsTitle: "sessionId",
  },
  access: {
    create: () => true,
    read: () => false,
    update: () => false,
    delete: () => false,
  },
  timestamps: true,
  fields: [
    { name: "sessionId", type: "text", required: true, unique: true, index: true },
    { name: "language", type: "select", options: ["en", "he"], defaultValue: "en", index: true },
    { name: "currentState", type: "text", required: true, defaultValue: "ROLE" },
    { name: "answers", type: "json", required: true, defaultValue: {} },
    { name: "signals", type: "json", required: true, defaultValue: {} },
    { name: "attribution", type: "json", defaultValue: {} },
    { name: "completedTurns", type: "number", required: true, defaultValue: 0 },
    { name: "expiresAt", type: "date", required: true, index: true },
    { name: "insight", type: "json" },
    { name: "diagnosis", type: "json" },
    { name: "intent", type: "select", options: ["talk_now", "later", "self_serve"] },
    { name: "route", type: "select", options: ["TALK_NOW", "NURTURE", "NO_FIT", "INSUFFICIENT_EVIDENCE"] },
    { name: "reasonCodes", type: "json" },
    { name: "leadId", type: "text" },
    { name: "requestToTalkSubmissionId", type: "text" },
  ],
};
