
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings.jsx";
import DashboardLayout from "./layouts/DashboardLayout";
import "./index.css";
import Landing from "./pages/Landing";
import PatientLogin from "./pages/Authentication/PatientLogin";
import DoctorLogin from "./pages/Authentication/DoctorLogin";
import AdminLogin from "./pages/Authentication/AdminLogin";
import SignUp from "./pages/Authentication/SignUp";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/ui/guards/ProtectedRoutes";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute restrictedTo={["patient"]}>
              <PatientLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/doctor/login"
          element={
            <PublicRoute restrictedTo={["doctor"]}>
              <DoctorLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            <PublicRoute restrictedTo={["admin"]}>
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedUserTypes={["patient"]}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedUserTypes={["doctor"]}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedUserTypes={["admin"]}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedUserTypes={["patient", "doctor", "admin"]}>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedUserTypes={["patient", "doctor", "admin"]}>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
