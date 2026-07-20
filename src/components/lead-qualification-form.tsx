"use client";

import { useState } from "react";

type FormState = {
  name: string;
  workEmail: string;
  role: string;
  company: string;
  supportIntent: "self" | "managers" | "leadership_layer";
  challenge: string;
  timing: string;
  managerCount: string;
  teamCount: string;
  sponsorRole: string;
  initiativeStatus: string;
  website: string;
};

const initialState: FormState = {
  name: "",
  workEmail: "",
  role: "",
  company: "",
  supportIntent: "self",
  challenge: "",
  timing: "",
  managerCount: "",
  teamCount: "",
  sponsorRole: "",
  initiativeStatus: "",
  website: "",
};

export function LeadQualificationForm({ defaultIntent = "self" }: { defaultIntent?: FormState["supportIntent"] }) {
  const [form, setForm] = useState({ ...initialState, supportIntent: defaultIntent });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const isSponsor = form.supportIntent !== "self";

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const attribution = Object.fromEntries(new URLSearchParams(window.location.search));
    try {
    const response = await fetch("/api/fit-call/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, attribution }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "Please try again.");
      return;
    }
    setStatus("sent");
    setMessage("Your request is in. The next step is a short fit conversation.");
    } catch {
      setStatus("error");
      setMessage("We could not send the request. Please try again.");
    }
  }

  return (
    <form className="lead-form content-panel" onSubmit={submit}>
      <h2>Start with the context</h2>
      <div className="form-grid">
        {(["name", "workEmail", "role", "company"] as const).map((field) => (
          <label className="form-field" key={field}>
            <span>{field === "workEmail" ? "Work email" : field[0].toUpperCase() + field.slice(1)}</span>
            <input type={field === "workEmail" ? "email" : "text"} required value={form[field]} onChange={(event) => update(field, event.target.value)} />
          </label>
        ))}
      </div>
      <label className="form-field"><span>Are you exploring support for</span><select value={form.supportIntent} onChange={(event) => update("supportIntent", event.target.value)}><option value="self">Myself</option><option value="managers">Managers in my organization</option><option value="leadership_layer">A leadership layer or program</option></select></label>
      {isSponsor ? <div className="form-grid"><label className="form-field"><span>Manager count</span><input value={form.managerCount} onChange={(event) => update("managerCount", event.target.value)} /></label><label className="form-field"><span>Team count</span><input value={form.teamCount} onChange={(event) => update("teamCount", event.target.value)} /></label><label className="form-field"><span>Your sponsor role</span><input value={form.sponsorRole} onChange={(event) => update("sponsorRole", event.target.value)} /></label><label className="form-field"><span>Initiative status</span><input value={form.initiativeStatus} onChange={(event) => update("initiativeStatus", event.target.value)} placeholder="Exploring, active, or scheduled" /></label></div> : null}
      <label className="form-field form-field--trap" aria-hidden="true"><span>Website</span><input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} /></label>
      <label className="form-field"><span>What is the leadership problem?</span><textarea required rows={4} value={form.challenge} onChange={(event) => update("challenge", event.target.value)} /></label>
      <label className="form-field"><span>Timing</span><input required value={form.timing} onChange={(event) => update("timing", event.target.value)} placeholder="This month, this quarter, exploring" /></label>
      {message ? <p className={status === "error" ? "form-error" : "authority-summary"}>{message}</p> : null}
      <button className="form-submit" type="submit" disabled={status === "sending" || status === "sent"}>{status === "sending" ? "Sending..." : status === "sent" ? "Request sent" : "Request a fit conversation"}</button>
    </form>
  );
}
