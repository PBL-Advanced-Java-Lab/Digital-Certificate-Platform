"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, AuthResponse, tokenStorage, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isIssuer: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (fullName: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from token on mount
  useEffect(() => {
    const savedToken = tokenStorage.get();
    if (savedToken) {
      setToken(savedToken);
      api.auth
        .getProfile()
        .then((profile) => {
          setUser(profile);
        })
        .catch(() => {
          // Token expired or invalid
          tokenStorage.remove();
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.auth.login(email, password);
    tokenStorage.set(response.token);
    setToken(response.token);
    setUser({
      id: response.id,
      fullName: response.fullName,
      email: response.email,
      roles: response.roles,
    });
    return response;
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await api.auth.register(fullName, email, password);
    tokenStorage.set(response.token);
    setToken(response.token);
    setUser({
      id: response.id,
      fullName: response.fullName,
      email: response.email,
      roles: response.roles,
    });
    return response;
  };

  const logout = () => {
    tokenStorage.remove();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await api.auth.getProfile();
      setUser(profile);
    } catch {
      logout();
    }
  };

  const hasRole = (roleName: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some((r) => r === roleName || r === `ROLE_${roleName}`);
  };

  const isIssuer = hasRole("VERIFIED_ISSUER");
  const isAdmin = hasRole("SYSTEM_ADMIN");

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isIssuer,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
