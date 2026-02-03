import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Building, Home, TrendingUp, User, UserPlus } from "lucide-react";
import { adminAPI } from "../../services/api";
import { useAuth } from "../../context/authContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || "Failed to load dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col sticky top-0 h-screen shadow-lg">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-2xl">
          <h1 className="text-2xl font-bold">HRMatrix</h1>
          <p className="text-xs text-blue-100 mt-1">People ops simplified</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          <NavItem
            icon={<Home size={20} />}
            label="Dashboard"
            onClick={() => navigate("/admin/dashboard")}
            active
          />
          <NavItem
            icon={<Users size={20} />}
            label="Users"
            onClick={() => navigate("/admin/users")}
          />
          <NavItem
            icon={<Building size={20} />}
            label="Business Units"
            onClick={() => navigate("/admin/companies")}
          />
          <NavItem
            icon={<TrendingUp size={20} />}
            label="Analytics"
            onClick={() => navigate("/admin/analytics")}
          />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-18 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 py-4 shadow-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              color="bg-gradient-to-r from-blue-500 to-violet-500"
              icon={<Users size={22} />}
            />
            <StatCard
              title="Total Employees"
              value={stats?.usersByRole?.find((r) => r.role === "EMPLOYEE")?.count || 0}
              color="bg-gradient-to-r from-cyan-500 to-blue-400"
              icon={<Building size={22} />}
            />
            <StatCard
              title="HR Users"
              value={stats?.usersByRole?.find((r) => r.role === "HR")?.count || 0}
              color="bg-gradient-to-r from-purple-500 to-pink-500"
              icon={<UserPlus size={22} />}
            />
            <StatCard
              title="Company Admins"
              value={stats?.usersByRole?.find((r) => r.role === "COMPANY_ADMIN")?.count || 0}
              color="bg-gradient-to-r from-yellow-400 to-orange-500"
              icon={<User size={22} />}
            />
          </div>

          {/* Business Units */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Business Units</h3>
              <div className="text-sm text-gray-500">Total: <span className="font-medium text-gray-700 dark:text-gray-300">{stats?.businessUnits?.length || 0}</span></div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Business Unit</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Employees</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">HR Assigned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats?.businessUnits?.length > 0 ? (
                    stats.businessUnits.map((bu) => (
                      <tr key={bu.company_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{bu.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{bu.employee_count}</td>
                        <td className="px-6 py-3 text-sm">
                          {bu.hr_count > 0 ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30">Assigned</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20">Unassigned</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-3 text-center text-gray-500 dark:text-gray-400">
                        No business units found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
      active
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, color, icon }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-transparent hover:border-blue-600">
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{value}</p>
      </div>
      <div className={`${color} p-4 rounded-lg text-white shadow-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
