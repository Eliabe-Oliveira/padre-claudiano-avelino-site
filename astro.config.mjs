// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import process from "node:process";
import { resolveDeploymentConfig } from "./config/deployment.mjs";

const deployment = resolveDeploymentConfig(process.env);

// https://astro.build/config
export default defineConfig({
  site: deployment.siteOrigin,
  base: deployment.basePath,
  trailingSlash: "always",
  output: "static",
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/404.html/"),
    }),
  ],
  devToolbar: {
    enabled: false,
  },
});
