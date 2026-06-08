"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { PlayerTrapQuestion, PlayerTrapQuestionId, PlayerTrapUtmAttribution } from "@/lib/player-trap";
import { normalizeUtmAttribution, playerTrapQuestions, scorePlayerTrap } from "@/lib/player-trap";

type PlayerTrapAssessmentClientProps = {
  questions: PlayerTrapQuestion[];
  initialUtm: PlayerTrapUtmAttribution;
};

function isComplete(answers: Partial<Record<PlayerTrapQuestionId, string>>) {
  return playerTrapQuestions.every((question) => Boolean(answers[question.id]));
}

function buildAnswerRecord(answers: Partial<Record<PlayerTrapQuestionId, string>>) {
  return playerTrapQuestions.reduce(
    (acc, question) => {
      acc[question.id] = answers[question.id] ?? "";
      return acc;
    },
    {} as Record<PlayerTrapQuestionId, string>,
  );
}

export function PlayerTrapAssessmentClient({ questions, initialUtm }: PlayerTrapAssessmentClientProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<Record<PlayerTrapQuestionId, string>>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const complete = isComplete(answers);
  const computedResult = complete ? scorePlayerTrap(buildAnswerRecord(answers)) : null;
  const utm = useMemo(() => normalizeUtmAttribution(initialUtm), [initialUtm]);

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/player-trap/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          answers: buildAnswerRecord(answers),
          utm,
        }),
      });

      const payload = (await response.json()) as { error?: string; reportUrl?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create the diagnostic report.");
      }

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
          <p className="authority-label">5-question diagnostic</p>
          <p className="authority-summary">
            Answer the questions below. When the result is visible, you can request the diagnostic report and the first
            email.
          </p>
        </div>

        <div className="assessment-stack">
          {questions.map((question) => (
            <fieldset className="assessment-question" key={question.id}>
              <legend>
                {question.prompt}
              </legend>
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
          <p className="authority-label">Result</p>
          {!complete || !computedResult ? (
            <>
              <h2>Complete all five answers to see the diagnosis.</h2>
              <p className="authority-summary">
                The result will show whether the current operating model is still visible enough to keep the team from
                turning the manager into the default bottleneck.
              </p>
            </>
          ) : (
            <>
              <h2>{computedResult.title}</h2>
              <p className="authority-summary">{computedResult.summary}</p>
              <p className="result-score">
                Score <strong>{computedResult.totalScore}</strong> of {computedResult.maxScore}
              </p>
              <div className="result-stack">
                <div className="result-card">
                  <p className="authority-label">Diagnosis</p>
                  <p className="authority-summary">{computedResult.diagnosis}</p>
                </div>
                <div className="result-card">
                  <p className="authority-label">Next step</p>
                  <p className="authority-summary">{computedResult.nextStep}</p>
                  <p className="authority-summary">{computedResult.primaryCTA}</p>
                  <p className="authority-summary">{computedResult.secondaryCTA}</p>
                </div>
              </div>

              <form className="lead-form" onSubmit={handleLeadSubmit}>
                <div className="form-grid">
                  <label className="form-field">
                    <span>Name</span>
                    <input value={name} onChange={(event) => setName(event.target.value)} type="text" autoComplete="name" />
                  </label>
                  <label className="form-field">
                    <span>Email</span>
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>

                <div className="form-meta">
                  <p className="authority-summary">The first report email goes out after you submit the email address.</p>
                  <p className="authority-summary">UTM source: {utm.utmSource || "not set"}</p>
                </div>

                {error ? <p className="form-error">{error}</p> : null}

                <button className="form-submit" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Sending report" : "Send the report"}
                </button>
              </form>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
