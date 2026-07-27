import { describe, expect, it } from "vitest";
import {
  collectContentIntegrityProblems,
  selectFeaturedEntry,
  selectPublishedReflections,
} from "../../src/lib/validation";
import { makeReflection, TEST_NOW } from "../fixtures/content/entries";

describe("seleção e integridade de reflexões", () => {
  it("exclui draft da lista pública", () => {
    const entries = [makeReflection({ status: "draft" })];
    expect(selectPublishedReflections(entries, { now: TEST_NOW })).toEqual([]);
  });

  it("inclui published com data válida", () => {
    const entry = makeReflection();
    expect(selectPublishedReflections([entry], { now: TEST_NOW })).toEqual([
      entry,
    ]);
  });

  it("exclui publicação futura defensivamente", () => {
    const entry = makeReflection({
      publishedAt: new Date("2026-07-25T00:00:00.000Z"),
    });
    expect(selectPublishedReflections([entry], { now: TEST_NOW })).toEqual([]);
  });

  it("ordena da publicação mais recente para a mais antiga sem mutar", () => {
    const older = makeReflection(
      { publishedAt: new Date("2026-07-10T00:00:00.000Z") },
      "fixture-antiga",
    );
    const newer = makeReflection(
      { publishedAt: new Date("2026-07-20T00:00:00.000Z") },
      "fixture-recente",
    );
    const source = [older, newer];

    expect(
      selectPublishedReflections(source, { now: TEST_NOW }).map(
        (entry) => entry.id,
      ),
    ).toEqual(["fixture-recente", "fixture-antiga"]);
    expect(source.map((entry) => entry.id)).toEqual([
      "fixture-antiga",
      "fixture-recente",
    ]);
  });

  it("retorna um destaque único", () => {
    const featured = makeReflection({ featured: true });
    expect(selectFeaturedEntry([featured], "reflections")).toBe(featured);
  });

  it("detecta múltiplos destaques", () => {
    const problems = collectContentIntegrityProblems(
      [
        makeReflection({ featured: true }, "fixture-um"),
        makeReflection({ featured: true }, "fixture-dois"),
      ],
      [],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("mais de uma entrada featured");
  });

  it("detecta autor inválido", () => {
    const problems = collectContentIntegrityProblems(
      [makeReflection({ author: "Autor de fixture inválido" })],
      [],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("author deve ser");
  });

  it("detecta updatedAt anterior", () => {
    const problems = collectContentIntegrityProblems(
      [
        makeReflection({
          updatedAt: new Date("2026-07-01T00:00:00.000Z"),
        }),
      ],
      [],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("updatedAt é anterior");
  });

  it("detecta slug diferente do entry.id", () => {
    const problems = collectContentIntegrityProblems(
      [makeReflection({ slug: "fixture-slug-divergente" })],
      [],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("difere de entry.id");
  });

  it("detecta referências duplicadas", () => {
    const related = {
      collection: "reflections",
      id: "fixture-relacionada",
    };
    const problems = collectContentIntegrityProblems(
      [
        makeReflection({ relatedReflections: [related, related] }),
        makeReflection({}, "fixture-relacionada"),
      ],
      [],
      TEST_NOW,
    );
    expect(problems.join("\n")).toContain("referência duplicada");
  });
});
