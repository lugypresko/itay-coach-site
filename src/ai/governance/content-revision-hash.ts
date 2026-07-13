import { createHash } from "node:crypto";

export interface ContentRevisionInput {
  title: string;
  canonicalPath: string;
  content: string;
}

/** Task 069 approval serialization. Changing this invalidates existing approvals. */
export function createContentRevisionHash({ title, canonicalPath, content }: ContentRevisionInput): string {
  const revision = JSON.stringify({
    title: title.trim(),
    canonicalPath,
    content: content.replace(/\r\n/g, "\n").trim(),
  });

  return createHash("sha256").update(revision, "utf8").digest("hex");
}
