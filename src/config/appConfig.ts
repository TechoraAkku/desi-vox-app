// true  -> fake login (demo APK for the client, no Firebase calls)
// false -> real Firebase login. Set per build profile in eas.json (EXPO_PUBLIC_USE_MOCK_AUTH).
export const USE_MOCK_AUTH = process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true';

// Firebase Console -> Authentication -> Sign-in method -> Google -> Web SDK configuration -> Web client ID
export const GOOGLE_WEB_CLIENT_ID = '788210772055-l743lm1ndtl0boo4q4rgprh6b9bkudor.apps.googleusercontent.com';
