import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error loading user from localStorage:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);

      if (response.success) {
        const { token, user } = response;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setToken(token);
        setUser(user);

        return { success: true };
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password, confirmPassword, role = "EMPLOYEE", company_id) => {
    try {
      setError(null);
      console.log("📤 AuthContext.register sending:", { name, email, role, company_id });
      const response = await authAPI.register(name, email, password, confirmPassword, role, company_id);
      console.log("📥 Backend response:", response);

      if (response.success) {
        const { token, user } = response;
        console.log("💾 Storing user in localStorage:", user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        setUser(user);
        return { success: true };
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
