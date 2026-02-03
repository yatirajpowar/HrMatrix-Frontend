import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Logic to call your backend API
    console.log("Sending reset link to:", email);
    
    // Simulate API success
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-10"
      >
        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-2 text-center">
              Reset Password
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-violet-700 transition duration-200 shadow-lg"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Check your email</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-violet-600 hover:underline dark:text-violet-400 font-medium">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;