import type { APIRoute } from "astro";
import { buildAbsoluteUrl, buildInternalUrl } from "../lib/urls";

export const GET: APIRoute = ({ site }) => {
  const publicSite = site ?? new URL("http://localhost:4321/");
  const sitemapUrl = buildAbsoluteUrl(
    buildInternalUrl("/sitemap-index.xml"),
    publicSite,
  );
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
