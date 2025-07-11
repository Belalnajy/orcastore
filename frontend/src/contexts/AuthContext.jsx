"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from "react";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const AUTH_TOKEN_KEY = "auth_token";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAuthToken = useCallback(() => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.userId, name: decoded.name });
          setAuthToken(token);
        } else {
          // Token is expired
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setUser(null);
          setAuthToken(null);
        }
      }
    } catch (error) {
      console.error("Failed to load auth token:", error);
      setUser(null);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(
    () => {
      loadAuthToken();
    },
    [loadAuthToken]
  );

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { token } = await response.json();
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      const decoded = jwtDecode(token);
      setUser({ id: decoded.userId, name: decoded.name });
      setAuthToken(token);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setAuthToken(null);
    // Optionally, redirect or clear other state
  };

  const value = {
    user,
    authToken,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
