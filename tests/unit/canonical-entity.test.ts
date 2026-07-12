import { describe, expect, it } from "vitest";

import {
  canonicalItayEntity,
  normalizeCanonicalPersonName,
} from "../../src/ai/governance/canonical-entity";

describe("canonical Itay entity", () => {
  it("uses Itay Foyerstein as the only canonical Person name", () => {
    expect(canonicalItayEntity.name).toBe("Itay Foyerstein");
    expect(canonicalItayEntity.slug).toBe("itay-foyerstein");
    expect(canonicalItayEntity.entityType).toBe("Person");
  });

  it.each([
    "Itay Foyerstein",
    "Itay Feuerstein",
    "Itai Feuerstein",
    "Itay Foyerstien",
  ])("normalizes %s to the canonical Person name", (name) => {
    expect(normalizeCanonicalPersonName(name)).toBe("Itay Foyerstein");
  });

  it("does not rewrite unrelated names", () => {
    expect(normalizeCanonicalPersonName("Ada Lovelace")).toBe("Ada Lovelace");
  });
});
