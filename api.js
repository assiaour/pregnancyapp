/**
 * API service for Pregnancy App
 * Uses EXPO_PUBLIC_API_BASE_URL from .env
 */
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const API_FALLBACK = 'https://pregnancyapp.onrender.com';

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
    const msg =
      data?.reply ||
      data?.error?.message ||
      data?.error ||
      data?.message ||
      `Chat failed (${res.status})`;
    throw new Error(msg);
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
