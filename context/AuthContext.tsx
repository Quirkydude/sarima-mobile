import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, ApiError, setToken, clearToken, getToken } from "../services/api";

type User = {
  name: string;
  phone: string;
};

type PendingSignup = {
  name: string;
  phone: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  pendingSignup: PendingSignup | null;
  /** Throws ApiError with a user-facing message on failure. */
  startSignup: (name: string, phone: string, password: string) => Promise<void>;
  verifySignupOtp: (code: string) => Promise<boolean>;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  lastError: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "gapip_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        const token = await getToken();
        if (raw && token) setUser(JSON.parse(raw));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function startSignup(name: string, phone: string, password: string) {
    setLastError(null);
    try {
      await apiRequest("/auth/signup", { method: "POST", body: { name, phone, password } });
      setPendingSignup({ name, phone, password });
    } catch (e) {
      setLastError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
      throw e;
    }
  }

  async function verifySignupOtp(code: string): Promise<boolean> {
    if (!pendingSignup) return false;
    setLastError(null);
    try {
      const res = await apiRequest<{ token: string; user: User }>("/auth/verify-otp", {
        method: "POST",
        body: { phone: pendingSignup.phone, code },
      });
      await setToken(res.token);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
      setUser(res.user);
      setPendingSignup(null);
      return true;
    } catch (e) {
      setLastError(e instanceof ApiError ? e.message : "That code didn't work. Please try again.");
      return false;
    }
  }

  async function login(phone: string, password: string): Promise<boolean> {
    setLastError(null);
    try {
      const res = await apiRequest<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: { phone, password },
      });
      await setToken(res.token);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
      setUser(res.user);
      return true;
    } catch (e) {
      setLastError(e instanceof ApiError ? e.message : "Couldn't log in. Please try again.");
      return false;
    }
  }

  async function logout() {
    await clearToken();
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, pendingSignup, startSignup, verifySignupOtp, login, logout, lastError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
