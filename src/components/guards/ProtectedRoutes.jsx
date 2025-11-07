import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children, allowedUserTypes }) => {
  const { isAuthenticated, loading, userType } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    const redirectPath = getDashboardPath(userType);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export const PublicRoute = ({ children, restrictedTo }) => {
  const { isAuthenticated, loading, userType } = useAuth();

  if (loading) { /* show spinner */ }

  if (isAuthenticated()) {
    const redirectPath = getDashboardPath(userType);
    return <Navigate to={redirectPath} replace />;
  }

  if (restrictedTo && userType && !restrictedTo.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const getDashboardPath = (userType) => {
  switch (userType) {
    case "patient":
      return "/dashboard";
    case "doctor":
      return "/doctor/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/"; 
  }
};
