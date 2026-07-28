export type StructuredData = Record<string, unknown>;

interface PageData {
  url: string;
  name: string;
  description: string;
}

interface PersonData {
  url: string;
  image: string;
}

interface BlogPostingData extends PageData {
  publishedAt: Date;
  updatedAt?: Date;
  image: string;
  section: string;
  breadcrumbs: Array<{ name: string; url: string }>;
}

export function serializeStructuredData(
  value: StructuredData | StructuredData[],
): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function buildPersonData({ url, image }: PersonData): StructuredData {
  return {
    "@type": "Person",
    name: "Padre Claudiano Avelino",
    description:
      "Sacerdote e religioso paulino dedicado à espiritualidade, à comunicação e à formação.",
    url,
    image,
  };
}

export function buildHomeStructuredData(
  page: PageData,
  person: PersonData,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Padre Claudiano Avelino",
        url: page.url,
        description: page.description,
      },
      {
        "@type": "WebPage",
        name: page.name,
        url: page.url,
        description: page.description,
      },
      buildPersonData(person),
    ],
  };
}

export function buildProfileStructuredData(
  page: PageData,
  person: PersonData,
): StructuredData {
  const personData = buildPersonData(person);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        name: page.name,
        url: page.url,
        description: page.description,
        mainEntity: personData,
      },
      personData,
    ],
  };
}

export function buildPageStructuredData(
  type: "ContactPage" | "CollectionPage",
  page: PageData,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: page.name,
    url: page.url,
    description: page.description,
  };
}

export function buildBlogPostingStructuredData(
  page: BlogPostingData,
  person: PersonData,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: page.name,
        description: page.description,
        datePublished: page.publishedAt.toISOString(),
        ...(page.updatedAt && {
          dateModified: page.updatedAt.toISOString(),
        }),
        image: page.image,
        author: buildPersonData(person),
        mainEntityOfPage: page.url,
        articleSection: page.section,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: page.breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    ],
  };
}
