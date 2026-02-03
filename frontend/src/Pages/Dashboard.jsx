import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect based on user role
    if (user?.role === "EMPLOYEE") {
      navigate("/employee/dashboard");
    } else if (user?.role === "HR") {
      navigate("/hr/dashboard");
    } else if (user?.role === "COMPANY_ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-900/40 dark:via-slate-900/20 dark:to-slate-900/40">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Redirecting...</p>
      </div>
    </div>
  );
};

export default Dashboard;