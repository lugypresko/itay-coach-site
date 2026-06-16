import { describe, expect, it } from "vitest";

import AiFirstLeadershipPage from "../../src/app/(site)/ai-first-leadership/page";

type ReactLikeNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | ReactLikeElement
  | ReactLikeNode[];

type ReactLikeElement = {
  props?: {
    children?: ReactLikeNode;
    href?: unknown;
    className?: unknown;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function collectText(node: ReactLikeNode): string[] {
  if (typeof node === "string" || typeof node === "number") {
    return [String(node)];
  }

  if (!node || typeof node === "boolean") {
    return [];
  }

  if (Array.isArray(node)) {
    return node.flatMap(collectText);
  }

  return collectText(node.props?.children);
}

function collectHrefs(node: ReactLikeNode): string[] {
  if (!node || typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
    return [];
  }

  if (Array.isArray(node)) {
    return node.flatMap(collectHrefs);
  }

  const href = node.props?.href;
  const ownHref = typeof href === "string" ? [href] : [];

  return [...ownHref, ...collectHrefs(node.props?.children)];
}

function collectClassNames(node: ReactLikeNode): string[] {
  if (!node || typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
    return [];
  }

  if (Array.isArray(node)) {
    return node.flatMap(collectClassNames);
  }

  const className = node.props?.className;
  const ownClassNames = typeof className === "string" ? [className] : [];

  return [...ownClassNames, ...collectClassNames(node.props?.children)];
}

describe("AI-first leadership landing page", () => {
  it("renders the richer landing-page sections in order", () => {
    const page = AiFirstLeadershipPage();
    const text = collectText(page as ReactLikeNode).join(" ");

    const expectedSections = [
      "Your strongest manager should not be the system.",
      "The pattern",
      "Three ways to work",
      "Strategic Leadership Sprint",
      "Squad 1+3 Execution Sprint",
      "Engineering Leadership Forum",
      "The Push Method",
      "This is not generic leadership training.",
      "AI makes the Player Trap more expensive.",
      "Built from execution, not theory",
      "Choose the level. Change the dependency.",
    ];

    let previousIndex = -1;

    for (const section of expectedSections) {
      const currentIndex = text.indexOf(section);
      expect(currentIndex, `${section} should render`).toBeGreaterThan(-1);
      expect(currentIndex, `${section} should render after the prior section`).toBeGreaterThan(previousIndex);
      previousIndex = currentIndex;
    }
  });

  it("routes primary and diagnostic CTAs to approved paths", () => {
    const page = AiFirstLeadershipPage();
    const hrefs = collectHrefs(page as ReactLikeNode);

    expect(hrefs).toContain("/book-a-fit-call");
    expect(hrefs).toContain("/tech-leadership-visibility-scorecard");
    expect(hrefs).toContain("/player-trap");
    expect(hrefs).toContain("/book-a-fit-call?engagement=leader");
    expect(hrefs).toContain("/book-a-fit-call?engagement=squad");
    expect(hrefs).toContain("/book-a-fit-call?engagement=forum");
  });

  it("keeps mobile-safe landing structure hooks available", () => {
    const page = AiFirstLeadershipPage();
    const classNames = collectClassNames(page as ReactLikeNode);

    expect(classNames).toContain("landing-shell");
    expect(classNames).toContain("landing-hero");
    expect(classNames).toContain("signal-strip");
    expect(classNames).toContain("offer-grid");
    expect(classNames).toContain("method-flow");
    expect(classNames).toContain("fit-grid");
    expect(classNames).toContain("landing-final-cta");
  });

  it("does not render unsupported performance claims", () => {
    const page = AiFirstLeadershipPage();
    const text = collectText(page as ReactLikeNode).join(" ");

    expect(text).not.toContain("120+");
    expect(text).not.toContain("30-40%");
    expect(text).not.toContain("30–40%");
  });
});
