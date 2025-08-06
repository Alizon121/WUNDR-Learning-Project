"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'parent' | 'volunteer' | 'admin' | 'instructor';
  city: string;
  state: string;
  zipCode: number;
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  isLoggedIn: boolean;
  logout: () => void;
  loginWithToken: (token: string, user?: User) => void;
  token: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  //save user
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  //save token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
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
    <AuthContext.Provider value={{ user, setUser, isLoggedIn: !!user, logout, loginWithToken, token }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
