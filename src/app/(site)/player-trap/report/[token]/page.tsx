import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getServerPayload } from "@/lib/payload";
import {
  buildPlayerTrapReportLabels,
  localizePlayerTrapResult,
  normalizePlayerTrapLanguage,
  type PlayerTrapResult,
} from "@/lib/player-trap";

type PlayerTrapReportPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Player Trap report",
  description: "A diagnostic report for the Player Trap conversion flow.",
  robots: {
    index: false,
    follow: false,
  },
};

function parseResult(value: unknown): PlayerTrapResult | null {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value) as PlayerTrapResult;
  } catch {
    return null;
  }
}

function formatDate(value?: string) {
  if (!value) {
    return "pending";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "pending" : date.toLocaleString();
}

export default async function PlayerTrapReportPage({ params }: PlayerTrapReportPageProps) {
  const { token } = await params;
  const payload = await getServerPayload();
  const result = await payload.find({
    collection: "email-subscribers",
    limit: 1,
    overrideAccess: true,
    where: {
      reportToken: {
        equals: token,
      },
    },
  } as never);

  const record = result.docs[0] as unknown as
    | {
        id: string;
        name?: string;
        email: string;
        reportToken?: string;
        reportUrl?: string;
        diagnosisCallUrl?: string;
        assessmentResult?: string;
        pageLanguage?: string;
        reportViewedAt?: string;
        reportRequestedAt?: string;
      }
    | undefined;

  if (!record) {
    notFound();
  }

  if (!record.reportViewedAt) {
    await payload.update({
      collection: "email-subscribers",
      id: record.id,
      data: {
        reportViewedAt: new Date().toISOString(),
        lifecycleStage: "nurture_active",
      } as never,
      overrideAccess: true,
    });
  }

  const pageLanguage = normalizePlayerTrapLanguage(record.pageLanguage);
  const labels = buildPlayerTrapReportLabels(pageLanguage);
  const report = localizePlayerTrapResult(parseResult(record.assessmentResult) ?? {
    totalScore: 0,
    maxScore: 15,
    tier: "trusted-operator",
    title: "Unknown",
    summary: "No diagnostic result was stored for this report.",
    diagnosis: "The report payload is incomplete, so the hidden cost could not be reconstructed.",
    primaryCTA: "Return to the diagnostic and capture a complete result.",
    secondaryCTA: "Use the scorecard to re-check the pattern.",
    nextStep: "Re-run the diagnostic to capture the missing leadership signals.",
  }, pageLanguage);
  return (
    <main className="content-shell" lang={pageLanguage} dir={pageLanguage === "he" ? "rtl" : "ltr"}>
      <section className="content-hero">
        <p className="eyebrow">{labels.eyebrow}</p>
        <h1>{report.title}</h1>
        <p className="lede">{report.summary}</p>
      </section>

      <section className="content-grid">
        <article className="content-panel-wide">
          <div className="result-stack">
            <div className="result-card">
              <p className="authority-label">{labels.score}</p>
              <p className="result-score">
                <strong>
                  {report.totalScore}
                </strong>{" "}
                {labels.scoreConnector} {report.maxScore}
              </p>
            </div>
            <div className="result-card">
              <p className="authority-label">{labels.diagnosis}</p>
              <p className="authority-summary">{report.diagnosis}</p>
            </div>
            <div className="result-card">
              <p className="authority-label">{labels.nextStep}</p>
              <p className="authority-summary">{report.nextStep}</p>
            </div>
            <div className="result-card">
              <p className="authority-label">{labels.primaryCta}</p>
              <p className="authority-summary">{report.primaryCTA}</p>
              <p className="authority-summary">{report.secondaryCTA}</p>
            </div>
          </div>

          <p className="authority-summary">{labels.diagnosisCallSupport}</p>

          <div className="content-actions">
            <form className="inline-form" action="/api/player-trap/diagnosis-call" method="post">
              <input type="hidden" name="reportToken" value={record.reportToken ?? token} />
              <button className="primary-link" type="submit">
                {labels.diagnosisCallCta}
              </button>
            </form>
            <Link className="secondary-link" href="/tech-leadership-visibility-scorecard">
              {labels.scorecardCta}
            </Link>
          </div>

          <div className="content-actions">
            <Link className="secondary-link" href="/book-a-fit-call?source=assessment">
              Review your result with Itay
            </Link>
            <Link className="secondary-link" href="/for-organizations?source=assessment">
              Discuss the findings for your organization
            </Link>
          </div>
          <div className="report-meta">
            <p className="authority-summary">{labels.reportRequested}: {formatDate(record.reportRequestedAt)}</p>
            <p className="authority-summary">{labels.leadEmail}: {record.email}</p>
            <p className="authority-summary">{labels.diagnosisCallTracked}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
