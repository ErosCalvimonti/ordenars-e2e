import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { prepareDevice } from "./test/helpers/adb.ts";

const apk = resolve(process.env.APK_PATH ?? "../OrdenARS/app/build/outputs/apk/debug/app-debug.apk");

export const config: WebdriverIO.Config = {
  runner: "local",
  specs: ["./test/specs/**/*.e2e.ts"],
  maxInstances: 1,
  capabilities: [
    {
      platformName: "Android",
      "appium:automationName": "UiAutomator2",
      "appium:app": apk,
      "appium:appPackage": "com.calvimonti.ordenars",
      "appium:appActivity": ".MainActivity",
      "appium:autoGrantPermissions": true,
      // State is reset per test through adb (see helpers/app.ts), which is
      // faster than reinstalling the APK on every session.
      "appium:noReset": true,
      "appium:newCommandTimeout": 240,
    },
  ],
  logLevel: "warn",
  waitforTimeout: 15_000,
  connectionRetryCount: 2,
  services: [["appium", { args: { relaxedSecurity: false }, logPath: "./reports" }]],
  framework: "mocha",
  mochaOpts: { ui: "bdd", timeout: 120_000 },
  reporters: ["spec", ["junit", { outputDir: "./reports/junit" }]],

  onPrepare: () => prepareDevice(),

  afterTest: async (test, _context, { passed }) => {
    if (passed) return;
    mkdirSync("./reports/screenshots", { recursive: true });
    const name = `${test.parent} - ${test.title}`.replace(/[^\w-]+/g, "_");
    await browser.saveScreenshot(`./reports/screenshots/${name}.png`);
  },
};
