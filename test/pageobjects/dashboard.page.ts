import { byLabel, byText } from "./selectors.ts";

class DashboardPage {
  get header() { return byText("Tus ARS en orden"); }
  get noExpenses() { return byText("Todavía no registraste ningún gasto."); }
  get noCategories() { return byText("Todavía no hay gastos categorizados este mes."); }
  get addExpense() { return byLabel("Agregar gasto"); }
  get seeAllMovements() {
    return $("//*[@text='Últimos movimientos']/following-sibling::*[@text='Ver todo'][1]");
  }

  /** Monthly total shown under "Gastado en <mes>". */
  async monthlyTotal() {
    return $("//*[starts-with(@text,'Gastado en')]/following-sibling::*[starts-with(@text,'$')][1]").getText();
  }

  movement(description: string) { return byText(description); }

  /**
   * Every text in the "Últimos movimientos" row of an expense: description,
   * "Auto" badge, wallet or category, amount and date.
   */
  async movementRow(description: string) {
    const row = `//*[@text=${JSON.stringify(description)}]/ancestor::*[.//*[starts-with(@text,'$')]][1]`;
    await $(row).waitForDisplayed();
    return $$(`${row}//android.widget.TextView`).map((t) => t.getText());
  }

  async open() {
    await this.header.waitForDisplayed();
  }
}

export default new DashboardPage();
