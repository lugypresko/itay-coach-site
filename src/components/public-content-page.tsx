import React from "react";
import Link from "next/link";

import { TargetPageAnalytics, TargetTrackedLink } from "@/components/target-page-analytics";
import { splitMarkdownLinks } from "@/lib/markdown-links";
import type { ReaderFacingPublicContentPage } from "@/lib/reader-facing-publication";

type PublicContentPageProps = {
  page: ReaderFacingPublicContentPage;
};

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

type ContentSection = {
  heading?: string;
  blocks: ContentBlock[];
};

const labeledSectionPattern =
  /^(Definition|Framework explanation|Specific symptoms|Uncomfortable truth|Target questions|Citation-worthy snippet):\s*(.+)$/i;

function labelTitle(rawTitle: string): string {
  const normalized = rawTitle.toLowerCase();
  if (normalized === "citation-worthy snippet") return "Citation-worthy snippet";
  return normalized.replace(/^\w/, (char) => char.toUpperCase());
}

function parseChunk(chunk: string): Array<{ type: "heading"; text: string } | ContentBlock | { type: "labeled"; title: string; body: string }> {
  const lines = chunk
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  if (lines.length === 1) {
    const heading = lines[0].match(/^(#{2,3})\s+(.+)$/);
    if (heading) return [{ type: "heading", text: heading[2].trim() }];

    const labeled = lines[0].match(labeledSectionPattern);
    if (labeled) return [{ type: "labeled", title: labelTitle(labeled[1]), body: labeled[2].trim() }];
  }

  if (/^#{2,3}\s+/.test(lines[0])) {
    const heading = lines[0].match(/^#{2,3}\s+(.+)$/);
    return [{ type: "heading", text: heading?.[1].trim() ?? lines[0] }, ...parseChunk(lines.slice(1).join("\n"))];
  }

  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    return [{ type: "list", ordered: false, items: lines.map((line) => line.replace(/^[-*]\s+/, "")) }];
  }

  if (lines.every((line) => /^\d+\.\s+/.test(line))) {
    return [{ type: "list", ordered: true, items: lines.map((line) => line.replace(/^\d+\.\s+/, "")) }];
  }

  return [{ type: "paragraph", text: lines.join(" ") }];
}

function toSections(content: string): ContentSection[] {
  const chunks = content
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  const sections: ContentSection[] = [];
  let current: ContentSection = { blocks: [] };

  const pushCurrent = () => {
    if (current.heading || current.blocks.length) sections.push(current);
    current = { blocks: [] };
  };

  for (const chunk of chunks) {
    for (const block of parseChunk(chunk)) {
      if (block.type === "heading" || block.type === "labeled") {
        pushCurrent();
        current = {
          heading: block.type === "heading" ? block.text : block.title,
          blocks: block.type === "labeled" ? [{ type: "paragraph", text: block.body }] : [],
        };
        if (block.type === "labeled") pushCurrent();
        continue;
      }

      current.blocks.push(block);
    }
  }

  pushCurrent();
  return sections;
}

function renderBold(value: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) nodes.push(value.slice(lastIndex, match.index));
    nodes.push(<strong key={`${keyPrefix}-strong-${index}`}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
    index += 1;
  }

  if (lastIndex < value.length) nodes.push(value.slice(lastIndex));
  return nodes;
}

function isSafeHref(href: string): boolean {
  return (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("https://") || href.startsWith("http://");
}

function renderInline(value: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];

  splitMarkdownLinks(value).forEach((part, index) => {
    if (part.type === "link" && isSafeHref(part.href)) {
      nodes.push(
        <Link key={`${keyPrefix}-link-${index}`} href={part.href}>
          {part.text}
        </Link>,
      );
      return;
    }

    nodes.push(...renderBold(part.text, `${keyPrefix}-text-${index}`));
  });

  return nodes;
}

export function PublicContentPage({ page }: PublicContentPageProps) {
  const sections = toSections(page.content);

  return (
    <main className="content-shell">
      <TargetPageAnalytics path={page.pathname} slug={page.slug} />
      {page.jsonLd.length ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page.jsonLd, null, 2) }} />
      ) : null}

      <header className="content-hero content-hero-split">
        <div className="content-hero-copy">
          <h1>{page.title}</h1>
          <div className="content-actions">
            <TargetTrackedLink
              className="primary-link"
              href={page.primaryCta.href}
              ctaType={page.primaryCta.ctaType}
              path={page.pathname}
              slug={page.slug}
            >
              {page.primaryCta.label}
            </TargetTrackedLink>
          </div>
        </div>
      </header>

      <section className="content-grid">
        {sections.map((section, sectionIndex) => (
          <article className="content-panel content-panel-wide" key={`${page.pathname}-section-${sectionIndex}`}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.blocks.map((block, blockIndex) => {
              if (block.type === "list") {
                const ListTag = block.ordered ? "ol" : "ul";
                return (
                  <ListTag className="content-list" key={`${page.pathname}-list-${sectionIndex}-${blockIndex}`}>
                    {block.items.map((item, itemIndex) => (
                      <li key={`${item.slice(0, 24)}-${itemIndex}`}>{renderInline(item, `${sectionIndex}-${blockIndex}-${itemIndex}`)}</li>
                    ))}
                  </ListTag>
                );
              }

              return (
                <p key={`${page.pathname}-p-${sectionIndex}-${blockIndex}`}>
                  {renderInline(block.text, `${sectionIndex}-${blockIndex}`)}
                </p>
              );
            })}
          </article>
        ))}

        {page.relatedLinks.length ? (
          <nav className="content-panel content-panel-wide" aria-label="Related pages">
            <h2>Related pages</h2>
            <div className="link-list">
              {page.relatedLinks.map((link) => (
                <Link key={`${link.href}-${link.label}`} className="link-item" href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}
      </section>
    </main>
  );
}
