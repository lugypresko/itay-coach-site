import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const stylesDir = join(process.cwd(), "src", "styles");
const publicStyleFiles = [
  "tokens.css",
  "base.css",
  "typography.css",
  "layout.css",
  "components.css",
];

function readPublicCss(): string {
  return publicStyleFiles
    .map((file) => readFileSync(join(stylesDir, file), "utf8"))
    .join("\n");
}

function stripCssComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

describe("authority design system", () => {
  it("keeps public CSS free of animation and visual-effect declarations", () => {
    const css = stripCssComments(readPublicCss());

    expect(css).not.toMatch(
      /\b(animation|transition|box-shadow|text-shadow|filter|backdrop-filter|mix-blend-mode|background-image)\s*:/i,
    );
    expect(css).not.toMatch(/(?:^|[;{}])\s*transform\s*:/i);
    expect(css).not.toMatch(/@(keyframes|property)\b/i);
  });

  it("uses mobile-first long-form readability tokens without negative tracking", () => {
    const css = stripCssComments(readPublicCss());

    expect(css).toContain("--text-base:  1.0625rem");
    expect(css).toContain("--leading-normal: 1.65");
    expect(css).toContain("--width-prose:    65ch");
    expect(css).toMatch(/@media\s*\(\s*min-width:\s*640px\s*\)/);
    expect(css).not.toMatch(/letter-spacing\s*:\s*-/i);
    expect(css).not.toMatch(/--tracking-[\w-]+\s*:\s*-/i);
  });
});
