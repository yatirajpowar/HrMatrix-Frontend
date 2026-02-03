import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Calendar, Home, Clock } from "lucide-react";
import { hrAPI } from "../../services/api";
import { useAuth } from "../../context/authContext";
import Events from "./Events";

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Load stats - handle potential errors gracefully
      try {
        const statsRes = await hrAPI.getDashboardStats();
        if (statsRes && statsRes.success) {
          setStats(statsRes.data);
        } else {
          console.warn("Dashboard stats response unsuccessful:", statsRes?.message);
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setStats(null); // Set to null so we can show partial dashboard
      }

      // Load attendance stats - handle potential errors gracefully
      try {
        const attRes = await hrAPI.getAttendanceStats();
        if (attRes && attRes.success) {
          setAttendance(attRes.data || []);
        } else {
          console.warn("Attendance stats response unsuccessful:", attRes?.message);
        }
      } catch (err) {
        console.error("Error loading attendance stats:", err);
        setAttendance([]); // Set to empty array so we can show partial dashboard
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Error loading dashboard data. Some data may not be available.");
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
    <div className="flex h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-violet-950 dark:to-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-lg">
        <div className="p-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-2xl">
          <h1 className="text-2xl font-bold">HRMatrix</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          <NavItem
            icon={<Home size={20} />}
            label="Dashboard"
            onClick={() => navigate("/hr/dashboard")}
            active
          />
          <NavItem
            icon={<Users size={20} />}
            label="Employees"
            onClick={() => navigate("/hr/employees")}
          />
          <NavItem
            icon={<Calendar size={20} />}
            label="Leave Requests"
            onClick={() => navigate("/hr/leaves")}
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
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">HR Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0) || "H"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Employees"
              value={stats?.totalEmployees || 0}
              color="bg-blue-500"
            />
            <StatCard
              title="Pending Leaves"
              value={stats?.pendingLeaves || 0}
              color="bg-yellow-500"
            />
            <StatCard
              title="Approved Leaves (This Month)"
              value={stats?.approvedLeaves || 0}
              color="bg-green-500"
            />
            <StatCard
              title="Leave Requests"
              value={stats?.leaveDistribution?.length || 0}
              color="bg-purple-500"
            />
          </div>

          {/* Events Section */}
          <div className="mb-8">
            <Events />
          </div>

          {/* Employee Attendance Stats */}
          {attendance.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock size={20} className="text-violet-600" />
                Employee Attendance Summary
              </h3>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Employee</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Present</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Absent</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Half Day</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">On Leave</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {attendance.map((record) => (
                      <tr key={record.user_id}>
                        <td className="px-6 py-3 text-sm font-medium text-gray-800 dark:text-white">{record.name}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                            {record.present_days || 0}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">
                            {record.absent_days || 0}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">
                            {record.half_days || 0}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                            {record.leave_days || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Leaves */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Leave Requests</h3>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Employee</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">End Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats?.recentLeaves?.length > 0 ? (
                    stats.recentLeaves.map((leave) => (
                      <tr key={leave.leave_id}>
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.employee_name || "N/A"}</td>
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(leave.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(leave.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              leave.status === "APPROVED"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : leave.status === "REJECTED"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-3 text-center text-gray-500 dark:text-gray-400">
                        No recent leave requests
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
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
      active
        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, color }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-transparent hover:border-violet-600">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{title}</p>
        <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{value}</p>
      </div>
      <div className={`${color} p-4 rounded-lg text-white shadow-lg`}>
        <Users size={28} />
      </div>
    </div>
  </div>
);

export default HRDashboard;
