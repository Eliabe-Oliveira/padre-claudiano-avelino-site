import { isValidSlug } from "./slugs";
import {
  selectPublishedReflections,
  selectPublishedVideos,
  type ContentReference,
  type EntryLike,
  type PublishedOptions,
  type ReflectionDataLike,
  type VideoDataLike,
} from "./validation";

export function buildReflectionPath(slug: string): string {
  if (!isValidSlug(slug)) {
    throw new Error("Slug de reflexão inválido.");
  }
  return `/reflexoes/${slug}/`;
}

export function buildReflectionEmailShareUrl(
  title: string,
  url?: string,
): string {
  const body = url ? `${title}\n${url}` : title;
  return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export function excludeFeaturedFromListing<
  TEntry extends EntryLike<{ featured: boolean }>,
>(entries: readonly TEntry[], featured?: TEntry): TEntry[] {
  return entries.filter((entry) => entry.id !== featured?.id);
}

export function selectRelatedPublishedReflections<
  TEntry extends EntryLike<ReflectionDataLike>,
>(
  reflection: TEntry,
  candidates: readonly TEntry[],
  options: PublishedOptions = {},
): TEntry[] {
  const publishedById = new Map(
    selectPublishedReflections(candidates, options).map((entry) => [
      entry.id,
      entry,
    ]),
  );
  const selected: TEntry[] = [];
  const seen = new Set<string>([reflection.id]);

  for (const reference of reflection.data.relatedReflections) {
    if (seen.has(reference.id)) continue;
    seen.add(reference.id);
    const related = publishedById.get(reference.id);
    if (related) selected.push(related);
    if (selected.length === 3) break;
  }

  return selected;
}

export function selectPublishedRelatedVideo<
  TEntry extends EntryLike<VideoDataLike>,
>(
  reference: ContentReference | undefined,
  candidates: readonly TEntry[],
  options: PublishedOptions = {},
): TEntry | undefined {
  if (!reference) return undefined;
  return selectPublishedVideos(candidates, options).find(
    (entry) => entry.id === reference.id,
  );
}
