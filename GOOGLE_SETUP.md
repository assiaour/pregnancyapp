# Google Sign-In Setup Guide

Follow these steps to fix the 400 error and enable real Google sign-in.

## Step 1: Create OAuth credentials in Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the **OAuth consent screen** first:
   - User Type: External (or Internal for testing)
   - App name, support email, developer email
   - Add your email as a test user if using External
6. For Application type, select **Web application** (not Android or iOS)
7. Name it (e.g. "Pregnancy App Web")

## Step 2: Add the redirect URI

1. In the OAuth client form, under **Authorized redirect URIs**, click **Add URI**
2. Run your app and open the Gmail sign-in screen
3. Copy the **exact** redirect URI shown (e.g. `exp://5tgwvca-anonymous-8081.exp.direct/--/redirect`)
4. Paste it into Google Console
5. Save the OAuth client

> **Tip:** The redirect URI changes when you restart Expo with tunnel. If using tunnel, copy the URI from the app each time you restart. For a more stable URI, use `npx expo start` (without `--tunnel`) on the same Wi‑Fi as your phone—the URI will be like `exp://192.168.x.x:8081/--/redirect` and stays the same.

## Step 3: Set your Client ID

1. Open the `.env` file in the project root (create it from `.env.example` if it doesn’t exist)
2. Add your Web client ID:
   ```
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=123456789-xxxxxxxxxx.apps.googleusercontent.com
   ```
3. Save the file

## Step 4: Restart Expo

1. Stop the current Expo process (Ctrl+C)
2. Run: `npx expo start --clear`
3. Reload the app on your device

---

**Troubleshooting**

- **400 error after setup:** Ensure the redirect URI in Google Console matches exactly what the app shows (no trailing slash, correct port).
- **Client ID not loading:** Run `npx expo start --clear` after changing `.env`.
- **Testing without setup:** Use "Simulate sign-in" on the Gmail screen to test the flow without Google OAuth.
