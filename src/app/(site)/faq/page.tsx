import type { Metadata } from "next";
import { BrandPage } from "@/components/brand-page";
const page = {
  "title": "Questions about working together",
  "heading": "Questions about working together",
  "path": "/faq",
  "sections": [
    {
      "heading": "Who is The Push for?",
      "body": "Technical leaders facing broader responsibility, difficulty leading through others or growing pressure. We begin with a real situation to understand whether the engagement fits."
    },
    {
      "heading": "Can my organization pay?",
      "body": "Yes. An organization can fund an engagement for one manager. You can also fund your own engagement."
    },
    {
      "heading": "Does the person funding it receive reports about me?",
      "body": "The Push is not a performance assessment or an employer reporting service. Funding does not itself authorize sharing session content. Any information sharing or sponsor involvement must be explicitly agreed with you."
    },
    {
      "heading": "Is this coaching or advisory?",
      "body": "Both. We work through your thinking and choices, and use practical advice where it helps. The balance follows the situation rather than a fixed curriculum."
    },
    {
      "heading": "What happens over 12 weeks?",
      "body": "Six private sessions, held every two weeks, with real leadership moves to try between them. SEE → CHALLENGE → MOVE → READ → ADJUST is the working loop throughout."
    },
    {
      "heading": "Do I need to provide contact details to receive a diagnosis?",
      "body": "No. Contact is optional. If you choose to request a conversation, we ask for the details needed to respond."
    },
    {
      "heading": "Will this make my team independent?",
      "body": "That is not a guaranteed outcome. We examine what creates dependence and test changes within your influence. Some constraints require organizational decisions beyond the engagement."
    },
    {
      "heading": "Can we expand to more managers?",
      "body": "We can discuss additional individual engagements after starting with one. Expansion is not automatic and does not turn private sessions into an organizational monitoring program."
    },
    {
      "heading": "What does it cost?",
      "body": "Contact Itay to discuss the engagement and receive a proposal."
    }
  ]
};
export const metadata: Metadata = {title:page.title,description:page.sections[0].body,alternates:{canonical:page.path},robots:{index:true,follow:true},openGraph:{title:page.title,description:page.sections[0].body,url:page.path,type:"website"}};
export default function Page(){return <BrandPage page={page} faq/>}
