import { byText, input } from "./selectors.ts";

class HistoryPage {
  get title() { return byText("Historial"); }
  get search() { return input(0); }
  get noResults() { return byText("Sin resultados"); }

  expense(description: string) { return byText(description); }

  async open(description: string) {
    await this.title.waitForDisplayed();
    await this.expense(description).click();
  }
}

export default new HistoryPage();
