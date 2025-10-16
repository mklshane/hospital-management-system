import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axiosHeader";
import AuthNav from "./Nav";

import { Eye, EyeOff } from "lucide-react";


const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/patient/login", formData);
      await login(res.data.user, "patient");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.message || "Login failed. Please try again.";
      setError(errorMessage);

      if (error.isNetworkError) {
        setError(
          "Unable to connect to server. Please check your internet connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <div className="w-full">
        <AuthNav />
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center py-8 px-4 mt-5">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
          {/* Left Section */}
          <div className=" hidden w-[85%] mx-auto lg:flex items-start justify-center p-10 relative rounded-2xl bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400">
            <div className="text-white max-w-sm z-10 mt-8">
              <h2 className="text-lg">Streamline Your Healthcare</h2>
              <h1 className="text-2xl font-semibold mt-2">
                Book appointments, view records, and manage your care securely
              </h1>
            </div>
            <div className="absolute left-8 bottom-0">
              <img src="/patient.png" alt="" className="w-auto h-70" />
            </div>
          </div>

          {/* Right Section */}
          <div className="p-10 w-[100%] mx-auto border-2 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-1">Patient Login</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Access your medical records, appointments, and hospital services
              securely.
            </p>

            <form className="space-y-2" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full mt-1 px-4 py-2 border rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full mt-1 px-4 py-2 border rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t"></div>
              <span className="px-4 text-sm text-gray-500">or login as</span>
              <div className="flex-grow border-t"></div>
            </div>

            {/* Admin / Doctor Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                onClick={() => navigate("/admin/login")}
              >
                Admin
              </button>
              <button
                className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                onClick={() => navigate("/doctor/login")}
              >
                Doctor
              </button>
            </div>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
