import Constants from 'expo-constants';

const API_PRODUCTION = 'https://pregnancyapp.onrender.com';

// Improved safety for initial boot
const getApiBase = () => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) return process.env.EXPO_PUBLIC_API_BASE_URL;

  // In local development we want to hit the local backend, not the deployed Render API.
  // This prevents "I changed the server code but the app still uses the old version".
  //
  // React Native/Expo environments vary on whether `__DEV__` is defined in this module,
  // so we check multiple signals.
  const isDev =
    (typeof __DEV__ !== 'undefined' && __DEV__) ||
    process.env.NODE_ENV === 'development';
  if (isDev) {
    // From emulators/real devices, `localhost` usually points to the device itself.
    // Expo provides a debugger host that points back to your machine.
    const debuggerHost = Constants.manifest?.debuggerHost || Constants.expoConfig?.debuggerHost;
    const host = debuggerHost ? String(debuggerHost).split(':')[0] : 'localhost';
    return `http://${host}:3000`;
  }
  
  const extra = Constants.expoConfig?.extra || Constants.manifest?.extra;
  if (extra?.apiUrl) return extra.apiUrl;
  
  return 'http://localhost:3000';
};

const API_BASE = getApiBase();
const API_FALLBACK = API_PRODUCTION;
console.log('[api.js] API_BASE =', API_BASE);

const isDev =
  (typeof __DEV__ !== 'undefined' && __DEV__) || process.env.NODE_ENV === 'development';

// If the dev client is pointed at the wrong machine IP, still try other reachable local hosts
// before falling back to the deployed production API.
const DEV_LOCAL_BASES = isDev
  ? [
      'http://192.168.1.7:3000',
      'http://localhost:3000',
      // keep the expo-provided host as a last resort (may be correct on some networks)
      (() => {
        const dbg = Constants.manifest?.debuggerHost || Constants.expoConfig?.debuggerHost;
        if (!dbg) return null;
        return `http://${String(dbg).split(':')[0]}:3000`;
      })(),
    ].filter(Boolean)
  : [];

function url(path) {
  return `${API_BASE.replace(/\/$/, '')}${path}`;
}

function fallbackUrl(path) {
  return `${API_FALLBACK.replace(/\/$/, '')}${path}`;
}

function shouldTryFallback(err) {
  const msg = (err && err.message ? err.message : '').toLowerCase();
  return msg.includes('network request failed') || msg.includes('failed to fetch');
}

async function fetchWithFallback(path, options) {
  try {
    return await fetch(url(path), options);
  } catch (err) {
    if (!shouldTryFallback(err)) throw err;
    // In dev, retry local backends first (useful when debuggerHost/IP is wrong).
    for (const base of DEV_LOCAL_BASES) {
      try {
        return await fetch(`${base.replace(/\/$/, '')}${path}`, options);
      } catch (_) {
        // try next
      }
    }
    return fetch(fallbackUrl(path), options);
  }
}

export async function getWeek(week) {
  const res = await fetchWithFallback(`/api/weeks/${week}`);
  if (!res.ok) throw new Error('Failed to fetch week');
  return res.json();
}

export async function getAllWeeks() {
  const res = await fetchWithFallback('/api/weeks');
  if (!res.ok) throw new Error('Failed to fetch weeks');
  return res.json();
}

export async function getTipOfDay() {
  const res = await fetchWithFallback('/api/tips/daily');
  if (!res.ok) throw new Error('Failed to fetch tip');
  return res.json();
}

export async function getArticleOfDay() {
  const res = await fetchWithFallback('/api/articles/daily');
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}

export async function getArticles(category) {
  const path = category ? `/api/articles?category=${encodeURIComponent(category)}` : '/api/articles';
  const res = await fetchWithFallback(path);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function getArticle(id) {
  const res = await fetchWithFallback(`/api/articles/${id}`);
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}

export async function chat(message, history = [], userId) {
  const res = await fetchWithFallback('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, userId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const raw =
      data?.reply ||
      data?.error?.message ||
      data?.error ||
      data?.message ||
      `Chat failed (${res.status})`;

    const rawStr = raw == null ? '' : String(raw);
    const lower = rawStr.toLowerCase();
    const looksLikeGeminiPayload =
      lower.includes('generativelanguage.googleapis.com') ||
      lower.includes('googlegenerativeai error') ||
      lower.includes('generatecontent') ||
      lower.includes('models/gemini') ||
      (rawStr.trim().startsWith('{') && rawStr.trim().endsWith('}'));

    const friendly =
      res.status === 429 || data?.code === 'GEMINI_QUOTA_EXCEEDED'
        ? "Le chatbot est temporairement indisponible (quota dépassé). Réessayez dans quelques minutes."
        : looksLikeGeminiPayload
          ? "Désolé, le chatbot rencontre un problème temporaire. Réessayez dans quelques minutes."
          : rawStr || `Chat failed (${res.status})`;

    throw new Error(friendly);
  }
  return res.json();
}

export async function getAccount(email) {
  const res = await fetchWithFallback(`/api/accounts/${encodeURIComponent(email)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function updateAccount(email, data) {
  const res = await fetchWithFallback(`/api/accounts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}
