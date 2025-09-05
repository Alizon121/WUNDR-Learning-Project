"use client"
import { User } from "@/types/user";
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  loginWithToken: (token: string, user?: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const isLoggedIn = !!token

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  //save user
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  //save token
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

   const loginWithToken = (token: string, user?: User) => {
    setToken(token);
    if (user) {
      setUser(user);
    }
    // Если backend не возвращает user — можешь декодировать токен и вытянуть инфу о пользователе
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

    return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, logout, loginWithToken, token }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
