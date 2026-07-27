import { describe, expect, it } from "vitest";
import {
  collectContentIntegrityProblems,
  selectPublishedVideos,
} from "../../src/lib/validation";
import { makeVideo, TEST_NOW } from "../fixtures/content/entries";

describe("seleção e integridade de vídeos", () => {
  it("exclui draft", () => {
    expect(
      selectPublishedVideos([makeVideo({ status: "draft" })], {
        now: TEST_NOW,
      }),
    ).toEqual([]);
  });

  it("inclui published", () => {
    const entry = makeVideo();
    expect(selectPublishedVideos([entry], { now: TEST_NOW })).toEqual([entry]);
  });

  it("detecta published sem data", () => {
    const problems = collectContentIntegrityProblems(
      [],
      [makeVideo({ publishedAt: undefined })],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("published exigem publishedAt");
  });

  it("detecta múltiplos destaques", () => {
    const problems = collectContentIntegrityProblems(
      [],
      [
        makeVideo({ featured: true }, "fixture-video-um"),
        makeVideo({ featured: true }, "fixture-video-dois"),
      ],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("mais de uma entrada featured");
  });

  it("detecta série inválida", () => {
    const problems = collectContentIntegrityProblems(
      [],
      [makeVideo({ series: "Série de fixture inválida" })],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("series deve ser");
  });

  it("detecta data.id diferente do entry.id", () => {
    const problems = collectContentIntegrityProblems(
      [],
      [makeVideo({ id: "fixture-id-divergente" })],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("difere de entry.id");
  });

  it("prioriza sortOrder e depois data", () => {
    const laterOrder = makeVideo({ sortOrder: 2 }, "fixture-ordem-dois");
    const firstOrder = makeVideo(
      {
        sortOrder: 1,
        publishedAt: new Date("2026-07-01T00:00:00.000Z"),
      },
      "fixture-ordem-um",
    );

    expect(
      selectPublishedVideos([laterOrder, firstOrder], {
        now: TEST_NOW,
      }).map((entry) => entry.id),
    ).toEqual(["fixture-ordem-um", "fixture-ordem-dois"]);
  });

  it("ordena por data quando sortOrder não existe", () => {
    const older = makeVideo(
      { publishedAt: new Date("2026-07-01T00:00:00.000Z") },
      "fixture-video-antigo",
    );
    const newer = makeVideo(
      { publishedAt: new Date("2026-07-20T00:00:00.000Z") },
      "fixture-video-recente",
    );

    expect(
      selectPublishedVideos([older, newer], { now: TEST_NOW }).map(
        (entry) => entry.id,
      ),
    ).toEqual(["fixture-video-recente", "fixture-video-antigo"]);
  });
});
