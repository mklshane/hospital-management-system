import React, { createContext, useState, useContext, useEffect } from "react";
import axiosHeader from "@/lib/axiosHeader";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadUser = async () => {
    const storedUser = localStorage.getItem("user");
    const storedUserType = localStorage.getItem("userType");

    if (storedUser && storedUserType) {
      try {
        setUser(JSON.parse(storedUser));
        setUserType(storedUserType);
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
      }
    } else {
      // THIS IS THE MISSING PART
      try {
        const res = await axiosHeader.get("/auth/verify", {
          withCredentials: true,
        });

        if (res.data.authenticated) {
          const { user, userType } = res.data;
          setUser(user);
          setUserType(userType);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userType", userType);
        }
      } catch (err) {
        console.log("No session:", err.response?.data?.message);
      }
    }

    setLoading(false);
  };

  loadUser();
}, []);

  const login = async (userData, type) => {

    setUser(userData);
    setUserType(type);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userType", type);

  };
  const logout = async () => {
    try {
      await axiosHeader.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setUserType(null);
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    userType,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
