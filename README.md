# OrdenARS E2E

[![E2E](https://github.com/ErosCalvimonti/ordenars-e2e/actions/workflows/e2e.yml/badge.svg)](https://github.com/ErosCalvimonti/ordenars-e2e/actions/workflows/e2e.yml)
![Appium](https://img.shields.io/badge/Appium-3-662d91?logo=appium&logoColor=white)
![WebdriverIO](https://img.shields.io/badge/WebdriverIO-10-ea5906?logo=webdriverio&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)

End-to-end tests for [OrdenARS](https://github.com/ErosCalvimonti/OrdenARS), an offline Android app that records expenses automatically from the notifications of Argentine banks and wallets.

The suite drives the real app on an Android emulator with **Appium + WebdriverIO + TypeScript**. Every run builds the APK from the app's repository, boots a fresh emulator on GitHub Actions and runs the tests against it. No device farm, no shared state.

## What is covered

| Spec | Scenarios |
|---|---|
| `notification-detection` | A wallet notification ("Pagaste $1.500,50 en Rappi") becomes an expense, categorized as *Comida*, tagged *Auto* and with the original text kept · Argentine amounts with thousands separators · promotions and incoming transfers are ignored |
| `alerts` | A detected payment that goes over a monthly budget fires an alert notification · a purchase announced without an amount posts a notification that opens a pre-filled form |
| `manual-expense` | A cash expense shows up on the dashboard with the right total · an expense is deleted from its detail screen |
| `onboarding` | The three slides lead to an empty dashboard · onboarding is shown only once |

## How the notifications are simulated

The core feature of the app reacts to notifications from other apps, which a UI test can't trigger by tapping. The tests post them from the device shell instead:

```bash
adb shell cmd notification post -t 'Mercado Pago' tag 'Pagaste $1.500,50 en Rappi'
```

The app only listens to a whitelist of wallet packages, so the **debug build** of OrdenARS adds the shell to that list ([`BilleterasDePrueba.kt`](https://github.com/ErosCalvimonti/OrdenARS/blob/main/app/src/debug/java/com/calvimonti/ordenars/service/BilleterasDePrueba.kt)). The release build ships an empty list, so production behavior is unchanged.

Notification access can only be granted from the system Settings, so the tests grant it through the shell (`cmd notification allow_listener`) and start every test from a clean install state.

## Design choices

- **Page Objects** in [`test/pageobjects`](test/pageobjects), one per screen, plus the system notification drawer.
- **User-facing selectors.** The app is built with Jetpack Compose and has no resource ids, so tests find elements by visible text and accessibility labels, like a user would.
- **Isolated tests.** Each test clears the app data, re-grants permissions and cold-starts the app, so tests can run in any order.
- **Animations off** on the emulator to avoid timing-dependent failures.
- **Evidence on failure:** a screenshot per failed test and a JUnit report, uploaded as a CI artifact.

## Running locally

Requirements: Node 22, JDK 17, Android SDK with an emulator running (or a device connected), and the [OrdenARS](https://github.com/ErosCalvimonti/OrdenARS) repository cloned next to this one.

```bash
# build the app
cd ../OrdenARS && ./gradlew assembleDebug && cd -

# install and run
npm ci
npm run appium:driver
npm test
```

Use `APK_PATH` to point to a different APK.

## Project structure

```
test/
  helpers/      adb commands and app state reset
  pageobjects/  screens of the app and the notification drawer
  specs/        the scenarios above
wdio.conf.ts    capabilities, Appium service, reporters
```
