import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  apiGet,
  loginWithEmailPassword,
  logoutFirebase,
  auth,
  ADMIN_TOKEN_KEY,
} from '../api/client.js';

const AdminAuthContext = createContext(null);

const TOKEN_KEY = ADMIN_TOKEN_KEY;

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const verify = useCallback(async (token) => {
    const me = await apiGet(token, '/admin/me');
    setAdmin(me);
    localStorage.setItem(TOKEN_KEY, token);
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Firebase restores the session asynchronously; wait for it so we verify
    // with a fresh token instead of a stale one that may have expired.
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      const cached = localStorage.getItem(TOKEN_KEY);
      if (!fbUser && !cached) {
        setLoading(false);
        return;
      }
      const token = fbUser ? await fbUser.getIdToken() : cached;
      if (cancelled) return;
      if (!token) {
        setLoading(false);
        return;
      }
      verify(token)
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          setAdmin(null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, [verify]);

  const login = async (email, password) => {
    setError('');
    const token = await loginWithEmailPassword(email, password);
    await verify(token);
    return token;
  };

  const logout = async () => {
    await logoutFirebase().catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, error, setError, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
