import { BrowserContext, test, chromium } from "@playwright/test";
import findFreePorts from "find-free-ports";
import * as fs from "fs";

const pagePaths = {
  about: "about",
  faq: "frequently-asked-questions",
  home: "",
  privacyPolicy: "privacy-policy",
  productPage: "product/acme-geometric-circles-t-shirt",
  search: "search?q=acme",
  shippingReturnPolicy: "shipping-return-policy",
  termsConditions: "terms-conditions",
};

let browser: BrowserContext;
let port: number;

test.beforeAll(async () => {
  // open chromium with remote debugging port for lighthouse
  [port] = await findFreePorts(1);
  browser = await chromium.launchPersistentContext("", {
    args: [`--remote-debugging-port=${port}`],
    // default lighthouse desktop resolution
    viewport: { width: 1350, height: 940 },
  });
});

for (const [pageName, pagePath] of Object.entries(pagePaths)) {
  test(`${pageName} @lighthouse`, async ({ baseURL }) => {
    const fullUrl = baseURL + pagePath;
    const reportPath = `${__dirname}/reports/${pageName}.html`;
    const lighthouse = require("lighthouse/core/index.cjs");

    // https://github.com/GoogleChrome/lighthouse/blob/main/core/config/desktop-config.js
    const config = {
      extends: "lighthouse:default",
      settings: {
        formFactor: "desktop",
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        skipAudits: [
          // Skip the h2 audit so it doesn't lie to us. See https://github.com/GoogleChrome/lighthouse/issues/6539
          "uses-http2",
          // There are always bf-cache failures when testing in headless. Reenable when headless can give us realistic bf-cache insights.
          "bf-cache",
        ],
      },
    };

    // https://github.com/GoogleChrome/lighthouse/blob/main/docs/understanding-results.md
    const runnerResult = await lighthouse(
      fullUrl,
      {
        output: "html",
        port: port,
      },
      config
    );

    const reportHtml = runnerResult.report;
    fs.writeFileSync(reportPath, reportHtml);
  });
}