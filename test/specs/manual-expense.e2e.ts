import { expect } from "@wdio/globals";
import { freshStart } from "../helpers/app.ts";
import Onboarding from "../pageobjects/onboarding.page.ts";
import Dashboard from "../pageobjects/dashboard.page.ts";
import AddExpense from "../pageobjects/add-expense.page.ts";
import Detail from "../pageobjects/expense-detail.page.ts";
import History from "../pageobjects/history.page.ts";

describe("Manual expenses", () => {
  beforeEach(async () => {
    await freshStart();
    await Onboarding.skipAll();
    await Dashboard.open();
  });

  it("adds a cash expense and shows it on the dashboard", async () => {
    await Dashboard.addExpense.click();
    await AddExpense.add({ amount: "2500", description: "Verdulería", category: "Comida" });

    await Dashboard.open();
    const row = await Dashboard.movementRow("Verdulería");
    expect(row).toEqual(expect.arrayContaining(["Verdulería", "Comida", "$2.500"]));
    expect(row).not.toContain("Auto");
    expect(await Dashboard.monthlyTotal()).toBe("$2.500");
  });

  it("deletes an expense from its detail screen", async () => {
    await Dashboard.addExpense.click();
    await AddExpense.add({ amount: "800", description: "Kiosco", category: "Otros" });
    await Dashboard.open();

    await Dashboard.seeAllMovements.click();
    await History.open("Kiosco");
    await expect(Detail.enteredManually).toBeDisplayed();
    await Detail.delete.click();
    await Detail.confirmDelete.click();

    await expect(History.expense("Kiosco")).not.toBeDisplayed();
  });
});
