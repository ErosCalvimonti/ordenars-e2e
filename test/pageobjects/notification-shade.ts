import { byText } from "./selectors.ts";

/** The Android notification drawer, outside the app. */
class NotificationShade {
  async open() {
    await driver.openNotifications();
  }

  notification(text: string) { return byText(text); }

  async close() {
    await driver.back();
  }
}

export default new NotificationShade();
