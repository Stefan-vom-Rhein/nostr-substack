# Nostr Substack - Expo (Ready-to-build)

This is a minimal Expo React Native project scaffold prepared so you can build an Android APK/AAB.
**I cannot build the APK in this environment**, but this project is complete and ready to be built locally
or in CI (EAS / Expo Application Services recommended).

## What's included
- Minimal Expo app (App.js) with example NDK usage to publish a `kind:1` note.
- `lib/ndk.js` shows how to connect to relays via NDK.
- `app.json` and `package.json`.
- Example GitHub Actions workflow to run `eas build`.

## To build locally (recommended)
1. Install dependencies:
   ```
   npm install -g expo-cli
   npm install
   ```
2. Install EAS CLI:
   ```
   npm install -g eas-cli
   ```
3. Log into Expo / configure EAS:
   ```
   eas login
   eas build:configure
   ```
4. Run an Android build:
   ```
   eas build --platform android
   ```
   Follow prompts to create a build profile. When finished you'll get an artifact (AAB/APK).

## To build with GitHub Actions (example)
- The `.github/workflows/eas-build.yml` file includes a skeleton that uses `eas build`.
- You must add `EAS_PROJECT_ID` and `EXPO_TOKEN` and other secrets in the repository settings.

## Notes about keys & security
- For testing only: `lib/ndk.js` reads a private key from `expo-constants` (not safe for production).
- Production: integrate Nostr Connect, WalletConnect, or an external wallet (e.g., Alby).
- Do NOT commit real private keys to the repository.

## How I can help next
- Integrate Nostr Connect UI for wallet sign-in.
- Add IPFS upload for paywalled content + Zap flow example.
- Convert to a native Android Studio (Kotlin) project if you prefer.
