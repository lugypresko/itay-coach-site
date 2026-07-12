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
  const ownClassNames =
    typeof className === "string" ? className.split(/\s+/).filter(Boolean) : [];

  return [...ownClassNames, ...collectClassNames(node.props?.children)];
}

describe("AI-first leadership landing page", () => {
  it("renders the richer landing-page sections in order", () => {
    const page = AiFirstLeadershipPage();
    const text = collectText(page as ReactLikeNode).join(" ");

    const expectedSections = [
      "AI-first leadership for technical leaders",
      "Who this is for",
      "Tech Leads who keep getting pulled back into execution.",
      "What changes",
      "Leadership visibility improves without turning the page into marketing language.",
      "Background",
      "Process",
      "Player Trap",
      "Related authority",
      "Next step",
      "Book a fit call if you want to clarify the leadership problem before choosing a path. Use the scorecard if you want a diagnostic branch first.",
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
    expect(hrefs).toContain("/frameworks/invisible-executor");
    expect(hrefs).not.toContain("/invisible-executor-assessment");
  });

  it("keeps mobile-safe landing structure hooks available", () => {
    const page = AiFirstLeadershipPage();
    const classNames = collectClassNames(page as ReactLikeNode);

    expect(classNames).toContain("content-shell");
    expect(classNames).toContain("content-hero");
    expect(classNames).toContain("content-grid");
    expect(classNames).toContain("content-panel");
    expect(classNames).toContain("content-panel-wide");
    expect(classNames).toContain("content-actions");
    expect(classNames).toContain("cta-stack");
  });

  it("does not render unsupported performance claims", () => {
    const page = AiFirstLeadershipPage();
    const text = collectText(page as ReactLikeNode).join(" ");

    expect(text).not.toContain("120+");
    expect(text).not.toContain("30-40%");
    expect(text).not.toContain("30–40%");
  });
});
