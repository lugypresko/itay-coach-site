import type { ReactNode } from "react";
import { SiteDocument, siteMetadata } from "@/components/site-document";
export const metadata = siteMetadata;
export default function HebrewLayout({children}: {children: ReactNode}) {
  return <SiteDocument lang="he">{children}</SiteDocument>;
}
