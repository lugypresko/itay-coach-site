import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getServerPayload } from "@/lib/payload";
import type { PlayerTrapResult } from "@/lib/player-trap";

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

  const report = parseResult(record.assessmentResult) ?? {
    totalScore: 0,
    maxScore: 15,
    title: "Unknown",
    summary: "No diagnostic result was stored for this report.",
    diagnosis: "The report payload is incomplete.",
    primaryCTA: "Return to the diagnostic",
    secondaryCTA: "Use the scorecard",
    nextStep: "Re-run the diagnostic to capture a complete report.",
  };
  return (
    <main className="content-shell">
      <section className="content-hero">
        <p className="eyebrow">Diagnostic report</p>
        <h1>{report.title}</h1>
        <p className="lede">{report.summary}</p>
      </section>

      <section className="content-grid">
        <article className="content-panel-wide">
          <div className="result-stack">
            <div className="result-card">
              <p className="authority-label">Score</p>
              <p className="result-score">
                <strong>
                  {report.totalScore}
                </strong>{" "}
                of {report.maxScore}
              </p>
            </div>
            <div className="result-card">
              <p className="authority-label">Diagnosis</p>
              <p className="authority-summary">{report.diagnosis}</p>
            </div>
            <div className="result-card">
              <p className="authority-label">Next step</p>
              <p className="authority-summary">{report.nextStep}</p>
            </div>
            <div className="result-card">
              <p className="authority-label">Primary CTA</p>
              <p className="authority-summary">{report.primaryCTA}</p>
              <p className="authority-summary">{report.secondaryCTA}</p>
            </div>
          </div>

          <div className="content-actions">
            <form className="inline-form" action="/api/player-trap/diagnosis-call" method="post">
              <input type="hidden" name="reportToken" value={record.reportToken ?? token} />
              <button className="primary-link" type="submit">
                Request diagnosis call
              </button>
            </form>
            <Link className="secondary-link" href="/tech-leadership-visibility-scorecard">
              Open the scorecard
            </Link>
          </div>

          <div className="report-meta">
            <p className="authority-summary">Report requested: {formatDate(record.reportRequestedAt)}</p>
            <p className="authority-summary">Lead email: {record.email}</p>
            <p className="authority-summary">
              Diagnosis call request is tracked on the button below.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
