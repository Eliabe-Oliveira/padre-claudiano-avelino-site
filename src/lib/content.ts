import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import {
  assertNoContentIntegrityProblems,
  collectContentIntegrityProblems,
  selectFeaturedEntry,
  selectPublishedReflections,
  selectPublishedVideos,
  type ContentReference,
  type PublishedOptions,
} from "./validation";

const reflectionSourceFiles = import.meta.glob("../data/reflections/**/*.md");
const videoSourceFiles = import.meta.glob("../data/videos/**/*.{yaml,yml}");

export async function getAllReflections(): Promise<
  CollectionEntry<"reflections">[]
> {
  if (Object.keys(reflectionSourceFiles).length === 0) return [];
  return getCollection("reflections");
}

export async function getPublishedReflections(
  options: PublishedOptions = {},
): Promise<CollectionEntry<"reflections">[]> {
  return selectPublishedReflections(await getAllReflections(), options);
}

export async function getFeaturedReflection(
  options: PublishedOptions = {},
): Promise<CollectionEntry<"reflections"> | undefined> {
  return selectFeaturedEntry(
    await getPublishedReflections(options),
    "reflections publicadas",
  );
}

export async function getAllVideos(): Promise<CollectionEntry<"videos">[]> {
  if (Object.keys(videoSourceFiles).length === 0) return [];
  return getCollection("videos");
}

export async function getPublishedVideos(
  options: PublishedOptions = {},
): Promise<CollectionEntry<"videos">[]> {
  return selectPublishedVideos(await getAllVideos(), options);
}

export async function getFeaturedVideo(
  options: PublishedOptions = {},
): Promise<CollectionEntry<"videos"> | undefined> {
  return selectFeaturedEntry(
    await getPublishedVideos(options),
    "videos publicados",
  );
}

async function resolveReference(
  sourceCollection: "reflections" | "videos",
  sourceId: string,
  field: string,
  referenceValue: ContentReference,
): Promise<string | undefined> {
  const resolved = await getEntry(
    referenceValue as
      | { collection: "reflections"; id: string }
      | { collection: "videos"; id: string },
  );

  if (resolved) return undefined;

  return `${sourceCollection}/${sourceId}: ${field} referencia ${referenceValue.collection}/${referenceValue.id}, mas a resolução retornou undefined.`;
}

export async function assertContentIntegrity(): Promise<void> {
  const [reflections, videos] = await Promise.all([
    getAllReflections(),
    getAllVideos(),
  ]);
  const problems = collectContentIntegrityProblems(reflections, videos);

  for (const reflection of reflections) {
    if (reflection.data.relatedVideo) {
      const problem = await resolveReference(
        "reflections",
        reflection.id,
        "relatedVideo",
        reflection.data.relatedVideo,
      );
      if (problem) problems.push(problem);
    }

    for (const relatedReflection of reflection.data.relatedReflections) {
      const problem = await resolveReference(
        "reflections",
        reflection.id,
        "relatedReflections",
        relatedReflection,
      );
      if (problem) problems.push(problem);
    }
  }

  for (const video of videos) {
    if (video.data.relatedReflection) {
      const problem = await resolveReference(
        "videos",
        video.id,
        "relatedReflection",
        video.data.relatedReflection,
      );
      if (problem) problems.push(problem);
    }
  }

  assertNoContentIntegrityProblems([...new Set(problems)]);
}
