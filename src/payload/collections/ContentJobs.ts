import { buildContentJobCollection } from "./content";

export const ContentJobs = buildContentJobCollection(
  "content-jobs",
  "Content Job",
  "Content Jobs",
  "Planned content jobs that generation agents may execute after review gates pass.",
);
