"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  questions,
  frequencies,
  roles,
  sizes,
} from "@/lib/diagnostic-v3/questions";
import type {
  Answers,
  Identity,
  Qualification,
} from "@/lib/diagnostic-v3/contracts";
import {
  MAX_MULTI_SELECT,
  shouldAutoAdvance,
  toggleMultiAnswer,
} from "@/lib/diagnostic-v3/ui-state";
import type { publicSession } from "@/lib/diagnostic-v3/service";
import "./diagnostic-v3.css";
type View = ReturnType<typeof publicSession>;
const endpoint = "/api/diagnostic/v3";

function AnalysisProgress({ mode }: { mode: "first" | "full" }) {
  return (
    <div className="v3-analysis-progress" role="status" aria-live="polite">
      <span className="v3-analysis-progress__spinner" aria-hidden="true" />
      <h2>{mode === "first" ? "Reading your answers…" : "Looking for the pattern…"}</h2>
      <p>
        {mode === "first"
          ? "Looking for the pattern and preparing your next move."
          : "Preparing your next move from the full read."}
      </p>
      <ol aria-label="Analysis steps">
        <li>Reading your answers</li>
        <li>Looking for the pattern</li>
        <li>Preparing your next move</li>
      </ol>
    </div>
  );
}

export function DiagnosticV3({ previewUx = false }: { previewUx?: boolean } = {}) {
  const [session, setSession] = useState<View | null>(null),
    [answers, setAnswers] = useState<Answers>({}),
    [step, setStep] = useState(0),
    [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(true),
    [answerSaving, setAnswerSaving] = useState(false),
    [error, setError] = useState(""),
    [loaded, setLoaded] = useState(false),
    [qualify, setQualify] = useState(true);
  const [analysisMode, setAnalysisMode] = useState<"first" | "full" | null>(null);
  const [identity, setIdentity] = useState<Identity>({
      first_name: "",
      email: "",
      company: "",
    }),
    [role, setRole] = useState(""),
    [size, setSize] = useState("");
  const lock = useRef(false);
  const answersRef = useRef<Answers>({});
  const stepRef = useRef(0);
  const persistedSessionRef = useRef<View | null>(null);
  const answerWriteQueue = useRef<Promise<View | null>>(Promise.resolve(null));
  const answerWriteCount = useRef(0);
  const answerWriteEpoch = useRef(0);
  const telemetryQueue = useRef<Promise<void>>(Promise.resolve());
  const heading = useRef<HTMLHeadingElement>(null);
  function accept(s: View | null) {
    setSession(s);
    if (s) {
      persistedSessionRef.current = s;
      answersRef.current = s.answers;
      stepRef.current = s.step;
      setAnswers(s.answers);
      setStep(s.step);
      setQualify(!s.qualification_skipped);
    }
  }
  useEffect(() => {
    let active = true;
    fetch(endpoint, { cache: "no-store" })
      .then(async (r) => {
        const b = await r.json();
        if (!r.ok) throw new Error(b.error);
        if (active) accept(b.session);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) {
          setBusy(false);
          setLoaded(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (loaded) heading.current?.focus();
  }, [step, session?.stage, loaded]);
  async function send(
    action: string,
    extra: Record<string, unknown> = {},
  ): Promise<View | null> {
    if (lock.current) return null;
    lock.current = true;
    setBusy(true);
    setError("");
    let responseReceived = false;
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          event_id: crypto.randomUUID(),
          expected_version: session?.record_version,
          ...extra,
        }),
      });
      responseReceived = true;
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      accept(b.session);
      return b.session;
    } catch (e) {
      if (!responseReceived && ["start", "answers", "partial", "identify", "qualification", "booking_click", "summary"].includes(action))
        reportTelemetry("interaction_error", { action_code: "network" });
      setError(e instanceof Error ? e.message : "Please try again.");
      return null;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function reportTelemetry(
    eventType: "role_selected" | "org_size_selected" | "interaction_error",
    extra: { action_code?: string } = {},
  ) {
    if (!session) return Promise.resolve();
    const payload = { action: "telemetry", event_type: eventType, event_id: crypto.randomUUID(), ...extra };
    telemetryQueue.current = telemetryQueue.current.then(async () => {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }).catch(() => {});
    return telemetryQueue.current;
  }
  function persistAnswersInBackground(
    answerSnapshot: Answers,
    nextStep: number,
    completedStep?: number,
    navigation?: { direction: "previous" | "next"; from: number; to: number; event_id: string },
  ): Promise<View | null> {
    const epoch = answerWriteEpoch.current;
    answerWriteCount.current += 1;
    setAnswerSaving(true);
    const task = answerWriteQueue.current
      .then(async () => {
        if (epoch !== answerWriteEpoch.current) return null;
        const base = persistedSessionRef.current;
        if (!base) throw new Error("Your saved case is not ready yet.");
        let responseReceived = false;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "answers",
            event_id: crypto.randomUUID(),
            expected_version: base.record_version,
            answers: answerSnapshot,
            step: nextStep,
            completed_step: completedStep,
            navigation,
          }),
        });
        responseReceived = true;
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        const saved = body.session as View;
        persistedSessionRef.current = saved;
        setSession(saved);
        return saved;
      })
      .catch((cause: unknown) => {
        if (cause instanceof TypeError) reportTelemetry("interaction_error", { action_code: "answers" });
        if (epoch === answerWriteEpoch.current) {
          answerWriteEpoch.current += 1;
          const saved = persistedSessionRef.current;
          if (saved) {
            answersRef.current = saved.answers;
            stepRef.current = saved.step;
            setAnswers(saved.answers);
            setStep(saved.step);
          }
          setError(
            cause instanceof Error
              ? cause.message
              : "We could not save this answer. Please retry.",
          );
        }
        return null;
      })
      .finally(() => {
        answerWriteCount.current -= 1;
        setAnswerSaving(answerWriteCount.current > 0);
      });
    answerWriteQueue.current = task;
    return task;
  }
  function select(key: keyof Answers, value: string, multi = false) {
    if (!previewUx) {
      setAnswers((current) => {
        if (!multi) return { ...current, [key]: value };
        const old = (current[key] as string[] | undefined) ?? [];
        const exclusive = key === "attempts" ? "nothing" : "little";
        return {
          ...current,
          [key]: value === exclusive
            ? [value]
            : old.includes(value)
              ? old.filter((item) => item !== value)
              : [...old.filter((item) => item !== exclusive), value],
        };
      });
      return;
    }
    const currentStep = stepRef.current;
    const currentAnswers = answersRef.current;
    const nextAnswers = multi && (key === "attempts" || key === "impact")
      ? toggleMultiAnswer(currentAnswers, key, value)
      : { ...currentAnswers, [key]: value };
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    setError("");

    // Q9 is free text: persist it with the final submit immediately before analysis.
    if (currentStep === 8) return;

    const shouldAdvance = !multi && shouldAutoAdvance(currentStep, nextAnswers);
    const nextStep = shouldAdvance ? Math.min(8, currentStep + 1) : currentStep;
    if (shouldAdvance) {
      stepRef.current = nextStep;
      setStep(nextStep);
    }
    void persistAnswersInBackground(
      nextAnswers,
      nextStep,
      shouldAdvance ? currentStep + 1 : undefined,
      shouldAdvance ? { direction: "next", from: currentStep, to: nextStep, event_id: crypto.randomUUID() } : undefined,
    );
  }
  const reportedView = useRef("");
  useEffect(() => {
    if (!session || busy || answerSaving) return;
    const key = `${session.answer_revision}:${session.stage}:${step}`;
    if (reportedView.current === key) return;
    reportedView.current = key;
    // Acknowledge a committed rendered screen; provider completion is not a view.
    void fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view", stage: session.stage, answer_revision: session.answer_revision, step }) }).catch(() => { reportedView.current = ""; });
  }, [session, busy, answerSaving, step]);
  const question = questions[step];
  const valid =
    step === 8 ||
    (Boolean(answers[question.id]) &&
      (!Array.isArray(answers[question.id]) ||
        (answers[question.id] as string[]).length > 0) &&
      (step !== 4 || Boolean(answers.frequency)));
  const isQuestions = session && (session.stage === "answering" || editing);
  async function navigate(next: number, analyze = false) {
    if (!previewUx) {
      const saved = await send("answers", {
        answers,
        step: next,
        completed_step: next >= step ? step + 1 : undefined,
      });
      if (!saved) return;
      if (analyze) {
        setEditing(false);
        await analyzePartial(saved);
      }
      return;
    }
    const currentStep = stepRef.current;
    stepRef.current = next;
    setStep(next);
    void persistAnswersInBackground(
      answersRef.current,
      next,
      next > currentStep ? currentStep + 1 : undefined,
      next !== currentStep ? { direction: next > currentStep ? "next" : "previous", from: currentStep, to: next, event_id: crypto.randomUUID() } : undefined,
    );
  }
  async function analyzePartial(savedSession?: View) {
    if (lock.current) return;
    if (!previewUx) {
      const saved = savedSession ?? session;
      if (!saved) return;
      lock.current = true;
      setBusy(true);
      setError("");
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "partial", expected_version: saved.record_version }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        accept(body.session);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Please retry.");
      } finally {
        lock.current = false;
        setBusy(false);
      }
      return;
    }
    setEditing(false);
    setAnalysisMode("first");
    setError("");
    const saved = await persistAnswersInBackground(answersRef.current, 8, 9);
    if (!saved) {
      setAnalysisMode(null);
      return;
    }
    lock.current = true;
    setBusy(true);
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "partial",
          expected_version: saved.record_version,
        }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      accept(b.session);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please retry.");
    } finally {
      lock.current = false;
      setBusy(false);
      setAnalysisMode(null);
    }
  }
  async function identify() {
    if (previewUx) setAnalysisMode("full");
    await send("identify", { identity });
    if (previewUx) setAnalysisMode(null);
  }
  const p = session?.partial,
    f = session?.full;
  return (
    <section className="diagnostic-v3" aria-busy={busy || (previewUx && answerSaving) || Boolean(analysisMode)}>
      {session?.storage === "disposable_preview" && (
        <p className="v3-preview">
          QA Preview: disposable session storage. Email delivery and booking
          integrations are not being claimed as verified.
        </p>
      )}
      {session?.qa_metadata && (
        <p className="v3-preview" aria-label="Preview analysis source metadata">
          QA analysis source — First Read: {session.qa_metadata.first_read_source ?? "pending"}; Full Read: {session.qa_metadata.full_read_source ?? "pending"}.
        </p>
      )}
      {!loaded ? (
        <p role="status">Loading your private case…</p>
      ) : analysisMode ? (
        <AnalysisProgress mode={analysisMode} />
      ) : !session || session.stage === "entry" ? (
        <>
          <h2 ref={heading} tabIndex={-1}>
            What keeps pulling execution back to you?
          </h2>
          <p>
            You have capable managers and good people. Yet some decisions,
            dependencies and stalled work still find their way back to you.
          </p>
          <p>
            Bring one situation happening in your organization right now. In a
            few minutes, I’ll help you identify what may be keeping it stuck —
            and one move worth testing next.
          </p>
          <p>
            <strong>
              You’ll see your first read before I ask for your details.
            </strong>
          </p>
          <p>
            Pick something from the last two weeks. A real case works better
            than answering about your organization in general.
          </p>
          <button
            className="primary-link"
            disabled={busy}
            onClick={() => send("start")}
          >
            Diagnose one current case
          </button>
        </>
      ) : isQuestions ? (
        <>
          <p className="eyebrow">Question {step + 1} of 9</p>
          <progress aria-label="Diagnostic progress" value={step + 1} max={9} />
          <h2 ref={heading} tabIndex={-1}>
            {question.title}
          </h2>
          {"helper" in question && <p>{question.helper}</p>}
          {step !== 8 ? (
            <fieldset>
              <legend className="v3-sr">{question.title}</legend>
              <div className="v3-options">
                {question.options.map(([value, title]) => {
                  const multi = "multi" in question;
                  const selectedValues = multi
                    ? (answers[question.id] as string[] | undefined) ?? []
                    : [];
                  const selected = multi
                    ? selectedValues.includes(value)
                    : answers[question.id] === value;
                  const atMultiLimit = previewUx && multi && selectedValues.length >= MAX_MULTI_SELECT && !selected;
                  return (
                    <button
                      type="button"
                      key={value}
                      aria-pressed={Boolean(selected)}
                      disabled={busy || atMultiLimit}
                      onClick={() => select(question.id, value, multi)}
                    >
                      {title}
                    </button>
                  );
                })}
              </div>
              {previewUx && "multi" in question &&
                ((answers[question.id] as string[] | undefined)?.length ?? 0) >= MAX_MULTI_SELECT && (
                  <small className="v3-multi-limit">Choose up to 3</small>
                )}
            </fieldset>
          ) : (
            <>
              <p>
                Describe the situation without confidential names, employee or
                customer details, passwords or secrets.
              </p>
              <label>
                Your case (optional)
                <textarea
                  placeholder="Two teams have been waiting for a decision about…"
                  maxLength={1200}
                  value={answers.context ?? ""}
                  onChange={(e) => select("context", e.target.value)}
                />
              </label>
              <p>
                The more concrete the example, the more specific the read can
                be.
              </p>
            </>
          )}
          {step === 4 && (
            <fieldset>
              <legend>
                How often does something like this pull you back in?
              </legend>
              <div className="v3-options">
                {frequencies.map(([value, title]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={answers.frequency === value}
                    disabled={busy}
                    onClick={() => select("frequency", value)}
                  >
                    {title}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {(step === 5 || step === 6) && (
            <label>
              {step === 5
                ? "What happened? (optional)"
                : "What is the consequence in your case? (optional)"}
              <textarea
                maxLength={600}
                value={
                  answers[step === 5 ? "attempts_context" : "impact_context"] ??
                  ""
                }
                onChange={(e) =>
                  select(
                    step === 5 ? "attempts_context" : "impact_context",
                    e.target.value,
                  )
                }
              />
              <small>No confidential names or sensitive details.</small>
            </label>
          )}
          <div className="v3-actions">
            {step > 0 && (
              <button
                className="secondary-link"
                disabled={busy}
                onClick={() => navigate(step - 1)}
              >
                Previous
              </button>
            )}
            <button
              className="primary-link"
              disabled={busy || !valid}
              onClick={() => previewUx
                ? step === 8
                  ? void analyzePartial()
                  : void navigate(Math.min(8, step + 1))
                : void navigate(Math.min(8, step + 1), step === 8)}
            >
              {step === 8 ? "Analyze my case" : "Next"}
            </button>
          </div>
          {previewUx && answerSaving && <p className="v3-save-state" role="status">Saving your answer…</p>}
        </>
      ) : session.stage === "partial" && p ? (
        <>
          <p className="eyebrow">My first read</p>
          <h2 ref={heading} tabIndex={-1}>
            {p.teaser_insight}
          </h2>
          {p.confidence === "low" && (
            <p>I don’t have enough evidence yet to make a strong call.</p>
          )}
          <p>
            <strong>The pattern to test:</strong>{" "}
            {(f?.primary_pattern ?? p?.primary_pattern ?? "").replaceAll(
              "_",
              " ",
            )}
          </p>
          <h3>Why I think that</h3>
          <ul>
            {p.evidence.map((e, i) => (
              <li key={i}>{e.interpretation}</li>
            ))}
          </ul>
          {p.contradictions.map((c, i) => (
            <p key={i}>{c}</p>
          ))}
          <p>
            The next layer is to distinguish this explanation from the
            alternative, then choose one reversible move.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void identify();
            }}
          >
            <h3>I can take this one level deeper.</h3>
            <p>
              Get the reasoning, a question for your manager, and one practical
              experiment to try over the next 7 days.
            </p>
            {!session.identified && (
              <>
                <label>
                  First name
                  <input
                    required
                    autoComplete="given-name"
                    maxLength={80}
                    value={identity.first_name}
                    onChange={(e) =>
                      setIdentity({ ...identity, first_name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Email <small>(work email preferred)</small>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={identity.email}
                    onChange={(e) =>
                      setIdentity({ ...identity, email: e.target.value })
                    }
                  />
                </label>
                <label>
                  Company
                  <input
                    required
                    autoComplete="organization"
                    maxLength={160}
                    value={identity.company}
                    onChange={(e) =>
                      setIdentity({ ...identity, company: e.target.value })
                    }
                  />
                </label>
              </>
            )}
            <p>
              No newsletter required. No obligation to book a call.{" "}
              <Link href="/privacy">Privacy policy</Link>
            </p>
            <button className="primary-link" disabled={busy}>
              {busy
                ? "Preparing your full read…"
                : session.identified
                  ? "Update my full read"
                  : "Show me the full read"}
            </button>
          </form>
          <button
            className="secondary-link"
            disabled={busy}
            onClick={() => {
              setStep(0);
              setEditing(true);
            }}
          >
            Review all answers
          </button>
        </>
      ) : f ? (
        <>
          <p className="eyebrow">Your case, as I see it</p>
          <h2 ref={heading} tabIndex={-1}>
            What is happening
          </h2>
          <p>{f.case_summary}</p>
          {p?.confidence === "low" && (
            <p>
              I don’t have enough evidence yet to make a strong call. Treat this
              as a question to test.
            </p>
          )}
          <p>
            <strong>The pattern to test:</strong>{" "}
            {(f?.primary_pattern ?? p?.primary_pattern ?? "").replaceAll(
              "_",
              " ",
            )}
          </p>
          <h3>Why I think that</h3>
          <ul>
            {f.evidence.map((e, i) => (
              <li key={i}>{e.interpretation}</li>
            ))}
          </ul>
          <p>{f.likely_explanation}</p>
          {(p?.contradictions ?? []).map((c, i) => (
            <p key={i}>{c}</p>
          ))}
          {f.alternative_hypothesis && (
            <>
              <h3>The alternative explanation</h3>
              <p>{f.alternative_hypothesis}</p>
            </>
          )}
          <h3>Ask your manager this</h3>
          <blockquote>{f.manager_question}</blockquote>
          <section
            className="v3-experiment"
            aria-labelledby="v3-experiment-title"
          >
            <h3 id="v3-experiment-title">7-day experiment</h3>
            <dl className="v3-experiment__steps">
              <div>
                <dt>When</dt>
                <dd>{f.seven_day_experiment.trigger}</dd>
              </div>
              <div>
                <dt>Try</dt>
                <dd>{f.seven_day_experiment.action}</dd>
              </div>
              <div>
                <dt>Keep it safe</dt>
                <dd>{f.seven_day_experiment.safety_boundary}</dd>
              </div>
              <div>
                <dt>Track</dt>
                <dd>{f.seven_day_experiment.observation}</dd>
              </div>
              <div>
                <dt>Review</dt>
                <dd>{f.seven_day_experiment.review_point}</dd>
              </div>
            </dl>
          </section>
          <h3>How you’ll know whether it worked</h3>
          <p>{f.success_signal}</p>
          <p>Your desired outcome: {p?.desired_outcome}</p>
          <h3>What remains open</h3>
          <p>{f.unresolved_question}</p>
          {qualify && !session.qualification ? (
            <form
              className="v3-qualification"
              onSubmit={(e) => {
                e.preventDefault();
                void telemetryQueue.current.then(() => send("qualification", {
                  qualification: { role, org_size: size } as Qualification,
                }));
              }}
            >
              <h3>One quick check to suggest the right next step</h3>
              <p>Your full read above is yours whether or not you answer.</p>
              <div className="v3-qualification-fields">
                <label className="v3-qualification-field">
                  <span className="v3-qualification-field__title">
                    Your role
                  </span>
                  <span className="v3-qualification-field__hint">
                    Choose the role closest to your work.
                  </span>
                  <select
                    required
                    value={role}
                    onChange={(e) => { setRole(e.target.value); reportTelemetry("role_selected"); }}
                  >
                    <option value="">Choose your role</option>
                    {roles.map(([v, t]) => (
                      <option key={v} value={v}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="v3-qualification-field">
                  <span className="v3-qualification-field__title">
                    Engineering org size
                  </span>
                  <span className="v3-qualification-field__hint">
                    Approximate size of the engineering organization.
                  </span>
                  <select
                    required
                    value={size}
                    onChange={(e) => { setSize(e.target.value); reportTelemetry("org_size_selected"); }}
                  >
                    <option value="">Choose size</option>
                    {sizes.map(([v, t]) => (
                      <option key={v} value={v}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="v3-actions">
                <button className="primary-link" disabled={busy}>
                  Suggest my next step
                </button>
                <button
                  className="secondary-link"
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    const s = await send("qualification", { skip: true });
                    if (s) setQualify(false);
                  }}
                >
                  Skip for now
                </button>
              </div>
            </form>
          ) : (
            <div className="v3-route">
              {session.route === "conversation" ||
              session.route === "conversation_override" ? (
                <>
                  <h3>I think this is worth looking at together.</h3>
                  {session.booking_url ? (
                    <a
                      className="primary-link"
                      href={session.booking_url}
                      onClick={(e) => {
                        e.preventDefault();
                        send("booking_click").then((s) => {
                          if (s?.booking_url)
                            window.location.assign(s.booking_url);
                        });
                      }}
                    >
                      Book 20-minute case review
                    </a>
                  ) : (
                    <p>
                      Scheduling is not configured in this Preview. Your case
                      and next question are saved for review.
                    </p>
                  )}
                </>
              ) : session.route === "self_service" ? (
                <>
                  <h3>I don’t think you need a conversation with me yet.</h3>
                  <p>
                    Try this experiment first. Come back if the same pattern
                    continues after you test it.
                  </p>
                </>
              ) : (
                <>
                  <h3>Try this for 7 days</h3>
                  <p>
                    Use the experiment above and record what happens. You can
                    return to this case.
                  </p>
                </>
              )}
              <button
                className="secondary-link"
                disabled={
                  busy ||
                  session.mail === "sent" ||
                  session.mail === "simulated"
                }
                onClick={() => send("summary")}
              >
                {session.route === "self_service"
                  ? "Email me the experiment"
                  : "Send me the written read first"}
              </button>
            </div>
          )}
          {session.mail === "simulated" && (
            <p role="status">
              Preview only: email delivery was simulated. No email was sent.
            </p>
          )}
          {session.mail === "sent" && (
            <p role="status">Your written read was sent.</p>
          )}
          {session.mail === "failed" && (
            <p role="alert">
              Email could not be sent. Your read is still available here; please
              retry.
            </p>
          )}
          <div className="v3-actions">
            <button
              className="secondary-link"
              disabled={busy}
              onClick={() => {
                setStep(0);
                setEditing(true);
              }}
            >
              Review all answers
            </button>
            <button className="secondary-link" onClick={() => window.print()}>
              Save / print my read
            </button>
            {session.qualification && (
              <button
                className="secondary-link"
                disabled={busy}
                onClick={async () => {
                  await send("qualification", { skip: true });
                  setQualify(true);
                }}
              >
                Update role or org size
              </button>
            )}
          </div>
        </>
      ) : (
        <button
          className="primary-link"
          disabled={busy}
          onClick={() => session && analyzePartial(session)}
        >
          Retry analysis
        </button>
      )}
      {busy && loaded && !analysisMode && <p role="status">Working on your case…</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button
            className="secondary-link"
            onClick={() => window.location.reload()}
          >
            Reload saved case
          </button>
        </div>
      )}
      {session && (
        <p className="v3-foot">
          Private diagnostic · v3 ·{" "}
          <button
            disabled={busy}
            onClick={() => {
              if (
                window.confirm(
                  "Delete this saved diagnostic and its contact details?",
                )
              )
                send("delete");
            }}
          >
            Delete my case
          </button>
        </p>
      )}
    </section>
  );
}
