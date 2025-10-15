import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes with sidebar */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
