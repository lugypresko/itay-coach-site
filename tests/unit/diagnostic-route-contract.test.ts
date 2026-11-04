import { afterEach, describe, expect, it, vi } from "vitest";

import Page, { metadata } from "../../src/app/(site)/diagnostic/page";
import { DiagnosticFunnel } from "../../src/components/diagnostic/diagnostic-funnel";
import { DiagnosticV3 } from "../../src/components/diagnostic/diagnostic-v3";

function renderedDiagnostic() {
  const page = Page();
  const header = page.props.children[0];
  const funnel = page.props.children[1];

  return { page, header, title: header.props.children[1], funnel };
}

describe("/diagnostic route contract", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("exposes basic metadata and keeps the route out of the index", () => {
    expect(metadata).toMatchObject({
      title: "Leadership Diagnostic",
      description: expect.any(String),
      alternates: { canonical: "/diagnostic" },
      robots: { index: false, follow: false },
    });
  });

  it("mounts Diagnostic V3 outside production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");

    const { page, header, title, funnel } = renderedDiagnostic();

    expect(page.type).toBe("main");
    expect(page.props.id).toBe("main-content");
    expect(page.props.className).toContain("diagnostic-v3-shell");
    expect(header.type).toBe("header");
    expect(title.props.id).toBe("diagnostic-route-title");
    expect(title.props.children).toBe("Bring one real situation.");
    expect(funnel.type).toBe(DiagnosticV3);
    expect(funnel.props.previewUx).toBe(true);
  });

  it("keeps the V1 funnel on production until the production flag is set", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("DIAGNOSTIC_V3_PRODUCTION_ENABLED", "false");

    const { page, title, funnel } = renderedDiagnostic();

    expect(page.props.className).not.toContain("diagnostic-v3-shell");
    expect(title.props.children).toBe("Leadership Diagnostic");
    expect(funnel.type).toBe(DiagnosticFunnel);
  });

  it("mounts Diagnostic V3 in production when the production flag is true", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("DIAGNOSTIC_V3_PRODUCTION_ENABLED", "true");

    const { page, title, funnel } = renderedDiagnostic();

    expect(page.props.className).toContain("diagnostic-v3-shell");
    expect(title.props.children).toBe("Bring one real situation.");
    expect(funnel.type).toBe(DiagnosticV3);
    expect(funnel.props.previewUx).toBe(false);
  });
});
