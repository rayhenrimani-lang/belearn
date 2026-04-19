import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearSession,
  getStoredToken,
  getStoredUserEmail,
  saveSession,
} from '../services/authStorage';
import {
  fetchUsersRequest,
  loginRequest,
  registerThenLogin,
  type UserRow,
} from '../services/authApi';
import { ApiError } from '../services/api';

type AuthContextValue = {
  token: string | null;
  userEmail: string | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Recharge token / email depuis AsyncStorage (après login hors context). */
  refreshSession: () => Promise<void>;
  loadUsers: () => Promise<UserRow[]>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, e] = await Promise.all([getStoredToken(), getStoredUserEmail()]);
        if (!cancelled) {
          setToken(t);
          setUserEmail(e);
        }
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const jwt = await loginRequest(email, password);
    await saveSession(jwt, email);
    setToken(jwt);
    setUserEmail(email);
  }, []);

  /** POST register → POST login → persistance JWT → navigation vers Accueil (via état token). */
  const register = useCallback(async (email: string, password: string) => {
    const jwt = await registerThenLogin(email, password);
    await saveSession(jwt, email);
    setToken(jwt);
    setUserEmail(email);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setToken(null);
    setUserEmail(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const [t, e] = await Promise.all([getStoredToken(), getStoredUserEmail()]);
    setToken(t);
    setUserEmail(e);
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      return await fetchUsersRequest();
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        await clearSession();
        setToken(null);
        setUserEmail(null);
      }
      throw e;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      userEmail,
      isReady,
      login,
      register,
      logout,
      refreshSession,
      loadUsers,
    }),
    [token, userEmail, isReady, login, register, logout, refreshSession, loadUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
