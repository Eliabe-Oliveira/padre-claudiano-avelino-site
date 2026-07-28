import { describe, expect, it } from "vitest";
import {
  buildReflectionEmailShareUrl,
  buildReflectionPath,
  excludeFeaturedFromListing,
  selectPublishedRelatedVideo,
  selectRelatedPublishedReflections,
} from "../../src/lib/reflections";
import {
  makeReflection,
  makeVideo,
  TEST_NOW,
} from "../fixtures/content/entries";

describe("rotas de reflexões", () => {
  it("constrói path canônico com barra final", () => {
    expect(buildReflectionPath("reflexao-valida")).toBe(
      "/reflexoes/reflexao-valida/",
    );
  });

  it("não normaliza slug automaticamente", () => {
    expect(() => buildReflectionPath("Reflexão Inválida")).toThrow(
      /Slug de reflexão inválido/,
    );
  });
});

describe("compartilhamento de reflexão", () => {
  it("codifica assunto e título acentuado sem destinatário", () => {
    const url = buildReflectionEmailShareUrl("Oração e escuta");
    expect(url).toBe(
      "mailto:?subject=Ora%C3%A7%C3%A3o%20e%20escuta&body=Ora%C3%A7%C3%A3o%20e%20escuta",
    );
    expect(url.startsWith("mailto:?")).toBe(true);
  });

  it("codifica a URL no corpo", () => {
    const url = buildReflectionEmailShareUrl(
      "Título",
      "https://example.com/reflexoes/titulo/",
    );
    expect(url).toContain(
      "body=T%C3%ADtulo%0Ahttps%3A%2F%2Fexample.com%2Freflexoes%2Ftitulo%2F",
    );
  });
});

describe("listagem de reflexões", () => {
  it("exclui o destaque sem alterar ordem ou array original", () => {
    const featured = makeReflection({ featured: true }, "destaque");
    const first = makeReflection({}, "primeira");
    const second = makeReflection({}, "segunda");
    const source = [featured, first, second];

    expect(excludeFeaturedFromListing(source, featured)).toEqual([
      first,
      second,
    ]);
    expect(source).toEqual([featured, first, second]);
  });
});

describe("reflexões relacionadas explícitas", () => {
  const published = makeReflection({}, "publicada");
  const draft = makeReflection({ status: "draft" }, "rascunho");
  const future = makeReflection(
    { publishedAt: new Date("2026-07-25T00:00:00.000Z") },
    "futura",
  );

  it("preserva a ordem cadastrada e exclui draft e data futura", () => {
    const source = makeReflection(
      {
        relatedReflections: [
          { collection: "reflections", id: "publicada" },
          { collection: "reflections", id: "rascunho" },
          { collection: "reflections", id: "futura" },
        ],
      },
      "origem",
    );
    expect(
      selectRelatedPublishedReflections(source, [future, draft, published], {
        now: TEST_NOW,
      }),
    ).toEqual([published]);
  });

  it("exclui a própria reflexão e remove duplicações", () => {
    const source = makeReflection(
      {
        relatedReflections: [
          { collection: "reflections", id: "origem" },
          { collection: "reflections", id: "publicada" },
          { collection: "reflections", id: "publicada" },
        ],
      },
      "origem",
    );
    expect(
      selectRelatedPublishedReflections(source, [source, published], {
        now: TEST_NOW,
      }),
    ).toEqual([published]);
  });

  it("limita a três e retorna vazio sem relações públicas", () => {
    const entries = ["um", "dois", "tres", "quatro"].map((id) =>
      makeReflection({}, id),
    );
    const source = makeReflection(
      {
        relatedReflections: entries.map(({ id }) => ({
          collection: "reflections",
          id,
        })),
      },
      "origem",
    );
    expect(
      selectRelatedPublishedReflections(source, entries, {
        now: TEST_NOW,
      }).map(({ id }) => id),
    ).toEqual(["um", "dois", "tres"]);
    expect(
      selectRelatedPublishedReflections(
        makeReflection({ relatedReflections: [] }, "sem-relacoes"),
        entries,
        { now: TEST_NOW },
      ),
    ).toEqual([]);
  });
});

describe("vídeo relacionado publicado", () => {
  const reference = { collection: "videos", id: "video" };

  it("retorna vídeo publicado", () => {
    const video = makeVideo({}, "video");
    expect(
      selectPublishedRelatedVideo(reference, [video], { now: TEST_NOW }),
    ).toBe(video);
  });

  it("exclui draft, data futura e vídeo não referenciado", () => {
    expect(
      selectPublishedRelatedVideo(
        reference,
        [makeVideo({ status: "draft" }, "video")],
        { now: TEST_NOW },
      ),
    ).toBeUndefined();
    expect(
      selectPublishedRelatedVideo(
        reference,
        [
          makeVideo(
            { publishedAt: new Date("2026-07-25T00:00:00.000Z") },
            "video",
          ),
        ],
        { now: TEST_NOW },
      ),
    ).toBeUndefined();
    expect(
      selectPublishedRelatedVideo(reference, [makeVideo({}, "outro")], {
        now: TEST_NOW,
      }),
    ).toBeUndefined();
  });

  it("retorna undefined sem referência", () => {
    expect(
      selectPublishedRelatedVideo(undefined, [makeVideo({}, "video")], {
        now: TEST_NOW,
      }),
    ).toBeUndefined();
  });
});
