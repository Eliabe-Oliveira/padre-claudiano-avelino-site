import { AUTHOR_NAME, VIDEO_SERIES_NAME } from "../../../src/config/editorial";
import type {
  EntryLike,
  ReflectionDataLike,
  VideoDataLike,
} from "../../../src/lib/validation";

export const TEST_NOW = new Date("2026-07-24T12:00:00.000Z");

export function makeReflection(
  overrides: Partial<ReflectionDataLike> = {},
  id = "fixture-reflexao-valida",
): EntryLike<ReflectionDataLike> {
  return {
    id,
    data: {
      slug: id,
      status: "published",
      publishedAt: new Date("2026-07-20T12:00:00.000Z"),
      featured: false,
      author: AUTHOR_NAME,
      relatedReflections: [],
      ...overrides,
    },
  };
}

export function makeVideo(
  overrides: Partial<VideoDataLike> = {},
  id = "fixture-video-valido",
): EntryLike<VideoDataLike> {
  return {
    id,
    data: {
      id,
      status: "published",
      publishedAt: new Date("2026-07-20T12:00:00.000Z"),
      featured: false,
      series: VIDEO_SERIES_NAME,
      ...overrides,
    },
  };
}

// ID sintaticamente válido usado apenas por testes; não representa vídeo real.
export const SYNTACTIC_YOUTUBE_ID = "AbCdEf12_-3";
