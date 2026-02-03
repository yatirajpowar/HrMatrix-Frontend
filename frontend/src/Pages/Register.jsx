import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
    company_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password, confirmPassword, role, company_id } = formData;

    // Validation
    if (!name || !email || !password || !confirmPassword || !company_id) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 Registering with:", { name, email, role, company_id });
      const result = await register(name, email, password, confirmPassword, role, company_id);
      console.log("✅ Registration response:", result);
      if (result.success) {
        alert("Registration Successful!");
        navigate("/login");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-100 via-blue-50 to-white 
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* LEFT SIDE – BRANDING */}
      <div className="hidden md:flex w-1/3 items-center justify-center relative overflow-hidden bg-violet-600">
        <div className="absolute w-64 h-64 bg-white opacity-10 rounded-full -top-10 -left-10"></div>
        <div className="z-10 text-center px-10 text-white">
          <h1 className="text-4xl font-bold mb-4"> HRMatrix</h1>
          <p className="opacity-80">Streamline your corporate journey with our unified HR solution.</p>
        </div>
      </div>

      {/* RIGHT SIDE – REGISTER FORM */}
      <div className="w-full md:w-2/3 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-10"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-500 mb-2">
              {formData.role === "EMPLOYEE" ? "Employee Registration" : "HR Registration"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create an account to access HRMatrix features.</p>

            {/* Pill-style role selector */}
            <div className="inline-flex items-center rounded-full p-1 bg-gray-100 dark:bg-gray-800/60 shadow-sm">
              <button
                type="button"
                aria-pressed={formData.role === "EMPLOYEE"}
                onClick={() => setFormData({ ...formData, role: "EMPLOYEE" })}
                className={
                  (formData.role === "EMPLOYEE"
                    ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg transform scale-105"
                    : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700") +
                  " px-5 py-2 rounded-full text-sm font-medium transition-all duration-150"
                }
              >
                Employee
              </button>

              <button
                type="button"
                aria-pressed={formData.role === "HR"}
                onClick={() => setFormData({ ...formData, role: "HR" })}
                className={
                  (formData.role === "HR"
                    ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg transform scale-105"
                    : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700") +
                  " px-5 py-2 rounded-full text-sm font-medium transition-all duration-150"
                }
              >
                HR
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Select your role and create your account.</div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleRegister}>
            {/* FULL NAME */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="john@company.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                required
              />
            </div>

            {/* BUSINESS UNIT */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company_Code *</label>
              <input
                type="number"
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                // min="1"
                // max="4"
                // placeholder=""
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                required
              />
            </div>

            {/* REGISTER BUTTON */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-violet-700 transition duration-200 shadow-lg disabled:bg-violet-400"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* BACK TO LOGIN LINK */}
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 hover:underline dark:text-violet-400 font-medium">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;