import { buildEntityAuthorityCollection } from "./authority-model";

export const Entities = buildEntityAuthorityCollection({
  slug: "entities",
  singular: "Entity",
  plural: "Entities",
  description: "Canonical authority nodes that the system can strengthen and score.",
});

