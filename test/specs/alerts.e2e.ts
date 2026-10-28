import { expect } from "@wdio/globals";
import { postNotification } from "../helpers/adb.ts";
import { freshStart } from "../helpers/app.ts";
import Onboarding from "../pageobjects/onboarding.page.ts";
import Dashboard from "../pageobjects/dashboard.page.ts";
import Budgets from "../pageobjects/budgets.page.ts";
import AddExpense from "../pageobjects/add-expense.page.ts";
import Shade from "../pageobjects/notification-shade.ts";
import { byText } from "../pageobjects/selectors.ts";

// Flows that leave the app: OrdenARS reacts to a wallet notification by
// posting its own notification, and the user continues from the drawer.
describe("Notifications posted by OrdenARS", () => {
  beforeEach(async () => {
    await freshStart();
    await Onboarding.skipAll();
    await Dashboard.open();
  });

  it("alerts when a detected payment goes over the monthly budget", async () => {
    await $("//*[@text='Presupuesto']/following-sibling::*[@text='Ver todo'][1]").click();
    await Budgets.createFirst("Comida", "1000");

    postNotification("pago-rappi", "Mercado Pago", "Pagaste $1.500 en Rappi");

    await Shade.open();
    await expect(Shade.notification("Te pasaste del presupuesto de Comida")).toBeDisplayed();
    await expect(Shade.notification("Gastaste $1.500 de $1.000 presupuestados este mes.")).toBeDisplayed();
    await Shade.close();
  });

  it("turns a purchase without amount into a pre-filled form", async () => {
    postNotification("compra", "Compraste en PEDIDOSYA", "Con tu tarjeta Personal Pay");

    await Shade.open();
    await Shade.notification("Tocá para cargar el monto").click();

    await expect(AddExpense.title).toBeDisplayed();
    await expect(AddExpense.description).toHaveText("PEDIDOSYA");
    await AddExpense.amount.setValue("4200");
    await byText("Comida").click();
    await AddExpense.save.click();

    await Dashboard.open();
    expect(await Dashboard.movementRow("PEDIDOSYA")).toEqual(expect.arrayContaining(["PEDIDOSYA", "$4.200"]));
  });
});
