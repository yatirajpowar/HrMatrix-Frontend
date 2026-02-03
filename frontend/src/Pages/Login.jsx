import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Navigate to dashboard based on role
        navigate("/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* LEFT SIDE – BRANDING */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute w-80 h-80 bg-violet-400 opacity-20 rounded-full -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-blue-400 opacity-10 rounded-full bottom-10 right-10"></div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="z-10 text-center px-10"
        >
          <h1 className="text-4xl font-bold text-violet-700 dark:text-violet-400 mb-4">
            HRMatrix!!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Smart HRM • Secure Access • Corporate Control
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE – LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-10"
        >
          <h2 className="text-center text-2xl font-bold text-violet-700 dark:text-violet-400 mb-2">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Sign in to continue
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Added onSubmit handler */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* FIXED FORGOT PASSWORD: Changed <a> to <Link> */}
            <div className="text-right">
              <Link
                to="/forgotpassword"
                className="text-sm text-violet-600 hover:underline dark:text-violet-400"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-violet-700 transition duration-200 disabled:bg-violet-400"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
              Don't have an account...?{" "}
              <Link
              to="/register"
              className="text-violet-600 hover:underline dark:text-violet-400 font-medium">
                Create Account
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;