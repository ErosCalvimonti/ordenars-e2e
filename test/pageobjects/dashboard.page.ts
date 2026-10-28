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
   * "Auto" badge, wallet or category, amount and date. Compose exposes the
   * list as flat siblings, so the row is the description plus the texts that
   * follow it, up to the date after the amount.
   */
  async movementRow(description: string) {
    await this.scrollToBottom();
    const first = byText(description);
    await first.waitForDisplayed();
    const row = [await first.getText()];
    const following = await $$(`//*[@text=${JSON.stringify(description)}]/following-sibling::*`).map((e) => e.getText());
    for (const text of following) {
      row.push(text);
      if (row.slice(1, -1).some((t) => t.startsWith("$"))) break;
    }
    return row;
  }

  /** On small screens the list of movements starts below the fold. */
  async scrollToBottom() {
    const { width, height } = await driver.getWindowSize();
    await driver.execute("mobile: swipeGesture", {
      left: width * 0.1, top: height * 0.3, width: width * 0.8, height: height * 0.5,
      direction: "up", percent: 0.9,
    });
  }

  async open() {
    await this.header.waitForDisplayed();
  }
}

export default new DashboardPage();
