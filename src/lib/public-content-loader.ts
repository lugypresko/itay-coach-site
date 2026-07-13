import type { PublicContentPageModel, PublicContentSection } from "./public-content";
import {
  getPublicContentSectionSpec,
  getStaticPublicContentCatalogEntry,
  isRenderablePublicContent,
} from "./public-content";
import { getServerPayload } from "./payload";
import { buildPublicContentSurfaceEntry } from "./publication-surface-projection";

interface PublicContentPayloadReader {
  find(args: Record<string, unknown>): Promise<{ docs: unknown[] }>;
}

interface PublicContentLoaderOptions {
  payload?: unknown;
  allowStaticFallback?: boolean;
}

export async function loadPublishedPublicContent(
  section: PublicContentSection,
  slug: string,
  origin: string,
  options: PublicContentLoaderOptions = {},
): Promise<PublicContentPageModel | null> {
  const spec = getPublicContentSectionSpec(section);
  if (!spec) {
    return null;
  }

  try {
    const payload = (options.payload ?? (await getServerPayload())) as PublicContentPayloadReader;
    const result = await payload.find({
      collection: spec.collectionSlug as never,
      limit: 1,
      overrideAccess: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    } as never);

    const record = result.docs[0] as unknown as Record<string, unknown> | undefined;

    if (!record || !isRenderablePublicContent(record)) {
      return loadStaticFallback(section, slug, origin, options.allowStaticFallback);
    }

    return buildPublicContentSurfaceEntry({ spec, record, origin }).publicContentPage ?? null;
  } catch {
    return loadStaticFallback(section, slug, origin, options.allowStaticFallback);
  }

  return null;
}

function loadStaticFallback(
  section: PublicContentSection,
  slug: string,
  origin: string,
  allowStaticFallback = process.env.NODE_ENV !== "production",
): PublicContentPageModel | null {
  if (!allowStaticFallback) {
    return null;
  }

  const spec = getPublicContentSectionSpec(section);
  const fallback = getStaticPublicContentCatalogEntry(section, slug);

  if (!spec || !fallback || !isRenderablePublicContent(fallback)) {
    return null;
  }

  return buildPublicContentSurfaceEntry({ spec, record: fallback, origin, trustStaticApproval: true }).publicContentPage ?? null;
}
