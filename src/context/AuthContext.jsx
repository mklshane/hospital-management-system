import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedType = localStorage.getItem("userType");

    if (token && storedUser && storedType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedType);
    }
    setLoading(false);
  }, []);

  const login = (userData, type, token) => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userType", type);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    window.location.href = "/login";
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{ user, userType, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
