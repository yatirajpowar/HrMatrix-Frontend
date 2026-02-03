import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // This grabs the token from the URL (e.g., ?token=123xyz)
  const token = searchParams.get("token");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await authAPI.setPasswordWithToken(token, password, confirmPassword);
      if (res.success) {
        alert("Password updated successfully!");
        navigate("/login");
      } else {
        alert(res.message || "Failed to update password");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Error updating password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-10"
      >
        <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-2 text-center">
          Create New Password
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Please enter your new secure password below.
        </p>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-violet-700 transition duration-200"
          >
            Update Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;