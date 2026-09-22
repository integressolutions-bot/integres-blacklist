# Integres Blacklist 1.2.1 deployment hardening

Reviewed against the supplied `integres-blacklist.zip`. The patch addresses mobile-side deployment blockers and unsafe demo behavior found in the current source.

## Included
- Align package version with the Expo app version and add `npm run check`.
- Add `.npmrc` for the existing legacy peer dependency tree.
- Remove duplicate Android RECORD_AUDIO permission.
- Harden the API client with JSON negotiation, encoded record IDs, 401 session invalidation, and clearer network/timeout errors.
- Validate registration and dispute inputs before requests.
- Make resolution/removal review actually call the backend instead of only showing a demo alert.
- Avoid sending an empty `subjectEmail` field.
- Move Google Sign-In web client configuration to `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`; no OAuth client ID is hard-coded in source.

## Required build configuration
Set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` in EAS environments for builds where Google Sign-In is enabled. Email sign-in remains available if it is absent.

## Verify on Windows CMD
```cmd
npm install
npm run typecheck
npm run check
npx expo-doctor
```

Do not commit `node_modules`, `.expo`, build artifacts, credentials, signing keys, or secrets.

## Remaining release dependencies
This patch cannot by itself prove backend policy correctness, legal readiness, Google Android OAuth/SHA-1 configuration, store metadata, or production moderation operations. Those still need environment/build validation.
