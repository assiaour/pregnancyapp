import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { discovery as GoogleDiscovery } from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

const userInfoEndpoint = 'https://openidconnect.googleapis.com/v1/userinfo';

export default function GmailSignInScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const redirectUri = AuthSession.makeRedirectUri({ path: 'redirect' });

  const clientId =
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
    Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
    '';
  const hasValidClientId =
    !!clientId &&
    !clientId.includes('YOUR_GOOGLE') &&
    !clientId.includes('xxxxxxxx') &&
    clientId.endsWith('.apps.googleusercontent.com');

  const placeholder = '000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com';
  const effectiveClientId = clientId || placeholder;

  // Use base useAuthRequest (not Google provider) to avoid platform-specific iosClientId check
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: effectiveClientId,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    GoogleDiscovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const accessToken = response.params?.access_token || response.authentication?.accessToken;
      const code = response.params?.code;
      if (accessToken) {
        fetchUserInfo(accessToken);
      } else if (code && request?.codeVerifier) {
        exchangeCodeAndFetchUser(code, request.codeVerifier);
      } else {
        setError('No access token received. Make sure the redirect URI in Google Console matches exactly.');
        setLoading(false);
      }
    } else if (response?.type === 'error') {
      const msg = response.error?.message || response.error?.error_description || '';
      const isRedirectMismatch = /redirect_uri|400|mismatch/i.test(msg);
      setError(
        isRedirectMismatch
          ? `Redirect URI mismatch. Copy the exact URI above into Google Console → Credentials → Your OAuth client → Authorized redirect URIs.`
          : msg || 'Sign-in was cancelled or failed.'
      );
      setLoading(false);
    } else if (response?.type === 'dismiss') {
      setLoading(false);
    }
  }, [response]);

  const exchangeCodeAndFetchUser = async (code, codeVerifier) => {
    try {
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: effectiveClientId,
          redirectUri,
          code,
          extraParams: { code_verifier: codeVerifier },
        },
        GoogleDiscovery
      );
      if (tokenResponse?.accessToken) {
        fetchUserInfo(tokenResponse.accessToken);
      } else {
        setError('Could not exchange code for token.');
        setLoading(false);
      }
    } catch (e) {
      setError(e.message || 'Token exchange failed. Check redirect URI in Google Console.');
      setLoading(false);
    }
  };

  const fetchUserInfo = async (accessToken) => {
    try {
      const res = await fetch(userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      const data = await res.json();
      setUser({
        name: data.name || '',
        email: data.email || '',
        picture: data.picture || null,
      });
    } catch (e) {
      setError(e.message || 'Could not get your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!hasValidClientId) {
      setError('Set EXPO_PUBLIC_GOOGLE_CLIENT_ID in .env or app.json (see GOOGLE_SETUP.md).');
      return;
    }
    setError('');
    setUser(null);
    setLoading(true);
    try {
      await promptAsync();
    } catch (e) {
      setError(e.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleSimulate = () => {
    setUser({
      name: 'Demo User',
      email: 'demo@gmail.com',
      picture: null,
    });
  };

  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Signed in with Google</Text>
          <View style={styles.userCard}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <Text style={styles.hint}>
            You can now use this account in the app. In a real app you would save this and create a session.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryButtonText}>Continue to app</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.title}>Continue with Gmail</Text>
          <Text style={styles.subtitle}>
            Sign in with your Google account. We'll get your name and email from Google—no password needed.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.gmailButton, (!request || loading || !hasValidClientId) && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={!request || loading || !hasValidClientId}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.gmailButtonText}>Sign in with Google</Text>
            )}
          </TouchableOpacity>

          <View style={styles.uriBox}>
            <Text style={styles.uriTitle}>To fix "400" – configure Google OAuth</Text>
            <Text style={styles.uriLabel}>1. In Google Cloud create OAuth client type <Text style={styles.uriBold}>Web application</Text> (not Android/iOS).</Text>
            <Text style={styles.uriLabel}>2. Under "Authorized redirect URIs" add this URL exactly (copy-paste):</Text>
            <Text style={styles.uriValue} selectable>{redirectUri || 'Loading…'}</Text>
            <Text style={styles.uriLabel}>3. Set Client ID: add EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com to .env. Restart with: npx expo start --clear (see GOOGLE_SETUP.md for details)</Text>
            {hasValidClientId ? (
              <Text style={styles.uriOk}>Client ID loaded: {clientId.slice(0, 20)}…{clientId.slice(-5)}</Text>
            ) : (
              <Text style={styles.uriHint}>Add your Client ID (step 3) to enable real sign-in. Use "Simulate sign-in" to test without it.</Text>
            )}
          </View>

          <TouchableOpacity style={styles.simulateButton} onPress={handleSimulate}>
            <Text style={styles.simulateButtonText}>Simulate sign-in (for testing)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FA',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  content: {
    paddingHorizontal: 30,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A3F6B',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#7B68B8',
    textAlign: 'center',
    marginBottom: 28,
  },
  errorText: {
    color: '#B84A4A',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  gmailButton: {
    backgroundColor: '#7B68B8',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#7B68B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gmailButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  uriBox: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#D4C8E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  uriTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A3F6B',
    marginBottom: 10,
  },
  uriLabel: {
    fontSize: 12,
    color: '#5A4A7B',
    marginBottom: 6,
  },
  uriBold: {
    fontWeight: '700',
  },
  uriCode: {
    fontSize: 11,
    color: '#7B68B8',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  uriValue: {
    fontSize: 11,
    color: '#7B68B8',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  uriOk: {
    fontSize: 11,
    color: '#34A853',
    marginTop: 4,
  },
  uriWarn: {
    fontSize: 11,
    color: '#B84A4A',
    marginTop: 4,
  },
  uriHint: {
    fontSize: 11,
    color: '#7B68B8',
    marginTop: 4,
  },
  setupHint: {
    fontSize: 12,
    color: '#9B8AC4',
    textAlign: 'center',
    marginBottom: 24,
  },
  simulateButton: {
    paddingVertical: 12,
    alignSelf: 'center',
    marginBottom: 24,
  },
  simulateButtonText: {
    fontSize: 14,
    color: '#7B68B8',
    fontWeight: '600',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#7B68B8',
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A3F6B',
    marginBottom: 24,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4C8E8',
    marginBottom: 20,
    minWidth: '100%',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A3F6B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#7B68B8',
  },
  hint: {
    fontSize: 14,
    color: '#7B68B8',
    textAlign: 'center',
    marginBottom: 28,
  },
  primaryButton: {
    backgroundColor: '#7B68B8',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
