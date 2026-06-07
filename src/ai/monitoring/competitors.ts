import type { Competitor } from "./types";

export class CompetitorRegistry {
  private readonly competitors: Competitor[];

  constructor(initialCompetitors: Competitor[] = []) {
    this.competitors = [...initialCompetitors];
  }

  list(): Competitor[] {
    return [...this.competitors];
  }

  upsert(competitor: Competitor): void {
    const index = this.competitors.findIndex((entry) => entry.name.toLowerCase() === competitor.name.toLowerCase());
    if (index >= 0) {
      this.competitors[index] = competitor;
      return;
    }
    this.competitors.push(competitor);
  }

  findByName(name: string): Competitor | undefined {
    return this.competitors.find((entry) => entry.name.toLowerCase() === name.toLowerCase());
  }

  normalizeRecommendedNames(names: string[]): string[] {
    return names
      .map((name) => name.trim())
      .filter(Boolean)
      .filter((name, index, array) => array.findIndex((candidate) => candidate.toLowerCase() === name.toLowerCase()) === index);
  }
}
