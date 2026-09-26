import type { Metadata } from "next";
import { BrandPage } from "@/components/brand-page";
import { ConversationRequest } from "@/components/conversation-request";
const page = {
  "title": "Let’s talk about the situation you want to change.",
  "heading": "Let’s talk about the situation you want to change.",
  "path": "/contact",
  "sections": [
    {
      "heading": "",
      "body": "You may be exploring support for yourself or funding an engagement for a manager. Tell me what changed and what you want help with. There is no need to include sensitive details about another person."
    }
  ]
};
export const metadata: Metadata = {title:page.title,description:page.sections[0]?.body,alternates:{canonical:page.path},robots:{index:true,follow:true},openGraph:{title:page.title,description:page.sections[0]?.body,url:page.path,type:"website"}};
export default function Page(){return <BrandPage page={page}><ConversationRequest /></BrandPage>}
