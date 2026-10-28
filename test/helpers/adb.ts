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

/** System animations make UI tests slower and flakier; turn them off. */
export function disableAnimations(): void {
  for (const scale of ["window_animation_scale", "transition_animation_scale", "animator_duration_scale"]) {
    shell(`settings put global ${scale} 0`);
  }
}
