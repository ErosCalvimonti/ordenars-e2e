import { shell } from "./adb.ts";

export const PACKAGE = "com.calvimonti.ordenars";
const LISTENER = `${PACKAGE}/${PACKAGE}.service.OrdenARSNotificationListener`;

/**
 * Leaves the app as a fresh install: no expenses, onboarding pending and
 * notification access granted (Android only allows that from Settings, so
 * it is granted through the shell instead of the UI).
 */
export async function freshStart(): Promise<void> {
  shell("cmd statusbar collapse");
  shell(`am force-stop ${PACKAGE}`);
  shell(`pm clear ${PACKAGE}`);
  shell(`pm grant ${PACKAGE} android.permission.POST_NOTIFICATIONS`);
  shell(`cmd notification allow_listener ${LISTENER}`);
  // Cold start: resuming the old task after "pm clear" can leave a blank window.
  shell(`am start -W -S -n ${PACKAGE}/.MainActivity`);
}

/** Kills and relaunches the app, keeping its data. */
export function restart(): void {
  shell(`am start -W -S -n ${PACKAGE}/.MainActivity`);
}
