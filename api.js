/**
 * API service for Pregnancy App
 * Uses EXPO_PUBLIC_API_BASE_URL from .env
 */
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

function url(path) {
  return `${API_BASE.replace(/\/$/, '')}${path}`;
}

export async function getWeek(week) {
  const res = await fetch(url(`/api/weeks/${week}`));
  if (!res.ok) throw new Error('Failed to fetch week');
  return res.json();
}

export async function getAllWeeks() {
  const res = await fetch(url('/api/weeks'));
  if (!res.ok) throw new Error('Failed to fetch weeks');
  return res.json();
}

export async function getTipOfDay() {
  const res = await fetch(url('/api/tips/daily'));
  if (!res.ok) throw new Error('Failed to fetch tip');
  return res.json();
}

export async function getArticleOfDay() {
  const res = await fetch(url('/api/articles/daily'));
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}

export async function getArticles(category) {
  const path = category ? `/api/articles?category=${encodeURIComponent(category)}` : '/api/articles';
  const res = await fetch(url(path));
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function getArticle(id) {
  const res = await fetch(url(`/api/articles/${id}`));
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}

export async function chat(message, history = [], userId) {
  const res = await fetch(url('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, userId }),
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}

export async function getAccount(email) {
  const res = await fetch(url(`/api/accounts/${encodeURIComponent(email)}`));
  if (!res.ok) return null;
  return res.json();
}

export async function updateAccount(email, data) {
  const res = await fetch(url(`/api/accounts/${encodeURIComponent(email)}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}
