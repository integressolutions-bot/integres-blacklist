# Integres Risk Review Demo (Expo SDK 54)

A safer demo client for the shared Integres backend. The UI intentionally describes user submissions as confidential allegations pending review, not established facts.

## Setup
1. Keep your existing `.git/`, EAS project identity, credentials and signing files.
2. Copy `.env.example` to `.env` if running locally.
3. Replace `REPLACE_WITH_YOUR_EXISTING_EAS_PROJECT_ID` in `app.json` with the EAS project ID already attached to your current app.
4. `npm install`
5. `npx expo-doctor`
6. `npx eas build --platform android --profile preview`

## Backend
Deploy the included blacklist backend patch first if you want the safer review workflow. It only replaces files inside `src/apps/blacklist/`.

## Demo safeguards
- confidential reporting by default
- explicit good-faith confirmation
- no UI claim that payment proves a report
- no UI promise that payment guarantees removal
- subject dispute/correction route
- mediation and practitioner preferences
- neutral reviewed-record wording
- no public display of evidence, phone, email or report narrative

This is a technical demo, not legal advice and not a guarantee against claims or litigation.
