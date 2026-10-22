import type { ReactNode } from "react";
import { SiteDocument, siteMetadata } from "@/components/site-document";
export const metadata = siteMetadata;
export default function SiteLayout({children}: {children: ReactNode}) {
  return <SiteDocument>{children}</SiteDocument>;
}
