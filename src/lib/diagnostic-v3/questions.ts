export const questions = [
  {
    id: "situation",
    title: "Which situation is closest to the one you want to examine?",
    options: [
      ["decision", "A decision keeps coming back to me"],
      ["review", "People are waiting for my review or approval"],
      ["dependency", "A cross-team dependency needs me to unblock it"],
      ["stall", "Work keeps stalling until I get involved"],
      ["meeting", "I keep getting pulled into meetings to move it forward"],
      ["other", "Something else"],
    ],
  },
  {
    id: "absence",
    title: "If you didn’t step in, what would most likely happen?",
    options: [
      ["wait", "The work would wait"],
      ["discuss", "People would keep discussing without deciding"],
      ["escalate", "Someone would escalate it back to me"],
      ["distrust", "The work would move, but I don’t fully trust the outcome"],
      ["handles", "The manager would probably handle it"],
      ["unsure", "I’m not sure"],
    ],
  },
  {
    id: "owner",
    title:
      "Who currently feels responsible for getting this to the next meaningful milestone?",
    helper:
      "This is not about job titles. Who feels accountable when the work stops?",
    options: [
      ["me", "I do"],
      ["manager", "One manager clearly owns it"],
      ["pieces", "Several people own different pieces"],
      ["formal", "Ownership is formally assigned but doesn’t feel real"],
      ["unclear", "Ownership is unclear"],
    ],
  },
  {
    id: "authority",
    title:
      "Could the manager closest to this work make the next important decision without you?",
    options: [
      ["normally", "Yes, and they normally would"],
      ["checks", "Yes, but they would probably check with me first"],
      ["limited", "Only within limited boundaries"],
      ["mine", "No, this decision effectively belongs to me"],
      ["unsure", "I’m not sure"],
    ],
  },
  {
    id: "duration",
    title: "How long has this pattern been happening?",
    options: [
      ["first", "This is the first time"],
      ["weeks", "A few weeks"],
      ["months", "1–3 months"],
      ["long", "More than 3 months"],
      ["system", "It has become part of how we operate"],
    ],
  },
  {
    id: "attempts",
    title: "What have you already tried?",
    multi: true,
    options: [
      ["owner", "Clarified who owns it"],
      ["decide", "Told the manager to decide without me"],
      ["process", "Changed a process or meeting cadence"],
      ["escalated", "Escalated the issue"],
      ["reviews", "Added more checkpoints / reviews"],
      ["conversation", "Had a direct conversation with the manager"],
      ["nothing", "Nothing yet"],
      ["other", "Something else"],
    ],
  },
  {
    id: "impact",
    title: "If nothing changes over the next 3 months, what gets affected?",
    multi: true,
    options: [
      ["delivery", "Delivery / roadmap"],
      ["time", "My own time"],
      ["development", "Manager development"],
      ["cross", "Cross-team execution"],
      ["customer", "Customer commitments"],
      ["confidence", "Team confidence / accountability"],
      ["strategy", "Strategic work I’m not getting to"],
      ["little", "Probably not much"],
      ["other", "Something else"],
    ],
  },
  {
    id: "desired",
    title: "If this stopped coming back to you, what would change?",
    options: [
      ["own", "My managers would own more"],
      ["faster", "Important work would move faster"],
      ["escalations", "I’d spend less time on escalations"],
      ["cross", "Cross-team work would move without me"],
      ["strategy", "I’d have more time for strategy and technology"],
      ["trust", "I’d trust the organization to handle more without me"],
      ["other", "Something else"],
    ],
  },
  {
    id: "context",
    title: "Give me the real version.",
    helper: "One or two sentences are enough. What is actually happening?",
    options: [],
  },
] as const;
export const frequencies = [
  ["several", "Several times a week"],
  ["weekly", "About once a week"],
  ["monthly", "A few times a month"],
  ["occasionally", "Occasionally"],
] as const;
export const roles = [
  ["cto", "CTO"],
  ["vp", "VP R&D or Engineering"],
  ["head_director", "Head or Director of Engineering"],
  ["group", "Group Manager"],
  ["em", "Engineering Manager"],
  ["other", "Other"],
] as const;
export const sizes = [
  ["under20", "<20"],
  ["20_50", "20–50"],
  ["51_100", "51–100"],
  ["101_250", "101–250"],
  ["251plus", "251+"],
] as const;
export function label(id: string, value: string): string {
  return (
    questions
      .find((q) => q.id === id)
      ?.options.find((o) => o[0] === value)?.[1] ??
    frequencies.find((o) => o[0] === value)?.[1] ??
    value
  );
}
