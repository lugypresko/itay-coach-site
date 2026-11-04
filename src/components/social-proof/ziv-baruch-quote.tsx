import { ZIV_BARUCH_QUOTE } from "@/lib/social-proof";

export function ZivBaruchQuote({
  className,
  layout = "stacked",
}: {
  className?: string;
  layout?: "stacked" | "inline";
}) {
  if (layout === "inline") {
    return (
      <p className={className} data-trust-variant={ZIV_BARUCH_QUOTE.variant}>
        “{ZIV_BARUCH_QUOTE.text}” <span>— {ZIV_BARUCH_QUOTE.attribution}</span>
      </p>
    );
  }
  return (
    <blockquote className={className} data-trust-variant={ZIV_BARUCH_QUOTE.variant}>
      “{ZIV_BARUCH_QUOTE.text}”
      <small>{ZIV_BARUCH_QUOTE.attribution}</small>
    </blockquote>
  );
}
