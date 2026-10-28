import { byLabel, byText, byTextContains, input } from "./selectors.ts";

class BudgetsPage {
  get title() { return byText("Presupuestos"); }
  get add() { return byLabel("Agregar presupuesto"); }
  get save() { return byText("Guardar"); }
  get empty() { return byText("Sin presupuestos"); }
  get start() { return byText("Empezar"); }

  /** Creates the first budget, starting from the empty state. */
  async createFirst(category: string, maxAmount: string) {
    // An empty list shows a call to action instead of the header.
    await this.empty.waitForDisplayed();
    await this.start.click();
    // Category chips include their emoji ("🍔 Comida").
    await byTextContains(category).click();
    await input(0).setValue(maxAmount);
    await this.save.click();
    await byTextContains(category).waitForDisplayed();
  }
}

export default new BudgetsPage();
