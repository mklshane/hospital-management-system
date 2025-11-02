
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
    return <Navigate to={'/'} replace />;
  }

  // Check if userType is allowed for this route
  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    // Redirect to appropriate dashboard based on userType
    const redirectPath = getDashboardPath(userType);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Public Route - Only accessible when NOT logged in
export const PublicRoute = ({ children, restrictedTo }) => {
  const { isAuthenticated, loading, userType } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isAuthenticated()) {
  const redirectPath = getDashboardPath(userType);
  return <Navigate to={redirectPath} replace />;
}

// Do NOT redirect if login failed or userType is null
return children;
};

// Helper function to determine dashboard path based on userType
const getDashboardPath = (userType) => {
  switch (userType) {
    case "patient":
      return "/dashboard";
    case "doctor":
      return "/doctor/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/login"; 
  }
};

