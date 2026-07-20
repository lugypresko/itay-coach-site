"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
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
    return JSON.parse(responseText) as { error?: string; reportUrl?: string; result?: { tier?: string } };
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
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const complete = isComplete(answers, questions);
  const utm = useMemo(() => normalizeUtmAttribution(initialUtm), [initialUtm]);
  useEffect(() => {
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
          answers: buildAnswerRecord(answers, questions),
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
              <p className="authority-summary">{copy.resultPromptBody}</p>
              <LeadCaptureForm
                copy={copy}
                name={name}
                email={email}
                consentAccepted={consentAccepted}
                status={status}
                error={error}
                disabled
                onNameChange={setName}
                onEmailChange={setEmail}
                onConsentChange={setConsentAccepted}
                onSubmit={handleLeadSubmit}
              />
            </>
          ) : (
            <>
              <h2>{copy.resultGateTitle}</h2>
              <p className="authority-summary">{copy.resultGateBody}</p>
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
