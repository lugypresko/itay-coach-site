export type MarkdownLinkPart =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

export function splitMarkdownLinks(value: string): MarkdownLinkPart[] {
  const parts: MarkdownLinkPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  markdownLinkPattern.lastIndex = 0;

  while ((match = markdownLinkPattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", text: value.slice(lastIndex, match.index) });
    }

    parts.push({ type: "link", text: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < value.length) {
    parts.push({ type: "text", text: value.slice(lastIndex) });
  }

  return parts.length ? parts : [{ type: "text", text: value }];
}

export function stripMarkdownLinks(value: string): string {
  return value
    .replace(markdownLinkPattern, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
