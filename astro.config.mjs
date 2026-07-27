// @ts-check
import { defineConfig } from "astro/config";

const runtime = /** @type {{
  process?: { env?: Record<string, string | undefined> };
}} */ (globalThis);
const isGitHubPages = runtime.process?.env?.GITHUB_PAGES === "true";

// https://astro.build/config
export default defineConfig({
  site: "https://eliabe-oliveira.github.io",
  base: isGitHubPages ? "/padre-claudiano-avelino-site" : "/",
  devToolbar: {
    enabled: false,
  },
});
