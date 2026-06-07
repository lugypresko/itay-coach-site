export type CollectionAccessBlueprint = {
  create: "authenticated" | "admin-only";
  read: "authenticated" | "admin-only" | "public";
  update: "admin-only" | "self-or-admin" | "append-only";
  delete: "admin-only" | "append-only";
};

export type FieldBlueprint =
  | {
      name: string;
      type: "text" | "textarea" | "email" | "url" | "number" | "date" | "checkbox";
      required?: boolean;
      unique?: boolean;
      index?: boolean;
      adminDescription?: string;
      hidden?: boolean;
    }
  | {
      name: string;
      type: "select";
      required?: boolean;
      options: string[];
      index?: boolean;
      adminDescription?: string;
      hidden?: boolean;
    }
  | {
      name: string;
      type: "array";
      required?: boolean;
      index?: boolean;
      items: FieldBlueprint | { type: "text" | "textarea" | "url" };
      adminDescription?: string;
      hidden?: boolean;
    };

export interface CollectionBlueprint {
  slug: string;
  labels: {
    singular: string;
    plural: string;
  };
  description: string;
  appendOnly?: boolean;
  timestamps?: boolean;
  versioning?: boolean;
  access: CollectionAccessBlueprint;
  fields: FieldBlueprint[];
}

export const visibilityMonitorReviewerRoleOptions = ["manual", "semi_manual", "automated"] as const;

export const visibilityMonitorReviewStatusOptions = ["draft", "needs_review", "ready_for_review", "approved"] as const;

export const visibilityMonitorGapClassificationOptions = [
  "entity_gap",
  "methodology_gap",
  "framework_gap",
  "evidence_gap",
  "schema_gap",
  "link_graph_gap",
  "freshness_gap",
  "third_party_gap",
  "intent_gap",
  "competitor_gap",
  "unknown",
] as const;
