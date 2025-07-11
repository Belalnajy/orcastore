'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Create the auth context
const AuthContext = createContext();

// API URLs
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/`;
const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}auth/login`,
  LOGOUT: `${API_BASE_URL}auth/logout`,
  PROFILE: `${API_BASE_URL}auth/profile`,
  REFRESH: `${API_BASE_URL}auth/token/refresh`
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check if there's a token in localStorage
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          try {
            // Try to fetch user profile to verify authentication
            const response = await fetch(AUTH_ENDPOINTS.PROFILE, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else {
              // Token is invalid, clear it
              localStorage.removeItem('auth_token');
            }
          } catch (error) {
            console.error('Error verifying authentication:', error);
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Format credentials for the API
      const loginData = {
        email: email,
        password: password
      };
      
      // Call the login API
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store the access token
      localStorage.setItem('auth_token', data.token);
      
      // Store refresh token if needed
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      
      // Set the user data
      setUser(data.user);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        // Call logout endpoint to invalidate token on server
        await fetch(AUTH_ENDPOINTS.LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Clear tokens from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      
      // Clear user state
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server request fails, clear local state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      return { success: true };
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  // Check if user is a superuser/admin
  const isSuperuser = useCallback(() => {
    return user && user.isAdmin === true;
  }, [user]);

  // Auth context value
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isSuperuser
  }), [user, loading, login, logout, isAuthenticated, isSuperuser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
