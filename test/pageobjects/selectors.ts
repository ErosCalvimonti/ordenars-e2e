// The app is built with Jetpack Compose and exposes no resource ids, so the
// tests use what a user sees: visible text and accessibility labels.
export const byText = (text: string) => $(`android=new UiSelector().text(${JSON.stringify(text)})`);
export const byTextContains = (text: string) => $(`android=new UiSelector().textContains(${JSON.stringify(text)})`);
export const byLabel = (label: string) => $(`~${label}`);
export const input = (index: number) => $(`android=new UiSelector().className("android.widget.EditText").instance(${index})`);
