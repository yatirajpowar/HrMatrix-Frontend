import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, User, Home, Clock, PieChart, DollarSign, Download } from "lucide-react";
import { employeeAPI } from "../../Services/Api";
import { useAuth } from "../../context/authContext";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [punching, setPunching] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const dashResponse = await employeeAPI.getDashboard();
      setStats(dashResponse.data || {});

      // Load events - handle potential errors gracefully
      try {
        const eventsResponse = await employeeAPI.getEvents();
        if (eventsResponse?.success) {
          setEvents(eventsResponse.data || []);
        } else {
          console.warn("Events response unsuccessful:", eventsResponse?.message);
        }
      } catch (err) {
        console.error("Error loading events:", err);
      }

      // Load today's attendance
      try {
        const attResponse = await employeeAPI.getTodayAttendance();
        if (attResponse?.success) {
          setAttendance(attResponse.data);
        } else {
          console.warn("Attendance response unsuccessful:", attResponse?.message);
        }
      } catch (err) {
        console.error("Error loading attendance:", err);
      }

      // Load salary slip
      try {
        const salaryResponse = await employeeAPI.getSalarySlip();
        if (salaryResponse?.success && salaryResponse?.data) {
          setSalary(salaryResponse.data);
        } else {
          console.warn("Salary slip not available or failed to load:", salaryResponse?.message);
        }
      } catch (err) {
        console.error("Error loading salary slip:", err);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading dashboard");
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePunchInOut = async () => {
    setPunching(true);
    try {
      const response = await employeeAPI.punchInOut();
      if (response?.success) {
        setAttendance(response.data);
        // Reload dashboard to refresh all data
        await loadDashboard();
      } else {
        setError(response?.message || "Error processing punch");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error processing punch");
      console.error("Punch error:", err);
    } finally {
      setPunching(false);
    }
  };

  const getLeaveChartData = () => {
    if (!stats) return [];
    return [
      { name: "Approved", value: stats.approvedLeaves || 0, color: "#10b981" },
      { name: "Pending", value: stats.pendingLeaves || 0, color: "#f59e0b" },
      { name: "Rejected", value: stats.rejectedLeaves || 0, color: "#ef4444" }
    ].filter(item => item.value > 0);
  };

  const handleDownloadSalarySlip = () => {
    if (!salary) return;
    
    // Create a CSV format salary slip
    const lines = [
      "SALARY SLIP",
      `Month: ${salary.month}`,
      "",
      "EMPLOYEE DETAILS",
      `Name: ${salary.employee.name}`,
      `Email: ${salary.employee.email}`,
      `Department: ${salary.employee.department}`,
      `Designation: ${salary.employee.designation}`,
      "",
      "EARNINGS",
      `Basic Salary: ₹${salary.salary.basicSalary.toLocaleString()}`,
      `Dearness Allowance: ₹${salary.salary.allowances.dearness.toLocaleString()}`,
      `House Allowance: ₹${salary.salary.allowances.houseAllowance.toLocaleString()}`,
      `Other Allowance: ₹${salary.salary.allowances.otherAllowance.toLocaleString()}`,
      `Gross Salary: ₹${salary.salary.grossSalary.toLocaleString()}`,
      "",
      "DEDUCTIONS",
      `Income Tax: ₹${salary.salary.deductions.incomeTax.toLocaleString()}`,
      `Provident Fund: ₹${salary.salary.deductions.pf.toLocaleString()}`,
      `ESI: ₹${salary.salary.deductions.esi.toLocaleString()}`,
      `Insurance: ₹${salary.salary.deductions.insurance.toLocaleString()}`,
      `Total Deductions: ₹${salary.salary.totalDeductions.toLocaleString()}`,
      "",
      `NET SALARY (TAKE HOME): ₹${salary.salary.netSalary.toLocaleString()}`
    ];
    
    const csvContent = lines.join("\n");
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(csvContent));
    element.setAttribute("download", `Salary_Slip_${salary.month.replace(/\s/g, '_')}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
    <div className="flex h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-violet-900/30 dark:to-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg">
        <div className="p-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-2xl">
          <h1 className="text-2xl font-bold">HRMatrix</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          <NavItem
            icon={<Home size={20} />}
            label="Dashboard"
            onClick={() => navigate("/employee/dashboard")}
            active
          />
          <NavItem
            icon={<User size={20} />}
            label="My Profile"
            onClick={() => navigate("/employee/profile")}
          />
          <NavItem
            icon={<Calendar size={20} />}
            label="My Leaves"
            onClick={() => navigate("/employee/leaves")}
          />
          <NavItem
            icon={<DollarSign size={20} />}
            label="My Salary"
            onClick={() => navigate("/employee/salary")}
          />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Welcome, {user?.name}!</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0) || "E"}
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

          {/* Punch In/Out Section */}
          <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border-l-4 border-violet-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Status</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {attendance?.punch_in && !attendance?.punch_out ? "Punched In" : "Punched Out"}
                </p>
                {attendance?.punch_in && (
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Punch In: <span className="font-semibold text-gray-800 dark:text-white">{new Date(attendance.punch_in).toLocaleTimeString()}</span>
                    </p>
                    {attendance?.punch_out && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Punch Out: <span className="font-semibold text-gray-800 dark:text-white">{new Date(attendance.punch_out).toLocaleTimeString()}</span>
                      </p>
                    )}
                    {!attendance?.punch_out && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        ✓ Currently working
                      </p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handlePunchInOut}
                disabled={punching}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                <Clock size={20} />
                {punching ? "Processing..." : attendance?.punch_in && !attendance?.punch_out ? "Punch Out" : "Punch In"}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Leaves Applied"
              value={stats?.totalLeaves || 0}
              color="bg-blue-500"
            />
            <StatCard
              title="Pending Leaves"
              value={stats?.pendingLeaves || 0}
              color="bg-yellow-500"
            />
            <StatCard
              title="Approved Leaves"
              value={stats?.approvedLeaves || 0}
              color="bg-green-500"
            />
            <StatCard
              title="Rejected Leaves"
              value={stats?.rejectedLeaves || 0}
              color="bg-red-500"
            />
          </div>

          {/* Events Section */}
          {events && events.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-violet-600" />
                Upcoming Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <div key={event.event_id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border-l-4 border-violet-500 hover:shadow-lg transition">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">📅 Date:</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {new Date(event.event_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">📍 Location:</span>
                        <span className="font-medium text-violet-600">{event.location || "N/A"}</span>
                      </div>
                      {event.created_by && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">👤 Created by:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{event.created_by}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Leave Requests */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Leave Requests</h3>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">End Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Reason</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats?.recentLeaves?.length > 0 ? (
                    stats.recentLeaves.map((leave) => (
                      <tr key={leave.leave_id}>
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(leave.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(leave.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.reason || "N/A"}</td>
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
                        No leave requests yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leave Distribution Chart */}
          {getLeaveChartData().length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <PieChart size={20} className="text-violet-600" />
                Leave Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie data={getLeaveChartData()} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {getLeaveChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Tooltip />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          )}

          {/* Compact Attendance History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Today's Status Card */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border-l-4 border-blue-500">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Today's Status</h4>
              {attendance?.punch_in ? (
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Punch In</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{new Date(attendance.punch_in).toLocaleTimeString()}</p>
                  </div>
                  {attendance?.punch_out && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Punch Out</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{new Date(attendance.punch_out).toLocaleTimeString()}</p>
                    </div>
                  )}
                  {!attendance?.punch_out && (
                    <div className="text-green-600 dark:text-green-400 text-xs font-semibold">✓ Currently working</div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Not punched in</p>
              )}
            </div>

            {/* Attendance Quick Stats */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border-l-4 border-green-500">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Attendance</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Applied:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{stats?.totalLeaves || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Approved:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{stats?.approvedLeaves || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border-l-4 border-purple-500">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Quick Links</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate("/employee/leaves")}
                  className="block w-full text-left text-sm px-3 py-1 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition"
                >
                  → Apply Leave
                </button>
                <button 
                  onClick={() => navigate("/employee/profile")}
                  className="block w-full text-left text-sm px-3 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                >
                  → Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* Salary Slip Section */}
          {salary && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border-l-4 border-violet-500 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <DollarSign size={20} className="text-violet-600" />
                  Salary Slip - {salary.month}
                </h3>
                <button
                  onClick={handleDownloadSalarySlip}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition text-sm font-medium"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Employee Details */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Employee Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{salary.employee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{salary.employee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Department:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{salary.employee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Designation:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{salary.employee.designation}</span>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-4">Earnings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Basic Salary:</span>
                      <span className="font-medium text-green-900 dark:text-green-200">₹{salary.salary.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Dearness:</span>
                      <span className="font-medium text-green-900 dark:text-green-200">₹{salary.salary.allowances.dearness.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">House Allowance:</span>
                      <span className="font-medium text-green-900 dark:text-green-200">₹{salary.salary.allowances.houseAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Other Allowance:</span>
                      <span className="font-medium text-green-900 dark:text-green-200">₹{salary.salary.allowances.otherAllowance.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-green-200 dark:border-green-800 pt-2 mt-2 flex justify-between font-semibold">
                      <span className="text-green-800 dark:text-green-300">Gross Salary:</span>
                      <span className="text-green-900 dark:text-green-100">₹{salary.salary.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="mt-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-900 dark:text-red-300 mb-4">Deductions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-700 dark:text-red-400">Income Tax:</span>
                      <span className="font-medium text-red-900 dark:text-red-200">₹{salary.salary.deductions.incomeTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700 dark:text-red-400">Provident Fund:</span>
                      <span className="font-medium text-red-900 dark:text-red-200">₹{salary.salary.deductions.pf.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700 dark:text-red-400">ESI:</span>
                      <span className="font-medium text-red-900 dark:text-red-200">₹{salary.salary.deductions.esi.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700 dark:text-red-400">Insurance:</span>
                      <span className="font-medium text-red-900 dark:text-red-200">₹{salary.salary.deductions.insurance.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex flex-col justify-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Deductions</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{salary.salary.totalDeductions.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="mt-4 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 p-3 rounded-lg border-2 border-violet-500 dark:border-violet-600">
                <p className="text-gray-700 dark:text-gray-300 text-xs font-medium mb-1">NET SALARY (TAKE HOME)</p>
                <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">₹{salary.salary.netSalary.toLocaleString()}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition font-medium ${
      active
        ? "bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 text-violet-700 dark:text-violet-300 border-l-4 border-violet-600 dark:border-violet-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, color }) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-violet-500 hover:border-purple-500">
    <div className="flex items-center gap-4">
      <div className={`${color} p-3 rounded-lg text-white shadow-md`}>
        <Calendar size={24} />
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{value}</p>
      </div>
    </div>
  </div>
);

export default EmployeeDashboard;
