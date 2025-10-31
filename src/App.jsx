
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Patient/PatientDashboard";
import Profile from "./pages/Patient/PatientProfile";
import Settings from "./pages/Settings.jsx";
import DashboardLayout from "./layouts/PatientLayout";
import "./index.css";
import Landing from "./pages/Landing";
import PatientLogin from "./pages/Authentication/PatientLogin";
import DoctorLogin from "./pages/Authentication/DoctorLogin";
import AdminLogin from "./pages/Authentication/AdminLogin";
import SignUp from "./pages/Authentication/SignUp";
import { ProtectedRoute, PublicRoute } from "./components/guards/ProtectedRoutes";
import { Navigate } from "react-router-dom";
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorMedicalRecords from "./pages/Doctor/DoctorMedicalRecords";
import DoctorPatients from "./pages/Doctor/DoctorPatients";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DoctorsList from "./pages/Admin/DoctorsList";
import PatientsList from "./pages/Admin/PatientsList";
import AppointmentsList from "./pages/Admin/AppointmentsList";

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
              <DoctorLayout>
                <DoctorDashboard />
              </DoctorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedUserTypes={["doctor"]}>
              <DoctorLayout>
                <DoctorAppointments />
              </DoctorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/medical-records"
          element={
            <ProtectedRoute allowedUserTypes={["doctor"]}>
              <DoctorLayout>
                <DoctorMedicalRecords />
              </DoctorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedUserTypes={["doctor"]}>
              <DoctorLayout>
                <DoctorPatients />
              </DoctorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedUserTypes={["admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedUserTypes={["admin"]}>
              <AdminLayout>
                <DoctorsList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedUserTypes={["admin"]}>
              <AdminLayout>
                <PatientsList/>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedUserTypes={["admin"]}>
              <AdminLayout>
                <AppointmentsList />
              </AdminLayout>
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
