import { describe, expect, it } from "vitest";
import {
  assertNoContentIntegrityProblems,
  collectContentIntegrityProblems,
} from "../../src/lib/validation";
import {
  makeReflection,
  makeVideo,
  TEST_NOW,
} from "../fixtures/content/entries";

describe("integridade global", () => {
  it("aceita coleções vazias", () => {
    expect(collectContentIntegrityProblems([], [], TEST_NOW)).toEqual([]);
  });

  it("acumula vários erros em uma única validação", () => {
    const problems = collectContentIntegrityProblems(
      [
        makeReflection({
          author: "Autor de fixture inválido",
          publishedAt: new Date("2026-08-01T00:00:00.000Z"),
        }),
      ],
      [makeVideo({ series: "Série de fixture inválida" })],
      TEST_NOW,
    );

    expect(problems.length).toBeGreaterThanOrEqual(3);
    expect(() => assertNoContentIntegrityProblems(problems)).toThrow(
      /1\..*\n2\./s,
    );
  });

  it("detecta referência inexistente", () => {
    const problems = collectContentIntegrityProblems(
      [
        makeReflection({
          relatedVideo: {
            collection: "videos",
            id: "fixture-video-inexistente",
          },
        }),
      ],
      [],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("que não existe");
  });

  it("retorna zero problemas para configuração válida", () => {
    const reflection = makeReflection(
      {
        relatedVideo: {
          collection: "videos",
          id: "fixture-video-valido",
        },
      },
      "fixture-reflexao-valida",
    );
    const video = makeVideo(
      {
        relatedReflection: {
          collection: "reflections",
          id: "fixture-reflexao-valida",
        },
      },
      "fixture-video-valido",
    );

    expect(
      collectContentIntegrityProblems([reflection], [video], TEST_NOW),
    ).toEqual([]);
  });
});
