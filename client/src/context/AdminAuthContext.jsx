import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  apiGet,
  loginWithEmailPassword,
  logoutFirebase,
  auth,
} from '../api/client.js';

const AdminAuthContext = createContext(null);

const TOKEN_KEY = 'dva-admin-token';

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = useCallback(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      auth.currentUser?.getIdToken().then((fresh) => {
        if (fresh && fresh !== t) localStorage.setItem(TOKEN_KEY, fresh);
      });
      return t;
    } catch {
      return null;
    }
  }, []);

  const verify = useCallback(async (token) => {
    const me = await apiGet(token, '/admin/me');
    setAdmin(me);
    localStorage.setItem(TOKEN_KEY, token);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    verify(token)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, [verify, getToken]);

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