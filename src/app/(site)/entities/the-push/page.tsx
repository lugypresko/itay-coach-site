import type { Metadata } from "next";
import { BrandPage } from "@/components/brand-page";
const page = {
  "title": "The Push: Coaching & Advisory for Engineering Leaders",
  "heading": "Leadership support for the responsibility you carry now.",
  "path": "/entities/the-push",
  "sections": [
    {
      "heading": "",
      "body": "The Push is a 12-week 1:1 coaching and advisory engagement for technical leaders working through one live leadership challenge. Start with one manager. Expand later if there is a reason to do so."
    },
    {
      "heading": "When it fits",
      "body": "Your role has expanded. Leading through others has become harder. Pressure is increasing, and the same decisions or escalations keep returning to you."
    },
    {
      "heading": "How we work",
      "body": "Six private sessions, held every two weeks. We examine a real situation, challenge the first explanation, choose a manageable action and learn from what happens between sessions. The work adapts to your situation; it is not a fixed leadership curriculum."
    },
    {
      "heading": "What you work toward",
      "body": "A clearer understanding of what requires your involvement, where others need more context or authority, and which leadership moves are worth trying next. Progress is explored through real work—not a leadership score."
    },
    {
      "heading": "For the organization funding the engagement",
      "body": "You are investing in support for one manager. The engagement is not a performance assessment or a reporting service for their employer. Any sponsor involvement or information sharing must be explicitly agreed with the participant."
    },
    {
      "heading": "For the manager",
      "body": "Bring situations you actually need to handle. You do not need a polished explanation or a diagnosis of yourself. We start with what happened and work from there."
    },
    {
      "heading": "When it may not fit",
      "body": "If the main issue requires staffing, technical training, a formal performance process or a change in organizational authority, coaching alone may not be the right response."
    },
    {
      "heading": "Sponsor link",
      "body": "Discuss support for a manager → `/contact`"
    }
  ]
};
export const metadata: Metadata = {title:page.title,description:page.sections[0]?.body,alternates:{canonical:page.path},robots:{index:true,follow:true},openGraph:{title:page.title,description:page.sections[0]?.body,url:page.path,type:"website"}};
export default function Page(){return <BrandPage page={page}></BrandPage>}
