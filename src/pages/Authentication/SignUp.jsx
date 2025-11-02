import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axiosHeader";
import AuthNav from "../../components/Authentication/Nav";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      const numericValue = value.replace(/[^\d]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (error) setError("");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;

      // 1. Register
      await api.post("/auth/patient/register", submitData);

      // 2. Auto-login
      const loginRes = await api.post("/auth/patient/login", {
        email: formData.email,
        password: formData.password,
      });

      const { user, token } = loginRes.data;

      // 3. Save to context + localStorage
      login(user, "patient", token);

      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full">
        <AuthNav />
      </div>

      <div className="flex flex-1 items-center justify-center py-8 px-4 mt-5">
        <div className="max-w-xl w-full flex flex-col bg-gray-50">
          <div className="w-full flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 mb-6">
            <div className="text-white text-center max-w-lg">
              <h2 className="text-lg font-semibold">
                Join Our Healthcare Community
              </h2>
              <h1 className="text-xl font-semibold mt-2">
                Create your account to access personalized healthcare services
                and manage your medical journey
              </h1>
            </div>
          </div>

          <div className="p-8 w-full border-2 border-[#e7e7e7f0] rounded-2xl">
            <h2 className="text-2xl font-semibold mb-1 text-black">Sign Up</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Create your account to access medical records, appointments, and
              hospital services securely.
            </p>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="text-black w-full mt-1 px-4 py-2 border border-[#cecececa] rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="text-black w-full mt-1 px-4 py-2 border border-[#cecececa] rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Age *
                    </label>
                    <input
                      name="age"
                      type="text"
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-black w-full mt-1 px-4 py-2 border border-[#cecececa] rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      onKeyPress={(e) =>
                        !/[0-9]/.test(e.key) && e.preventDefault()
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      required
                      onChange={handleChange}
                      disabled={loading}
                      className="text-black w-full mt-1 px-4 py-2 border border-[#cecececa] rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Contact Number *
                  </label>
                  <input
                    name="contact"
                    type="tel"
                    required
                    placeholder="09123456789"
                    value={formData.contact}
                    onChange={handleChange}
                    disabled={loading}
                    className="text-black w-full mt-1 px-4 py-2 border border-[#cecececa] rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                    rows={3}
                    className="text-black w-full mt-1 px-4 py-2 border border-[#cecececa] rounded-lg max-h-18 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="relative">
                  <label className="text-sm font-medium text-gray-700">
                    Password *
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
                      className="text-black w-full mt-1 px-4 py-2 border border-[#cecececa] rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
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

                <div className="relative">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-black w-full mt-1 px-4 py-2 border border-[#cecececa] rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
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
                className="w-full py-2 rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition disabled:opacity-50 mt-5"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
