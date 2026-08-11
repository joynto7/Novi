"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import api, { ApiRequestError } from "@/lib/api";
import { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: (role: "user" | "admin") => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get<{ data: User }>("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ data: { user: User } }>("/auth/login", { email, password });
    setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<{ data: { user: User } }>("/auth/register", { name, email, password });
    setUser(res.data.user);
  };

  const demoLogin = async (role: "user" | "admin") => {
    const res = await api.post<{ data: { user: User } }>("/auth/demo-login", { role });
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => undefined);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, demoLogin, logout, refreshUser, updateUser: setUser }}
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

export { ApiRequestError };
