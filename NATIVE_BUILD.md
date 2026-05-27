# Native Build — Android

This guide takes the SignalMe web app and produces an installable Android app (Play Store) with **native FCM push notifications**.

iOS is intentionally deferred — when you're ready, ping to add APNs + Capacitor iOS in a follow-up.

The web side (Capacitor config, native push registration, server-side FCM sender) is already wired. You only need to do the steps below **on your own machine** — Lovable can't run Android Studio.

---

## Prerequisites

- **Android Studio** (Hedgehog or newer) + Android SDK
- **Node 20+** and `bun`
- **Google Play Developer account** ($25 one-time) for Play Store
- A **Firebase project** (free)

---

## 1. Clone and install

```bash
git clone <your-lovable-github-repo>
cd <repo>
bun install
bun run build           # produces dist/
```

## 2. Add the Android platform

```bash
npx cap add android
npx cap sync
```

This creates the `android/` folder. Commit it.

## 3. Firebase / FCM

1. Go to <https://console.firebase.google.com> → **Add project** → name it SignalMe.
2. **Add Android app** → package name `app.signalme` → download `google-services.json`.
3. Drop `google-services.json` into `android/app/google-services.json`.
4. In Firebase **Project settings → Service accounts → Generate new private key**. Open the JSON file, copy its **entire contents**, and add it to Lovable Cloud as the secret **`FCM_SERVICE_ACCOUNT_JSON`** (paste the full JSON string).

## 4. Open the Android project

```bash
npx cap open android
```

In Android Studio:
- Verify `applicationId` is `app.signalme` in `android/app/build.gradle`.
- Make sure `google-services.json` is present in `android/app/`.
- Build → Generate Signed App Bundle (you'll need a keystore — create one if you don't have one).
- Upload the `.aab` to Play Console.

## 5. Test push

1. Install the dev build on a real device.
2. Sign in. The app calls `registerNativePushForCurrentUser` automatically on login — it asks for notification permission and stores the FCM token in `push_subscriptions` with `platform = 'android'`.
3. From another account, send a chat message. The DB trigger fan-outs to `send-push`, which routes Android tokens to FCM (high priority, lockscreen-capable, app-killed delivery).

## 6. Live web updates

`capacitor.config.ts` points `server.url` at your published Lovable URL, so once you publish a web change in Lovable it goes live in the installed app **on next launch** — no Play Store re-submission for UI changes.

You only need to ship a new Play Store build when:
- you update Capacitor or its plugins,
- you change native config (icons, splash, capabilities, package name),
- a new Android version requires it.

---

## What's intentionally out of scope (next phases)

- **iOS / APNs** — separate scope, requires an Apple Developer account ($99/yr) and macOS + Xcode.
- **Voice/video calls with ConnectionService** — requires WebRTC + signaling + native call UI plugin. The push pipeline can already deliver "incoming call" alerts; full lockscreen call UI is more work.
- **Notification action buttons** (inline reply, mark read).
- **Rich notifications** with images.

Ping for any of those when you're ready.
