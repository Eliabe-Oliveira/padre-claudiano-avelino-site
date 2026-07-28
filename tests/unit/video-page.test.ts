import { describe, expect, it } from "vitest";
import {
  excludeFeaturedVideoFromListing,
  selectPublishedRelatedReflection,
  transitionPlayerState,
} from "../../src/lib/videos";
import { selectPublishedVideos } from "../../src/lib/validation";
import {
  makeReflection,
  makeVideo,
  TEST_NOW,
} from "../fixtures/content/entries";

describe("listagem da página de vídeos", () => {
  it("exclui featured preservando ordem e array original", () => {
    const featured = makeVideo({ featured: true }, "destaque");
    const first = makeVideo({}, "primeiro");
    const second = makeVideo({}, "segundo");
    const source = [featured, first, second];
    expect(excludeFeaturedVideoFromListing(source, featured)).toEqual([
      first,
      second,
    ]);
    expect(source).toEqual([featured, first, second]);
  });

  it("aceita coleção vazia e exclui somente drafts ou futuros", () => {
    expect(excludeFeaturedVideoFromListing([])).toEqual([]);
    expect(
      selectPublishedVideos([makeVideo({ status: "draft" })], {
        now: TEST_NOW,
      }),
    ).toEqual([]);
    expect(
      selectPublishedVideos(
        [
          makeVideo({
            publishedAt: new Date("2026-07-25T00:00:00.000Z"),
          }),
        ],
        { now: TEST_NOW },
      ),
    ).toEqual([]);
  });
});

describe("reflexão relacionada ao vídeo", () => {
  const reference = { collection: "reflections", id: "reflexao" };

  it("retorna reflexão published", () => {
    const reflection = makeReflection({}, "reflexao");
    expect(
      selectPublishedRelatedReflection(reference, [reflection], {
        now: TEST_NOW,
      }),
    ).toBe(reflection);
  });

  it("exclui draft, futura e referência não pública", () => {
    expect(
      selectPublishedRelatedReflection(
        reference,
        [makeReflection({ status: "draft" }, "reflexao")],
        { now: TEST_NOW },
      ),
    ).toBeUndefined();
    expect(
      selectPublishedRelatedReflection(
        reference,
        [
          makeReflection(
            { publishedAt: new Date("2026-07-25T00:00:00.000Z") },
            "reflexao",
          ),
        ],
        { now: TEST_NOW },
      ),
    ).toBeUndefined();
    expect(
      selectPublishedRelatedReflection(
        reference,
        [makeReflection({}, "outra")],
        { now: TEST_NOW },
      ),
    ).toBeUndefined();
  });

  it("retorna undefined sem referência", () => {
    expect(
      selectPublishedRelatedReflection(
        undefined,
        [makeReflection({}, "reflexao")],
        { now: TEST_NOW },
      ),
    ).toBeUndefined();
  });
});

describe("estados da fachada do player", () => {
  it("inicia em idle e transita por loading e playing", () => {
    expect(transitionPlayerState("idle", "reset")).toBe("idle");
    const loading = transitionPlayerState("idle", "request");
    expect(loading).toBe("loading");
    expect(transitionPlayerState(loading, "loaded")).toBe("playing");
  });

  it("transita de loading para error ou unavailable", () => {
    expect(transitionPlayerState("loading", "failed")).toBe("error");
    expect(transitionPlayerState("loading", "blocked")).toBe("unavailable");
  });

  it("ignora transições inválidas", () => {
    expect(transitionPlayerState("playing", "request")).toBe("playing");
  });
});
