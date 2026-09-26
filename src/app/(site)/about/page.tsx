import type { Metadata } from "next";
import { BrandPage } from "@/components/brand-page";
const page = {
  "title": "I have worked inside the problems I now help leaders navigate.",
  "heading": "I have worked inside the problems I now help leaders navigate.",
  "path": "/about",
  "sections": [
    {
      "heading": "",
      "body": "I’m Itay Foyerstein. My background spans 25+ years across technology, product, delivery and organizational change, alongside 1,000+ coaching hours."
    },
    {
      "heading": "Experience",
      "body": "I have worked with leaders and teams at organizations including ServiceNow, Amdocs, Taboola, Claroty, EY and 888."
    },
    {
      "heading": "How my experience shapes the work",
      "body": "That experience shapes how I work: we look at the person and the system around them. A leadership challenge may involve judgment, authority, context, capability or risk. We examine the situation before choosing the response."
    },
    {
      "heading": "What to expect",
      "body": "Expect practical questions, room to challenge the first explanation, and a next move grounded in the work you actually do."
    }
  ]
};
export const metadata: Metadata = {title:page.title,description:page.sections[0]?.body,alternates:{canonical:page.path},robots:{index:true,follow:true},openGraph:{title:page.title,description:page.sections[0]?.body,url:page.path,type:"website"}};
export default function Page(){return <BrandPage page={page}></BrandPage>}
