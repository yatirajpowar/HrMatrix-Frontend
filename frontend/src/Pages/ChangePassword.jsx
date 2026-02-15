import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { authAPI } from "../Services/Api";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate inputs
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.changePassword(
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      if (response.success) {
        setSuccess(true);
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });


        // Redirect to dashboard after successful password change
        setTimeout(() => {
          const roleDashboards = {
            EMPLOYEE: "/employee/dashboard",
            HR: "/hr/dashboard",
            COMPANY_ADMIN: "/admin/dashboard",
          };
          navigate(roleDashboards[user?.role] || "/dashboard");
        }, 1500);
      } else {
        setError(response.message || "Failed to change password");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to change password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
            Change Password
          </h1>
          <p className="text-center text-slate-600 mb-6">
            Please set a new password to continue
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700 text-sm">
              Password changed successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                >
                  {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 rounded-lg transition mt-6"
            >
              {loading ? "Updating..." : success ? "Password Updated!" : "Change Password"}
            </button>
          </form>

          {/* Logout Option */}
          <button
            onClick={logout}
            className="w-full mt-4 text-slate-600 hover:text-slate-900 text-sm font-medium py-2 border border-slate-300 rounded-lg transition hover:bg-slate-50"
          >
            Logout
          </button>

          <p className="text-center text-xs text-slate-500 mt-4">
            This password must be set before you can access your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
