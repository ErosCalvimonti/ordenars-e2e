import { expect } from "@wdio/globals";
import { freshStart, restart } from "../helpers/app.ts";
import Onboarding from "../pageobjects/onboarding.page.ts";
import Dashboard from "../pageobjects/dashboard.page.ts";

describe("Onboarding", () => {
  beforeEach(freshStart);

  it("walks through the three slides and lands on an empty dashboard", async () => {
    await expect(Onboarding.slide("Ordená tus mangos")).toBeDisplayed();
    await Onboarding.next.click();
    await expect(Onboarding.slide("Detección automática")).toBeDisplayed();
    await Onboarding.next.click();
    await expect(Onboarding.slide("Tu plata en orden")).toBeDisplayed();
    await Onboarding.start.click();

    await expect(Onboarding.permissionDialog).toBeDisplayed();
    await Onboarding.notNow.click();

    await Dashboard.open();
    await expect(Dashboard.noExpenses).toBeDisplayed();
    await expect(Dashboard.noCategories).toBeDisplayed();
  });

  it("is shown only once", async () => {
    await Onboarding.skipAll();
    await Dashboard.open();

    restart();

    await Dashboard.open();
    await expect(Onboarding.skip).not.toBeDisplayed();
  });
});
