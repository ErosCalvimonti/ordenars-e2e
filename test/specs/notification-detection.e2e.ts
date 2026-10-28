import { expect } from "@wdio/globals";
import { postNotification } from "../helpers/adb.ts";
import { freshStart } from "../helpers/app.ts";
import Onboarding from "../pageobjects/onboarding.page.ts";
import Dashboard from "../pageobjects/dashboard.page.ts";
import Detail from "../pageobjects/expense-detail.page.ts";
import History from "../pageobjects/history.page.ts";

// The core feature: a wallet notification becomes a categorized expense
// without the user touching the app.
describe("Automatic detection from wallet notifications", () => {
  beforeEach(async () => {
    await freshStart();
    await Onboarding.skipAll();
    await Dashboard.open();
  });

  it("registers a payment, categorizes it and keeps the original text", async () => {
    postNotification("pago-rappi", "Mercado Pago", "Pagaste $1.500,50 en Rappi");

    expect(await Dashboard.movementRow("Rappi")).toEqual(
      expect.arrayContaining(["Rappi", "Auto", "Simulador (adb)", "$1.500"]),
    );
    expect(await Dashboard.monthlyTotal()).toBe("$1.500");

    await Dashboard.seeAllMovements.click();
    await History.open("Rappi");
    await expect(Detail.title).toBeDisplayed();
    await expect(Detail.detectedAutomatically).toBeDisplayed();
    await expect(Detail.text("Pagaste $1.500,50 en Rappi")).toBeDisplayed();
  });

  it("parses Argentine amounts with thousands separators", async () => {
    postNotification("pago-sube", "Mercado Pago", "Pagaste $12.345,67 en SUBE");

    expect(await Dashboard.movementRow("SUBE")).toEqual(expect.arrayContaining(["SUBE", "$12.346"]));
    expect(await Dashboard.monthlyTotal()).toBe("$12.346");
  });

  it("ignores notifications that are not an explicit payment", async () => {
    postNotification("promo", "Mercado Pago", "Tenés 20% off en Rappi hasta el domingo");
    postNotification("ingreso", "Mercado Pago", "Recibiste $5.000 de Juan");

    // Give the listener time to (not) react before asserting the empty state.
    await driver.pause(3000);
    await expect(Dashboard.noExpenses).toBeDisplayed();
    expect(await Dashboard.monthlyTotal()).toBe("$0");
  });
});
