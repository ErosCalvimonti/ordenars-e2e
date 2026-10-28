import { byText, input } from "./selectors.ts";

class AddExpensePage {
  get title() { return byText("Nuevo gasto"); }
  get amount() { return input(0); }
  get description() { return input(1); }
  // The header action stays visible while the keyboard covers the bottom button.
  get save() { return byText("Guardar"); }
  get saved() { return byText("Gasto guardado"); }

  category(name: string) { return byText(name); }

  async add({ amount, description, category }: { amount: string; description: string; category?: string }) {
    await this.title.waitForDisplayed();
    await this.amount.setValue(amount);
    if (category) await this.category(category).click();
    await this.description.setValue(description);
    await this.save.click();
  }
}

export default new AddExpensePage();
