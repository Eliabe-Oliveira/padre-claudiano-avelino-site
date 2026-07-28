import { describe, expect, it } from "vitest";
import {
  buildBlogPostingStructuredData,
  buildHomeStructuredData,
  buildPageStructuredData,
  buildPersonData,
  buildProfileStructuredData,
  serializeStructuredData,
} from "../../src/lib/structured-data";

const page = {
  url: "https://example.com/",
  name: "Padre Claudiano Avelino",
  description: "Descrição",
};
const person = {
  url: "https://example.com/",
  image: "https://example.com/_astro/retrato.webp",
};

describe("dados estruturados", () => {
  it("gera WebSite, WebPage e Person aprovados", () => {
    const data = buildHomeStructuredData(page, person);
    expect(JSON.stringify(data)).toContain('"WebSite"');
    expect(JSON.stringify(data)).toContain('"WebPage"');
    expect(buildPersonData(person)).toEqual({
      "@type": "Person",
      name: "Padre Claudiano Avelino",
      description:
        "Sacerdote e religioso paulino dedicado à espiritualidade, à comunicação e à formação.",
      url: person.url,
      image: person.image,
    });
  });

  it("gera ProfilePage, ContactPage e CollectionPage", () => {
    expect(JSON.stringify(buildProfileStructuredData(page, person))).toContain(
      '"ProfilePage"',
    );
    expect(buildPageStructuredData("ContactPage", page)["@type"]).toBe(
      "ContactPage",
    );
    expect(buildPageStructuredData("CollectionPage", page)["@type"]).toBe(
      "CollectionPage",
    );
  });

  it("prepara BlogPosting e BreadcrumbList", () => {
    const data = buildBlogPostingStructuredData(
      {
        ...page,
        publishedAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-02T00:00:00.000Z"),
        image: person.image,
        section: "Oração e vida espiritual",
        breadcrumbs: [{ name: "Início", url: page.url }],
      },
      person,
    );
    const serialized = JSON.stringify(data);
    expect(serialized).toContain('"BlogPosting"');
    expect(serialized).toContain('"BreadcrumbList"');
    expect(serialized).toContain('"dateModified"');
    expect(serialized).not.toContain('"publisher"');
  });

  it("serializa sem permitir fechamento prematuro do script", () => {
    const serialized = serializeStructuredData({
      value: "</script><script>alert(1)</script>",
    });
    expect(serialized).not.toContain("</script>");
    expect(JSON.parse(serialized)).toEqual({
      value: "</script><script>alert(1)</script>",
    });
  });
});
