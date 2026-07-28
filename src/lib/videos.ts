import {
  selectPublishedReflections,
  type ContentReference,
  type EntryLike,
  type PublishedOptions,
  type ReflectionDataLike,
} from "./validation";

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export type YouTubeThumbnailQuality =
  "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault";

interface YouTubeEmbedOptions {
  autoplay?: boolean;
  playsinline?: boolean;
  rel?: boolean;
}

function assertValidYouTubeId(id: string): void {
  if (!isValidYouTubeId(id)) {
    throw new Error(`ID do YouTube inválido: "${id}".`);
  }
}

export function isValidYouTubeId(id: string): boolean {
  return YOUTUBE_ID_PATTERN.test(id);
}

export function buildYouTubeEmbedUrl(
  id: string,
  options: YouTubeEmbedOptions = {},
): string {
  assertValidYouTubeId(id);

  const { autoplay = false, playsinline = true, rel = false } = options;
  const url = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
  url.searchParams.set("autoplay", autoplay ? "1" : "0");
  url.searchParams.set("playsinline", playsinline ? "1" : "0");
  url.searchParams.set("rel", rel ? "1" : "0");
  return url.toString();
}

export function buildYouTubeWatchUrl(id: string): string {
  assertValidYouTubeId(id);
  const url = new URL("https://www.youtube.com/watch");
  url.searchParams.set("v", id);
  return url.toString();
}

export function buildYouTubeThumbnailUrl(
  id: string,
  quality: YouTubeThumbnailQuality = "hqdefault",
): string {
  assertValidYouTubeId(id);
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
}

export function excludeFeaturedVideoFromListing<
  TEntry extends EntryLike<{ featured: boolean }>,
>(entries: readonly TEntry[], featured?: TEntry): TEntry[] {
  return entries.filter((entry) => entry.id !== featured?.id);
}

export function selectPublishedRelatedReflection<
  TEntry extends EntryLike<ReflectionDataLike>,
>(
  reference: ContentReference | undefined,
  candidates: readonly TEntry[],
  options: PublishedOptions = {},
): TEntry | undefined {
  if (!reference) return undefined;
  return selectPublishedReflections(candidates, options).find(
    (entry) => entry.id === reference.id,
  );
}

export const PLAYER_STATES = [
  "idle",
  "loading",
  "playing",
  "error",
  "unavailable",
] as const;
export type PlayerState = (typeof PLAYER_STATES)[number];
export type PlayerEvent = "request" | "loaded" | "failed" | "blocked" | "reset";

export function transitionPlayerState(
  state: PlayerState,
  event: PlayerEvent,
): PlayerState {
  if (event === "reset") return "idle";
  if (state === "idle" && event === "request") return "loading";
  if (state === "loading" && event === "loaded") return "playing";
  if (state === "loading" && event === "failed") return "error";
  if (state === "loading" && event === "blocked") return "unavailable";
  return state;
}
