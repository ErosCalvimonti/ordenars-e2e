import { byText } from "./selectors.ts";

class OnboardingPage {
  get skip() { return byText("Saltar"); }
  get next() { return byText("Siguiente"); }
  get start() { return byText("Empezar"); }
  get permissionDialog() { return byText("Activá la detección automática"); }
  get notNow() { return byText("Ahora no"); }

  slide(title: string) { return byText(title); }

  /** Skips the slides and declines the system settings shortcut. */
  async skipAll() {
    await this.skip.click();
    await this.notNow.click();
  }
}

export default new OnboardingPage();
