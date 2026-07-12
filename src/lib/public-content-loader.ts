import type { PublicContentPageModel, PublicContentSection } from "./public-content";
import {
  buildPublicContentPageModel,
  getPublicContentSectionSpec,
  getStaticPublicContentCatalogEntry,
  isRenderablePublicContent,
} from "./public-content";
import { getServerPayload } from "./payload";

export async function loadPublishedPublicContent(section: PublicContentSection, slug: string, origin: string): Promise<PublicContentPageModel | null> {
  const spec = getPublicContentSectionSpec(section);
  if (!spec) {
    return null;
  }

  try {
    const payload = await getServerPayload();
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
      const fallback = getStaticPublicContentCatalogEntry(section, slug);

      if (fallback && isRenderablePublicContent(fallback)) {
        return buildPublicContentPageModel({
          spec,
          record: fallback,
          origin,
        });
      }

      return null;
    }

    return buildPublicContentPageModel({
      spec,
      record,
      origin,
    });
  } catch {
    const fallback = getStaticPublicContentCatalogEntry(section, slug);

    if (fallback && isRenderablePublicContent(fallback)) {
      return buildPublicContentPageModel({
        spec,
        record: fallback,
        origin,
      });
    }
  }

  const fallback = getStaticPublicContentCatalogEntry(section, slug);

  if (fallback && isRenderablePublicContent(fallback)) {
    return buildPublicContentPageModel({
      spec,
      record: fallback,
      origin,
    });
  }

  return null;
}
