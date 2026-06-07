import { buildEntityRelationshipsCollection } from "./authority-model";

export const EntityRelationships = buildEntityRelationshipsCollection({
  slug: "entity_relationships",
  singular: "Entity Relationship",
  plural: "Entity Relationships",
  description: "Directional relationships between canonical authority entities.",
});

