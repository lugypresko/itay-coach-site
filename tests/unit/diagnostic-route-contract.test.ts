import { describe, expect, it } from "vitest";

import Page, { metadata } from "../../src/app/(site)/diagnostic/page";
import { DiagnosticFunnel } from "../../src/components/diagnostic/diagnostic-funnel";

describe("/diagnostic route contract", () => {
  it("exposes basic metadata and mounts the diagnostic funnel", () => {
    expect(metadata).toMatchObject({
      title: "Leadership Diagnostic",
      description: expect.any(String),
      alternates: { canonical: "/diagnostic" },
      robots: { index: false, follow: false },
    });

    const page = Page();
    expect(page.type).toBe("main");
    expect(page.props.id).toBe("main-content");
    expect(page.props.children[0].type).toBe("header");
    expect(page.props.children[0].props.children[1].props.id).toBe("diagnostic-route-title");
    expect(page.props.children[1].type).toBe(DiagnosticFunnel);
  });
});
