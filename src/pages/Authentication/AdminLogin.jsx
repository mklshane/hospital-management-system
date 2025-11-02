import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axiosHeader";
import AuthNav from "../../components/Authentication/Nav";
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
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
      const res = await api.post("/auth/admin/login", formData);
      await login(res.data.user, "admin");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
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
          <div className=" hidden w-[85%] mx-auto lg:flex items-start justify-center p-10 relative rounded-2xl bg-gradient-to-br from-blue-400 via-blue-700 to-blue-200">
            <div className="text-white max-w-sm z-10 ">
              <h2 className="text-lg">Welcome, Admin!</h2>
              <h1 className="text-2xl font-semibold mt-2">
                Manage users, system settings, and records all in one secure
                space
              </h1>
            </div>
            <div className="absolute left-12 bottom-0">
              <img src="/admin.png" alt="" className="w-auto h-72" />
            </div>
          </div>

          {/* Right Section */}
          <div className="p-10 w-[100%] mx-auto border-2 border-[#e7e7e7f0] rounded-2xl">
            <h2 className="text-2xl font-semibold mb-1 text-black">
              Admin Login
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Enter your credentials to access the admin dashboard
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
                    className="w-full text-black mt-1 px-4 py-2 border border-[#cecececa]  rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                      className="w-full text-black mt-1 px-4 py-2 border border-[#cecececa] rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
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

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-[#cecececa]"></div>
              <span className="px-4 text-sm text-gray-500">or login as</span>
              <div className="flex-grow border-t border-[#cecececa]"></div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-2 border border-[#cecececa] text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                onClick={() => navigate("/doctor/login")}
              >
                Doctor
              </button>
              <button
                className="flex-1 py-2 border border-[#cecececa] text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                onClick={() => navigate("/login")}
              >
                Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
