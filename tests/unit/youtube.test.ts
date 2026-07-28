import { describe, expect, it } from "vitest";
import {
  buildYouTubeEmbedUrl,
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
  isValidYouTubeId,
} from "../../src/lib/videos";
import { SYNTACTIC_YOUTUBE_ID } from "../fixtures/content/entries";

describe("URLs e IDs do YouTube", () => {
  it("aceita ID sintaticamente válido", () => {
    expect(isValidYouTubeId(SYNTACTIC_YOUTUBE_ID)).toBe(true);
  });

  it.each(["curto", "id com espaco", "12345678901!"])(
    "rejeita ID inválido %s",
    (id) => {
      expect(isValidYouTubeId(id)).toBe(false);
    },
  );

  it("usa youtube-nocookie e opções privadas por padrão", () => {
    const url = new URL(buildYouTubeEmbedUrl(SYNTACTIC_YOUTUBE_ID));
    expect(url.hostname).toBe("www.youtube-nocookie.com");
    expect(url.searchParams.get("autoplay")).toBe("0");
    expect(url.searchParams.get("playsinline")).toBe("1");
    expect(url.searchParams.get("rel")).toBe("0");
  });

  it("aplica opções explícitas de embed", () => {
    const url = new URL(
      buildYouTubeEmbedUrl(SYNTACTIC_YOUTUBE_ID, {
        autoplay: true,
        playsinline: false,
        rel: true,
      }),
    );
    expect(url.searchParams.get("autoplay")).toBe("1");
    expect(url.searchParams.get("playsinline")).toBe("0");
    expect(url.searchParams.get("rel")).toBe("1");
  });

  it("constrói watch URL", () => {
    expect(buildYouTubeWatchUrl(SYNTACTIC_YOUTUBE_ID)).toBe(
      `https://www.youtube.com/watch?v=${SYNTACTIC_YOUTUBE_ID}`,
    );
  });

  it("constrói thumbnail URL", () => {
    expect(buildYouTubeThumbnailUrl(SYNTACTIC_YOUTUBE_ID)).toBe(
      `https://i.ytimg.com/vi/${SYNTACTIC_YOUTUBE_ID}/hqdefault.jpg`,
    );
    expect(
      buildYouTubeThumbnailUrl(SYNTACTIC_YOUTUBE_ID, "maxresdefault"),
    ).toBe(`https://i.ytimg.com/vi/${SYNTACTIC_YOUTUBE_ID}/maxresdefault.jpg`);
  });

  it("recusa construir URL com ID inválido", () => {
    expect(() => buildYouTubeEmbedUrl("invalido")).toThrow(
      "ID do YouTube inválido",
    );
  });
});
