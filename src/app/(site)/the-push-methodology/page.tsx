import type { Metadata } from "next";
import { BrandPage } from "@/components/brand-page";
const page = {
  "title": "The Push Methodology: See, Challenge, Move, Read, Adjust",
  "heading": "Work with what happens. Learn from what changes.",
  "path": "/the-push-methodology",
  "sections": [
    {
      "heading": "",
      "body": "The Push methodology is a working loop for real leadership situations. We use it to separate events from assumptions, choose a practical move and learn from the response. The five steps repeat throughout the work; they are not five sessions."
    },
    {
      "heading": "SEE — See the situation and the system.",
      "body": "What happened? Who was involved? What came back to you? Separate observable events from the story about why they happened."
    },
    {
      "heading": "CHALLENGE — Test the first explanation.",
      "body": "What are we assuming? What else could explain this? Challenge the assumption without deciding in advance that it must be wrong."
    },
    {
      "heading": "MOVE — Choose a real leadership move.",
      "body": "Change one action, boundary or conversation. Define what you expect to happen and keep the risk proportionate. Prefer a reversible experiment where possible."
    },
    {
      "heading": "READ — Notice the response.",
      "body": "How did people and the system respond? Compare what happened with what you expected. A good outcome alone does not prove the explanation was right."
    },
    {
      "heading": "ADJUST — Decide what comes next.",
      "body": "Keep, change or stop the move. Use what you learned to choose the next action."
    },
    {
      "heading": "Boundary",
      "body": "Sometimes your involvement is necessary. The purpose is to understand where it creates value and where a different arrangement could work better."
    },
    {
      "heading": "Illustrative example — not a client case",
      "body": "A release decision returns to the engineering manager. SEE the actual decision and escalation. CHALLENGE whether the issue is capability or an unclear risk boundary. MOVE by agreeing a boundary for the next comparable decision. READ whether the team decides, seeks context or still asks permission. ADJUST the boundary or support based on what happened."
    }
  ]
};
export const metadata: Metadata = {title:page.title,description:page.sections[0].body,alternates:{canonical:page.path},robots:{index:true,follow:true},openGraph:{title:page.title,description:page.sections[0].body,url:page.path,type:"website"}};
export default function Page(){return <BrandPage page={page}/>}
