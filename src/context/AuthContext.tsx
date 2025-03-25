"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getToken, login, logout, register } from "@/services/api";
import {jwtDecode} from "jwt-decode"; // Install dulu dengan `npm install jwt-decode`

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loginUser: (username: string, password: string) => Promise<void>;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | string>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ id: decoded.user_id, username: decoded.username });
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null); // Set user null jika token invalid
      }
    }
  }, []);
  

  const loginUser = async (username: string, password: string) => {
    try {
      const token = await login(username, password);
      console.log("Token yang diterima:", token);
  
      if (!token || typeof token !== "string") {
        throw new Error("Token tidak valid atau tidak ditemukan");
      }
  
      const decoded: any = jwtDecode(token);
      console.log("Decoded token:", decoded);
  
      setUser({ id: decoded.user_id, username: decoded.username });
    } catch (error) {
      console.error("Login gagal:", error.message);
    }
  };
  

  const registerUser = async (username: string, email: string, password: string) => {
    await register(username, email, password);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

