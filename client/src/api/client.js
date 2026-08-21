import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../firebase.js';

export const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const auth = getAuth(app);

export const timeoutFetch = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    if (!res.ok) {
      const err = new Error(body?.error || `Request failed (${res.status})`);
      err.status = res.status;
      err.body = body;
      throw err;
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
};

export const loginWithEmailPassword = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user.getIdToken();
};

export const logoutFirebase = () => signOut(auth);

export const ADMIN_TOKEN_KEY = 'dva-admin-token';

// Firebase ID tokens expire after ~1h; always prefer a fresh one when the
// Firebase session is alive, and keep the cached copy in sync.
export const getAdminToken = async () => {
  try {
    const fresh = await auth.currentUser?.getIdToken();
    if (fresh) {
      localStorage.setItem(ADMIN_TOKEN_KEY, fresh);
      return fresh;
    }
  } catch {
    /* fall through to cached token */
  }
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

// Public (unauthenticated) GET with timeout + one retry, so a cold-started
// or briefly unavailable API doesn't leave pages empty until a manual refresh.
export const fetchPublicJson = async (path, signal) => {
  const doFetch = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort, { once: true });
    try {
      const res = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return await res.json();
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }
  };

  try {
    return await doFetch();
  } catch (err) {
    const retryable =
      !signal?.aborted && (err.status === undefined || err.status === 429 || err.status >= 500);
    if (!retryable) throw err;
    await new Promise((resolve) => setTimeout(resolve, 700));
    return await doFetch();
  }
};

export const apiGet = (token, path) =>
  timeoutFetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const apiPost = (token, path, data) =>
  timeoutFetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

export const apiPut = (token, path, data) =>
  timeoutFetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

export const apiPatch = (token, path, data) =>
  timeoutFetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

export const apiDelete = (token, path) =>
  timeoutFetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

// Multipart file upload (JSON response expected).
export const apiUpload = (token, path, file) => {
  const form = new FormData();
  form.append('file', file);
  return timeoutFetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
};

// Resolve API-relative media URLs (e.g. /api/uploads/xyz) against the API origin,
// leaving absolute and inline URLs untouched.
export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  const origin = BASE_URL.replace(/\/api\/?$/i, '');
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
};