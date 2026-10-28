import { execFileSync } from "node:child_process";
import { join } from "node:path";

const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT;
const adbBin = sdk ? join(sdk, "platform-tools", "adb") : "adb";

/** Runs a command on the device shell and returns its output. */
export function shell(command: string): string {
  return execFileSync(adbBin, ["shell", command], { encoding: "utf8" }).trim();
}

const quote = (s: string) => `'${s.replace(/'/g, `'\''`)}'`;

/**
 * Posts a notification from the device shell, the same way a wallet app
 * would. The debug build of OrdenARS treats the shell as a known wallet.
 */
export function postNotification(tag: string, title: string, text: string): void {
  shell(`cmd notification post -t ${quote(title)} ${quote(tag)} ${quote(text)}`);
}

/**
 * Makes the device predictable for UI tests: no system animations and no
 * "app isn't responding" dialogs, which freshly booted CI emulators tend to
 * show for the launcher.
 */
export function prepareDevice(): void {
  for (const scale of ["window_animation_scale", "transition_animation_scale", "animator_duration_scale"]) {
    shell(`settings put global ${scale} 0`);
  }
  shell("settings put global hide_error_dialogs 1");
}

/** Closes any system dialog or drawer left on top of the app. */
export function closeSystemDialogs(): void {
  shell("am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS");
  shell("cmd statusbar collapse");
}
