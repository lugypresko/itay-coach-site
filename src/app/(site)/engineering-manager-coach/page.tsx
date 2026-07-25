import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReaderFacingArtifactPage } from "@/components/reader-facing-artifact-page";
import {
  buildAuthorityLaunchMetadata,
  engineeringManagerCoachReaderFacingArtifact,
  getAuthorityLaunchPage,
} from "@/lib/authority-launch-pages";

const page = getAuthorityLaunchPage("engineeringManagerCoach");

export const metadata: Metadata = buildAuthorityLaunchMetadata(page);

export default function EngineeringManagerCoachPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ReaderFacingArtifactPage artifact={engineeringManagerCoachReaderFacingArtifact} />;
}
