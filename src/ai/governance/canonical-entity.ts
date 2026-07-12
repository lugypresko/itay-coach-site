export const canonicalItayEntity = {
  name: "Itay Foyerstein",
  slug: "itay-foyerstein",
  entityType: "Person",
  aliases: ["Itay Feuerstein", "Itai Feuerstein", "Itay Foyerstien"],
} as const;

const normalizedItayNames = new Set(
  [canonicalItayEntity.name, ...canonicalItayEntity.aliases].map((name) =>
    name.trim().toLocaleLowerCase("en"),
  ),
);

export function normalizeCanonicalPersonName(name: string): string {
  const trimmedName = name.trim();

  return normalizedItayNames.has(trimmedName.toLocaleLowerCase("en"))
    ? canonicalItayEntity.name
    : trimmedName;
}
