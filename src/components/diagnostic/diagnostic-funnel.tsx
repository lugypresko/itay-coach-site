"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { buildDeterministicDiagnosticResult } from "@/lib/diagnostic-funnel/deterministic-result";
import { getDiagnosticQuestions, type DiagnosticQuestion } from "@/lib/diagnostic-funnel/questions";
import type { DiagnosticAnswers, DiagnosticCaseType, DiagnosticResult } from "@/lib/diagnostic-funnel/types";

type DiagnosticFunnelProps = { initialCaseType?: DiagnosticCaseType };

function optionLabel(question: DiagnosticQuestion, value: string): string {
  return question.options.find((option) => option.value === value)?.label ?? value;
}

export function DiagnosticFunnel({ initialCaseType = "other" }: DiagnosticFunnelProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({ caseType: initialCaseType });
  const [context, setContext] = useState("");
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const questions = useMemo(() => getDiagnosticQuestions(answers.caseType ?? initialCaseType), [answers.caseType, initialCaseType]);
  const question = questions[questionIndex];

  async function post(path: string, body: Record<string, unknown>) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "Unable to save this step.");
    return payload as { session?: { id: string } };
  }

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const payload = await post("/api/diagnostic/session", { source: { entryPoint: "diagnostic" } });
      setSessionId(payload.session?.id ?? null);
      setStarted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start the diagnostic.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAndContinue(value: string) {
    if (!question || !sessionId) return;
    const nextAnswers: DiagnosticAnswers = { ...answers };
    if (question.id === "Q1") nextAnswers.caseType = value as DiagnosticCaseType;
    if (question.id === "Q2") nextAnswers.caseEvent = optionLabel(question, value);
    if (question.id === "Q3") nextAnswers.selfExplanation = optionLabel(question, value);
    if (question.id === "Q4") nextAnswers.absenceOutcome = optionLabel(question, value);
    if (question.id === "Q5") {
      nextAnswers.frequency = value as DiagnosticAnswers["frequency"];
      if (context.trim()) nextAnswers.context = context.trim();
    }

    setBusy(true);
    setError(null);
    try {
      await post("/api/diagnostic/answer", { sessionId, answers: nextAnswers });
      setAnswers(nextAnswers);
      if (questionIndex < questions.length - 1) {
        setQuestionIndex((index) => index + 1);
        return;
      }
      const generated = buildDeterministicDiagnosticResult(nextAnswers);
      await post("/api/diagnostic/result", { sessionId, result: generated });
      setResult(generated);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save this answer.");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <section className="content-panel diagnostic-result" aria-labelledby="diagnostic-result-title" data-testid="diagnostic-result">
        <p className="eyebrow">Your working read</p>
        <h2 id="diagnostic-result-title">{result.observedPattern}</h2>
        <p><strong>Working hypothesis:</strong> {result.hypothesis.explanation}</p>
        <p><strong>Evidence against:</strong> {result.evidenceAgainst[0]}</p>
        <p><strong>Reversible experiment:</strong> {result.experiment.action}</p>
        <p><strong>Next step:</strong> {result.experiment.observation}</p>
        <div className="content-actions">
          <Link className="primary-link" href="/book-a-fit-call">Discuss this case</Link>
          <button className="secondary-link" type="button" onClick={() => setResult(null)}>Review answers</button>
        </div>
      </section>
    );
  }

  if (!started) {
    return (
      <section className="content-panel" aria-labelledby="diagnostic-start-title" data-testid="diagnostic-start">
        <p className="eyebrow">5 questions · no email required</p>
        <h2 id="diagnostic-start-title">Bring one real case.</h2>
        <p>We will examine what keeps returning to you, then give you a working hypothesis and one reversible experiment.</p>
        <button className="primary-link" type="button" onClick={start} disabled={busy}>{busy ? "Starting…" : "Start the diagnostic"}</button>
        {error ? <p role="alert">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="content-panel" aria-labelledby="diagnostic-question-title" data-testid="diagnostic-question">
      <p className="eyebrow">Question {question.order} of {questions.length}</p>
      <h2 id="diagnostic-question-title">{question.copy}</h2>
      <div className="content-actions" role="group" aria-label={question.copy}>
        {question.options.map((option) => (
          <button className="secondary-link" type="button" key={option.value} onClick={() => saveAndContinue(option.value)} disabled={busy}>
            {option.label}
          </button>
        ))}
      </div>
      {question.optionalContext ? (
        <label>
          <span>{question.optionalContext.copy}</span>
          <input value={context} maxLength={question.optionalContext.maxLength} onChange={(event) => setContext(event.target.value)} />
        </label>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
