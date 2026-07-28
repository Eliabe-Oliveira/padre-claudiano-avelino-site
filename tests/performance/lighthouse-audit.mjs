import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import process from "node:process";
import { setTimeout } from "node:timers/promises";
import { URL } from "node:url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "@playwright/test";

/* global fetch */

const port = 4322;
const origin = `http://127.0.0.1:${port}`;
const artifactDirectory = new URL("./artifacts/etapa-5-7-b/", import.meta.url);
const desktopThrottling = {
  rttMs: 40,
  throughputKbps: 10_240,
  cpuSlowdownMultiplier: 1,
  requestLatencyMs: 0,
  downloadThroughputKbps: 0,
  uploadThroughputKbps: 0,
};
const desktopUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";
const preview = spawn(
  "npm",
  ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port)],
  {
    cwd: new URL("../..", import.meta.url),
    detached: true,
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: "1",
    },
    stdio: "ignore",
  },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // O preview ainda está iniciando.
    }
    await setTimeout(250);
  }
  throw new Error("O preview do Astro não respondeu dentro do prazo.");
}

const audits = [
  { name: "inicio-mobile", path: "/", formFactor: "mobile" },
  { name: "inicio-desktop", path: "/", formFactor: "desktop" },
  { name: "sobre-mobile", path: "/sobre/", formFactor: "mobile" },
  { name: "videos-mobile", path: "/videos/", formFactor: "mobile" },
];

function score(report, category) {
  return Math.round((report.categories[category]?.score ?? 0) * 100);
}

function metric(report, id) {
  const audit = report.audits[id];
  return audit?.displayValue ?? `${audit?.numericValue ?? 0}`;
}

let chrome;
try {
  await mkdir(artifactDirectory, { recursive: true });
  await waitForServer();
  chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
  });

  const summaries = [];
  for (const audit of audits) {
    const desktop = audit.formFactor === "desktop";
    const result = await lighthouse(`${origin}${audit.path}`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      formFactor: audit.formFactor,
      throttling: desktop ? desktopThrottling : undefined,
      emulatedUserAgent: desktop ? desktopUserAgent : undefined,
      screenEmulation: desktop
        ? {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
          }
        : undefined,
    });

    if (!result) throw new Error(`Lighthouse não retornou ${audit.name}.`);
    await writeFile(
      new URL(`${audit.name}.json`, artifactDirectory),
      result.report,
      "utf8",
    );
    summaries.push({
      name: audit.name,
      performance: score(result.lhr, "performance"),
      accessibility: score(result.lhr, "accessibility"),
      bestPractices: score(result.lhr, "best-practices"),
      seo: score(result.lhr, "seo"),
      fcp: metric(result.lhr, "first-contentful-paint"),
      lcp: metric(result.lhr, "largest-contentful-paint"),
      cls: metric(result.lhr, "cumulative-layout-shift"),
      tbt: metric(result.lhr, "total-blocking-time"),
      speedIndex: metric(result.lhr, "speed-index"),
    });
  }

  const rows = summaries.map(
    (item) =>
      `| ${item.name} | ${item.performance} | ${item.accessibility} | ${item.bestPractices} | ${item.seo} | ${item.fcp} | ${item.lcp} | ${item.cls} | ${item.tbt} | ${item.speedIndex} |`,
  );
  await writeFile(
    new URL("resumo.md", artifactDirectory),
    [
      "# Lighthouse — Etapa 5.7-B",
      "",
      "| Auditoria | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT | Speed Index |",
      "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
      ...rows,
      "",
      "Resultados obtidos localmente; tempos podem variar entre execuções.",
      "",
    ].join("\n"),
    "utf8",
  );

  const failures = summaries.filter((item) => {
    const performanceMinimum = item.name === "inicio-desktop" ? 95 : 90;
    return (
      item.performance < performanceMinimum ||
      item.accessibility < 100 ||
      item.bestPractices < 95
    );
  });
  if (failures.length > 0) {
    throw new Error(
      `Limites do Lighthouse não atingidos: ${failures.map(({ name }) => name).join(", ")}.`,
    );
  }
} finally {
  if (chrome) chrome.kill();
  if (preview.pid) {
    try {
      process.kill(-preview.pid, "SIGTERM");
    } catch {
      preview.kill("SIGTERM");
    }
  }
}
