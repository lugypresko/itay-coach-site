import { describe, expect, it } from "vitest";

import {
  createReaderFacingArtifactDraft,
  createReaderFacingArtifactHash,
  readerFacingPageArtifactSchema,
  serializeReaderFacingPublicFields,
} from "../../src/domain/reader-facing-page-artifact";

function publicFields() {
  return {
    pageType: "cluster" as const,
    canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
    locale: "en",
    title: "Your team should not need you for every important decision",
    description: "Diagnose why reviews and decisions keep returning to you.",
    body: [
      {
        sectionId: "recognition",
        heading: "You may be stuck in the Player Trap if",
        paragraphs: ["The pattern appears before it feels like a leadership problem."],
        bullets: ["Important reviews wait for you.", "Incidents pull you back into execution."],
      },
    ],
    primaryCta: {
      label: "Diagnose your bottleneck pattern",
      href: "/player-trap",
      context: "Use the diagnostic to identify where judgment and ownership still depend on you.",
    },
    secondaryCta: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      context: "Talk through whether coaching is the right next step for your situation.",
    },
    internalLinks: [
      { label: "Player Trap framework", href: "/frameworks/player-trap" },
      { label: "Tech Leadership Coaching", href: "/pillars/tech-leadership-coaching" },
    ],
    faq: [
      {
        question: "Is this just a delegation problem?",
        answer: "Not necessarily. Tasks may move while judgment and approval still return to the manager.",
      },
    ],
    seo: {
      title: "Stop Being the Bottleneck as an Engineering Manager | The Push",
      description: "Diagnose why important engineering decisions keep returning to you.",
    },
    structuredDataInput: {
      type: "Article" as const,
      authorName: "Itay Foyerstein",
    },
  };
}

describe("ReaderFacingPageArtifact", () => {
  it.each(["//evil.example/path", "/../admin", "/safe\\evil"])("rejects unsafe internal path %s", (path) => {
    expect(() => createReaderFacingArtifactDraft({
      artifactId: "unsafe-path",
      artifactVersion: 1,
      schemaVersion: "1.0.0",
      createdAt: "2026-07-13T12:00:00.000Z",
      ...publicFields(),
      canonicalPath: path,
    })).toThrow();
  });
  it("creates a strict draft with a server-computed SHA-256 hash", () => {
    const artifact = createReaderFacingArtifactDraft({
      artifactId: "draft-05-player-trap",
      artifactVersion: 1,
      schemaVersion: "1.0.0",
      createdAt: "2026-07-13T12:00:00.000Z",
      ...publicFields(),
    });

    expect(artifact.lifecycle).toBe("draft");
    expect(artifact.artifactHash).toMatch(/^[a-f0-9]{64}$/);
    expect(readerFacingPageArtifactSchema.parse(artifact)).toEqual(artifact);
    expect(
      readerFacingPageArtifactSchema.safeParse({ ...artifact, reviewStatus: "approved" }).success,
    ).toBe(false);
  });

  it("canonicalizes line endings and object key order while preserving array order", () => {
    const fields = publicFields();
    const reordered = {
      ...fields,
      body: fields.body.map((section) => ({
        bullets: section.bullets,
        paragraphs: section.paragraphs.map((paragraph) => paragraph.replace(/\n/g, "\r\n")),
        heading: section.heading,
        sectionId: section.sectionId,
      })),
    };

    expect(serializeReaderFacingPublicFields(fields)).toBe(serializeReaderFacingPublicFields(reordered));
    expect(createReaderFacingArtifactHash(fields)).toBe(createReaderFacingArtifactHash(reordered));

    const reversed = { ...fields, internalLinks: [...fields.internalLinks].reverse() };
    expect(createReaderFacingArtifactHash(reversed)).not.toBe(createReaderFacingArtifactHash(fields));
  });

  it.each([
    ["title", (value: ReturnType<typeof publicFields>) => ({ ...value, title: `${value.title}.` })],
    ["description", (value: ReturnType<typeof publicFields>) => ({ ...value, description: `${value.description}.` })],
    ["body", (value: ReturnType<typeof publicFields>) => ({ ...value, body: [{ ...value.body[0], paragraphs: ["Changed."] }] })],
    ["primary CTA", (value: ReturnType<typeof publicFields>) => ({ ...value, primaryCta: { ...value.primaryCta, href: "/changed" } })],
    ["secondary CTA", (value: ReturnType<typeof publicFields>) => ({ ...value, secondaryCta: { ...value.secondaryCta!, label: "Changed" } })],
    ["internal links", (value: ReturnType<typeof publicFields>) => ({ ...value, internalLinks: [...value.internalLinks, { label: "More", href: "/more" }] })],
    ["FAQ", (value: ReturnType<typeof publicFields>) => ({ ...value, faq: [{ ...value.faq[0], answer: "Changed." }] })],
    ["SEO", (value: ReturnType<typeof publicFields>) => ({ ...value, seo: { ...value.seo, title: "Changed" } })],
    ["structured data", (value: ReturnType<typeof publicFields>) => ({ ...value, structuredDataInput: { ...value.structuredDataInput!, authorName: "Changed" } })],
  ])("changes the hash when %s changes", (_label, mutate) => {
    const fields = publicFields();
    expect(createReaderFacingArtifactHash(mutate(fields))).not.toBe(createReaderFacingArtifactHash(fields));
  });
});
