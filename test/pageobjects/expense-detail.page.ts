import { byText, byTextContains } from "./selectors.ts";

class ExpenseDetailPage {
  get title() { return byText("Detalle del gasto"); }
  get detectedAutomatically() { return byTextContains("Detectado automáticamente"); }
  get enteredManually() { return byTextContains("Cargado a mano"); }
  get originalNotification() { return byText("Notificación original"); }
  get delete() { return byText("Eliminar gasto"); }
  get confirmDelete() { return byText("Eliminar"); }

  text(value: string) { return byTextContains(value); }
}

export default new ExpenseDetailPage();
