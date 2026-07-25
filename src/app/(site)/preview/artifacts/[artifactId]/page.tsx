import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReaderFacingArtifactPage } from "@/components/reader-facing-artifact-page";
import { engineeringManagerCoachReaderFacingArtifact } from "@/lib/authority-launch-pages";
import { draft05ReaderFacingArtifact } from "@/seed/draft-05-reader-facing-page-artifact";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ArtifactPreview({ params }: { params: Promise<{ artifactId: string }> }) {
  const { artifactId } = await params;
  if (process.env.NODE_ENV === "production") notFound();
  if (artifactId === draft05ReaderFacingArtifact.artifactId) {
    return <ReaderFacingArtifactPage artifact={draft05ReaderFacingArtifact} />;
  }
  if (artifactId === engineeringManagerCoachReaderFacingArtifact.artifactId) {
    return <ReaderFacingArtifactPage artifact={engineeringManagerCoachReaderFacingArtifact} />;
  }
  notFound();
}
