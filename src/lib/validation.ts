import {
  AUTHOR_NAME,
  VIDEO_SERIES_NAME,
  type ContentStatus,
} from "../config/editorial";
import { isFutureDate } from "./dates";

export interface ContentReference {
  collection: string;
  id: string;
}

export interface ReflectionDataLike {
  slug: string;
  status: ContentStatus;
  publishedAt: Date;
  updatedAt?: Date;
  featured: boolean;
  author: string;
  relatedVideo?: ContentReference;
  relatedReflections: ContentReference[];
}

export interface VideoDataLike {
  id: string;
  status: ContentStatus;
  publishedAt?: Date;
  featured: boolean;
  series: string;
  sortOrder?: number;
  relatedReflection?: ContentReference;
}

export interface EntryLike<TData> {
  id: string;
  data: TData;
}

export interface PublishedOptions {
  now?: Date;
}

function findDuplicateIds(references: ContentReference[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const reference of references) {
    if (seen.has(reference.id)) duplicates.add(reference.id);
    seen.add(reference.id);
  }

  return [...duplicates];
}

export function selectPublishedReflections<
  TEntry extends EntryLike<ReflectionDataLike>,
>(entries: readonly TEntry[], options: PublishedOptions = {}): TEntry[] {
  const now = options.now ?? new Date();

  return entries
    .filter(
      (entry) =>
        entry.data.status === "published" &&
        !isFutureDate(entry.data.publishedAt, now),
    )
    .slice()
    .sort(
      (left, right) =>
        right.data.publishedAt.getTime() - left.data.publishedAt.getTime(),
    );
}

export function selectPublishedVideos<TEntry extends EntryLike<VideoDataLike>>(
  entries: readonly TEntry[],
  options: PublishedOptions = {},
): TEntry[] {
  const now = options.now ?? new Date();

  return entries
    .filter(
      (entry) =>
        entry.data.status === "published" &&
        entry.data.publishedAt !== undefined &&
        !isFutureDate(entry.data.publishedAt, now),
    )
    .slice()
    .sort((left, right) => {
      const leftOrder = left.data.sortOrder;
      const rightOrder = right.data.sortOrder;

      if (leftOrder !== undefined || rightOrder !== undefined) {
        if (leftOrder === undefined) return 1;
        if (rightOrder === undefined) return -1;
        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      }

      return (
        right.data.publishedAt!.getTime() - left.data.publishedAt!.getTime()
      );
    });
}

export function selectFeaturedEntry<
  TEntry extends EntryLike<{ featured: boolean }>,
>(entries: readonly TEntry[], label: string): TEntry | undefined {
  const featured = entries.filter((entry) => entry.data.featured);

  if (featured.length > 1) {
    throw new Error(`Mais de um destaque encontrado em ${label}.`);
  }

  return featured[0];
}

export function collectContentIntegrityProblems(
  reflections: readonly EntryLike<ReflectionDataLike>[],
  videos: readonly EntryLike<VideoDataLike>[],
  now: Date = new Date(),
): string[] {
  const problems: string[] = [];
  const reflectionIds = new Set(reflections.map((entry) => entry.id));
  const videoIds = new Set(videos.map((entry) => entry.id));

  const featuredReflections = reflections.filter(
    (entry) => entry.data.featured,
  );
  if (featuredReflections.length > 1) {
    problems.push(
      `reflections: mais de uma entrada featured (${featuredReflections.map((entry) => entry.id).join(", ")}).`,
    );
  }

  const featuredVideos = videos.filter((entry) => entry.data.featured);
  if (featuredVideos.length > 1) {
    problems.push(
      `videos: mais de uma entrada featured (${featuredVideos.map((entry) => entry.id).join(", ")}).`,
    );
  }

  for (const entry of reflections) {
    const { data } = entry;

    if (data.status === "published" && isFutureDate(data.publishedAt, now)) {
      problems.push(`reflections/${entry.id}: publishedAt está no futuro.`);
    }
    if (data.updatedAt && data.updatedAt < data.publishedAt) {
      problems.push(
        `reflections/${entry.id}: updatedAt é anterior a publishedAt.`,
      );
    }
    if (data.slug !== entry.id) {
      problems.push(
        `reflections/${entry.id}: data.slug "${data.slug}" difere de entry.id.`,
      );
    }
    if (data.author !== AUTHOR_NAME) {
      problems.push(
        `reflections/${entry.id}: author deve ser "${AUTHOR_NAME}".`,
      );
    }

    const duplicateIds = findDuplicateIds(data.relatedReflections);
    for (const duplicateId of duplicateIds) {
      problems.push(
        `reflections/${entry.id}: relatedReflections contém a referência duplicada "${duplicateId}".`,
      );
    }

    for (const reference of data.relatedReflections) {
      if (reference.id === entry.id) {
        problems.push(
          `reflections/${entry.id}: relatedReflections não pode apontar para a própria entrada.`,
        );
      }
      if (!reflectionIds.has(reference.id)) {
        problems.push(
          `reflections/${entry.id}: relatedReflections referencia reflections/${reference.id}, que não existe.`,
        );
      }
    }
    if (data.relatedVideo && !videoIds.has(data.relatedVideo.id)) {
      problems.push(
        `reflections/${entry.id}: relatedVideo referencia videos/${data.relatedVideo.id}, que não existe.`,
      );
    }
  }

  for (const entry of videos) {
    const { data } = entry;

    if (data.id !== entry.id) {
      problems.push(
        `videos/${entry.id}: data.id "${data.id}" difere de entry.id.`,
      );
    }
    if (data.series !== VIDEO_SERIES_NAME) {
      problems.push(
        `videos/${entry.id}: series deve ser "${VIDEO_SERIES_NAME}".`,
      );
    }
    if (data.status === "published" && !data.publishedAt) {
      problems.push(`videos/${entry.id}: vídeos published exigem publishedAt.`);
    }
    if (
      data.status === "published" &&
      data.publishedAt &&
      isFutureDate(data.publishedAt, now)
    ) {
      problems.push(`videos/${entry.id}: publishedAt está no futuro.`);
    }
    if (
      data.relatedReflection &&
      !reflectionIds.has(data.relatedReflection.id)
    ) {
      problems.push(
        `videos/${entry.id}: relatedReflection referencia reflections/${data.relatedReflection.id}, que não existe.`,
      );
    }
  }

  return problems;
}

export function assertNoContentIntegrityProblems(
  problems: readonly string[],
): void {
  if (problems.length === 0) return;

  throw new Error(
    `Falha na integridade do conteúdo:\n${problems
      .map((problem, index) => `${index + 1}. ${problem}`)
      .join("\n")}`,
  );
}
