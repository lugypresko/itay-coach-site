"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";

import {
  normalizeUtmAttribution,
  type PlayerTrapAssessmentCopy,
  type PlayerTrapLanguage,
  type PlayerTrapQuestion,
  type PlayerTrapQuestionId,
  type PlayerTrapUtmAttribution,
} from "@/lib/player-trap";
import { deriveDiagnosticSignals, routeDiagnostic, type DiagnosticSignals, type DiagnosticRoute } from "@/lib/assessment-journey";

type PlayerTrapAssessmentClientProps = {
  questions: PlayerTrapQuestion[];
  initialUtm: PlayerTrapUtmAttribution;
  pageLanguage: PlayerTrapLanguage;
  copy: PlayerTrapAssessmentCopy;
};

function isComplete(answers: Partial<Record<PlayerTrapQuestionId, string>>, questions: PlayerTrapQuestion[]) {
  return questions.every((question) => Boolean(answers[question.id]));
}

function buildAnswerRecord(answers: Partial<Record<PlayerTrapQuestionId, string>>, questions: PlayerTrapQuestion[]) {
  return questions.reduce(
    (acc, question) => {
      acc[question.id] = answers[question.id] ?? "";
      return acc;
    },
    {} as Record<PlayerTrapQuestionId, string>,
  );
}

function parseLeadResponse(responseText: string) {
  if (!responseText) {
    return {};
  }

  try {
    return JSON.parse(responseText) as { error?: string; reportUrl?: string; route?: DiagnosticRoute; result?: { tier?: string } };
  } catch {
    return {};
  }
}

export function PlayerTrapAssessmentClient({
  questions,
  initialUtm,
  pageLanguage,
  copy,
}: PlayerTrapAssessmentClientProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<Record<PlayerTrapQuestionId, string>>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [contactEarned, setContactEarned] = useState(false);
  const [dql, setDql] = useState<Partial<DiagnosticSignals>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [reportToken] = useState(() => crypto.randomUUID());
  const assessmentStarted = useRef(false);
  const complete = isComplete(answers, questions);
  const dqlComplete = typeof dql.fit === "boolean" && typeof dql.pain === "boolean" && typeof dql.now === "boolean" && Boolean(dql.intent);
  const route = dqlComplete ? routeDiagnostic(deriveDiagnosticSignals(dql)) : null;
  const utm = useMemo(() => normalizeUtmAttribution(initialUtm), [initialUtm]);
  useEffect(() => {
    if (assessmentStarted.current) return;
    assessmentStarted.current = true;
    track("assessment_start", {
      assessment: "player-trap",
      page_language: pageLanguage,
      utm_source: utm.utmSource,
      utm_medium: utm.utmMedium,
      utm_campaign: utm.utmCampaign,
      utm_content: utm.utmContent,
      utm_term: utm.utmTerm,
    });
  }, [pageLanguage, utm]);

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    if (!complete) {
      setStatus("error");
      setError(copy.resultPromptBody);
      return;
    }

    if (!contactEarned) {
      setStatus("error");
      setError("Review the micro-insight before sharing your contact details.");
      return;
    }

    if (!consentAccepted) {
      setStatus("error");
      setError(copy.consentError);
      return;
    }

    try {
      const response = await fetch("/api/player-trap/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          reportToken,
          answers: buildAnswerRecord(answers, questions),
          dql: deriveDiagnosticSignals(dql),
          pageLanguage,
          contentConsentAccepted: consentAccepted,
          cookiesConsentAccepted: consentAccepted,
          utm,
        }),
      });

      const responseText = await response.text();
      const payload = parseLeadResponse(responseText);

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create the diagnostic report.");
      }

      track("assessment_complete", {
        assessment: "player-trap",
        page_language: pageLanguage,
        result_type: typeof payload.result?.tier === "string" ? payload.result.tier : "",
        utm_source: utm.utmSource,
        utm_medium: utm.utmMedium,
        utm_campaign: utm.utmCampaign,
        utm_content: utm.utmContent,
        utm_term: utm.utmTerm,
      });
      track("diagnostic_contact_earned", {
        assessment: "player-trap",
        page_language: pageLanguage,
        utm_source: utm.utmSource,
        utm_medium: utm.utmMedium,
        utm_campaign: utm.utmCampaign,
      });

      if (!payload.reportUrl) {
        throw new Error("Report URL missing from response.");
      }

      router.push(new URL(payload.reportUrl).pathname);
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to submit the diagnostic.");
    }
  }

  return (
    <div className="assessment-shell">
      <div className="assessment-form">
        <div className="assessment-intro">
          <p className="authority-label">{copy.quickLabel}</p>
          <p className="authority-summary">{copy.quickIntro}</p>
        </div>

        <div className="assessment-stack" id="player-trap-self-check">
          <div className="assessment-intro">
            <p className="authority-label">{copy.fullAssessmentLabel}</p>
            <p className="authority-summary">{copy.fullAssessmentIntro}</p>
          </div>

          {questions.map((question) => (
            <fieldset className="assessment-question" key={question.id}>
              <legend>{question.prompt}</legend>
              <p className="assessment-help">{question.help}</p>
              <div className="assessment-options">
                {question.choices.map((choice) => (
                  <label className="assessment-option" key={choice.label}>
                    <input
                      type="radio"
                      name={question.id}
                      value={choice.label}
                      checked={answers[question.id] === choice.label}
                      onChange={() => {
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: choice.label,
                        }));
                      }}
                    />
                    <span>{choice.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      <aside className="assessment-result">
        <div className="result-block">
          <p className="authority-label">{copy.resultLabel}</p>
          {!complete ? (
            <>
              <h2>{copy.resultPromptTitle}</h2>
              <p className="authority-summary">Complete the five questions to receive a specific hypothesis about the pattern in your case.</p>
            </>
          ) : (
            <>
              <h2>Your case points to a leadership pattern.</h2>
              <p className="authority-summary">The likely pattern is that decisions keep returning to the person with the most context. Test one decision this week by writing the decision rule before the next escalation and watching whether the team uses it without you.</p>
              {!dqlComplete ? (
                <div className="diagnostic-dql" aria-label="Qualify your situation">
                  <fieldset className="assessment-question"><legend>Is this a technical leadership problem you own?</legend><div className="assessment-options">
                    {[[true, "Yes, I own this"], [false, "No, this is outside my role"]].map(([value, label]) => <label className="assessment-option" key={String(value)}><input type="radio" name="fit" onChange={() => setDql((s) => ({ ...s, fit: value as boolean }))} /><span>{label}</span></label>)}
                  </div></fieldset>
                  <fieldset className="assessment-question"><legend>Is the pattern happening in a current case?</legend><div className="assessment-options">
                    {[[true, "Yes, it is current"], [false, "No, it is hypothetical"]].map(([value, label]) => <label className="assessment-option" key={String(value)}><input type="radio" name="pain" onChange={() => setDql((s) => ({ ...s, pain: value as boolean }))} /><span>{label}</span></label>)}
                  </div></fieldset>
                  <fieldset className="assessment-question"><legend>Is there a reason to act now?</legend><div className="assessment-options">
                    {[[true, "Yes, there is a trigger"], [false, "Not yet"]].map(([value, label]) => <label className="assessment-option" key={String(value)}><input type="radio" name="now" onChange={() => setDql((s) => ({ ...s, now: value as boolean }))} /><span>{label}</span></label>)}
                  </div></fieldset>
                  <fieldset className="assessment-question"><legend>What would be useful next?</legend><div className="assessment-options">
                    {[['talk_now', "Request to talk"], ['later', "Send me the next step"], ['none', "I'll work on this myself"]].map(([value, label]) => <label className="assessment-option" key={value}><input type="radio" name="intent" onChange={() => setDql((s) => ({ ...s, intent: value as DiagnosticSignals["intent"] }))} /><span>{label}</span></label>)}
                  </div></fieldset>
                </div>
              ) : route === "NO_FIT" || route === "INSUFFICIENT_EVIDENCE" ? (
                <p className="authority-summary">{route === "NO_FIT" ? "This is outside the current coaching fit. Keep the experiment and use the result as a self-serve next step." : "There is not enough evidence for a confident diagnosis yet. Run the experiment and revisit the case when the pattern is clearer."}</p>
              ) : !contactEarned ? (
                <button className="form-submit" type="button" onClick={() => setContactEarned(true)}>This reflects my situation — continue</button>
              ) : (
                <LeadCaptureForm
                  copy={copy}
                  name={name}
                  email={email}
                  consentAccepted={consentAccepted}
                  status={status}
                  error={error}
                  onNameChange={setName}
                  onEmailChange={setEmail}
                  onConsentChange={setConsentAccepted}
                  onSubmit={handleLeadSubmit}
                />
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function LeadCaptureForm({
  copy,
  name,
  email,
  consentAccepted,
  status,
  error,
  disabled = false,
  onNameChange,
  onEmailChange,
  onConsentChange,
  onSubmit,
}: {
  copy: PlayerTrapAssessmentCopy;
  name: string;
  email: string;
  consentAccepted: boolean;
  status: "idle" | "submitting" | "error";
  error: string | null;
  disabled?: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onConsentChange: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="form-field">
          <span>{copy.nameLabel}</span>
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            type="text"
            autoComplete="given-name"
            required
            disabled={disabled}
          />
        </label>
        <label className="form-field">
          <span>{copy.emailLabel}</span>
          <input
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            type="email"
            autoComplete="email"
            required
            disabled={disabled}
          />
        </label>
      </div>

      <label className="form-consent">
        <input
          type="checkbox"
          checked={consentAccepted}
          onChange={(event) => onConsentChange(event.target.checked)}
          required
          disabled={disabled}
        />
        <span>{copy.consentLabel}</span>
      </label>

      <div className="form-meta">
        <p className="authority-summary">{copy.formMeta}</p>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="form-submit" type="submit" disabled={disabled || status === "submitting"}>
        {status === "submitting" ? copy.submitSubmitting : copy.submitIdle}
      </button>
    </form>
  );
}
