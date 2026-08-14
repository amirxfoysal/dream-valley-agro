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