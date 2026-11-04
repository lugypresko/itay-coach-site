import { afterEach, describe, expect, it, vi } from "vitest";

import Page, { metadata } from "../../src/app/(site)/diagnostic/page";
import { DiagnosticFunnel } from "../../src/components/diagnostic/diagnostic-funnel";
import { DiagnosticV3 } from "../../src/components/diagnostic/diagnostic-v3";
import { ZivBaruchQuote } from "@/components/social-proof/ziv-baruch-quote";

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

  it("mounts fast Diagnostic V3 on Preview without tying the flag to the QA banners", () => {
    vi.stubEnv("VERCEL_ENV", "preview");

    const { page, header, title, funnel } = renderedDiagnostic();
    const trust = header.props.children[3];

    expect(page.type).toBe("main");
    expect(page.props.id).toBe("main-content");
    expect(page.props.className).toContain("diagnostic-v3-shell");
    expect(header.type).toBe("header");
    expect(title.props.id).toBe("diagnostic-route-title");
    expect(title.props.children).toBe("Bring one real situation.");
    expect(trust.type).toBe(ZivBaruchQuote);
    expect(trust.props.layout).toBe("inline");
    expect(funnel.type).toBe(DiagnosticV3);
    expect(funnel.props.fastUx).toBe(true);
    expect(funnel.props.previewQa).toBe(true);
  });

  it("can turn fast UX off on Preview while QA banners stay enabled", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("DIAGNOSTIC_V3_FAST_UX", "false");

    const { funnel } = renderedDiagnostic();

    expect(funnel.type).toBe(DiagnosticV3);
    expect(funnel.props.fastUx).toBe(false);
    expect(funnel.props.previewQa).toBe(true);
  });

  it("keeps the legacy funnel, and hides the trust line, until production is enabled", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("DIAGNOSTIC_V3_PRODUCTION_ENABLED", "false");

    const { page, header, title, funnel } = renderedDiagnostic();

    expect(page.props.className).not.toContain("diagnostic-v3-shell");
    expect(title.props.children).toBe("Leadership Diagnostic");
    expect(header.props.children[3]).toBeNull();
    expect(funnel.type).toBe(DiagnosticFunnel);
  });

  it("uses fast UX in production when V3 is enabled and does not show Preview QA", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("DIAGNOSTIC_V3_PRODUCTION_ENABLED", "true");

    const { page, header, title, funnel } = renderedDiagnostic();

    expect(page.props.className).toContain("diagnostic-v3-shell");
    expect(title.props.children).toBe("Bring one real situation.");
    expect(header.props.children[3].type).toBe(ZivBaruchQuote);
    expect(funnel.type).toBe(DiagnosticV3);
    expect(funnel.props.fastUx).toBe(true);
    expect(funnel.props.previewQa).toBe(false);
  });

  it("restores the slower production path only when the fast UX flag is false", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("DIAGNOSTIC_V3_PRODUCTION_ENABLED", "true");
    vi.stubEnv("DIAGNOSTIC_V3_FAST_UX", "false");

    const { funnel } = renderedDiagnostic();

    expect(funnel.props.fastUx).toBe(false);
    expect(funnel.props.previewQa).toBe(false);
  });
});
