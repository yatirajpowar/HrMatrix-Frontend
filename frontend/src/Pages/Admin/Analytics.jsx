import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { adminAPI } from "../../services/api";

const Analytics = () => {
  const navigate = useNavigate();
  const [hiringData, setHiringData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHiringTrend();
  }, []);

  const loadHiringTrend = async () => {
    try {
      const response = await adminAPI.getMonthlyHiringTrend();
      console.log("📊 Analytics Response:", response);
      if (response.success) {
        // Transform data for chart
        const chartData = (response.data || []).map((item) => ({
          month: item.monthLabel || item.month || 'Unknown',
          total: parseInt(item.total_hires) || 0,
          employees: parseInt(item.employee_hires) || 0,
          hr: parseInt(item.hr_hires) || 0,
        }));
        setHiringData(chartData);
        console.log("✅ Chart Data:", chartData);
      } else {
        setError(response.message || "Failed to load hiring trend");
      }
    } catch (err) {
      console.error("❌ Analytics Error:", err);
      setError(err.response?.data?.message || err.message || "Error loading hiring trend");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 text-violet-600 hover:text-violet-700 dark:text-violet-400"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={32} className="text-violet-600" />
              Analytics & Insights
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Monthly Hiring Trend Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Monthly Hiring Trend</h2>
          
          {hiringData.length > 0 ? (
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={hiringData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#f3f4f6",
                    }}
                    cursor={{ stroke: "#a78bfa", strokeWidth: 2 }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Total Hires"
                  />
                  <Line
                    type="monotone"
                    dataKey="employees"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ fill: "#06b6d4", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Employees"
                  />
                  <Line
                    type="monotone"
                    dataKey="hr"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="HR Staff"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 mb-2">No hiring data available yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Chart will appear once employees or HR staff are added</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {hiringData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Hires</h3>
              <p className="text-3xl font-bold text-violet-600">
                {hiringData.reduce((sum, item) => sum + item.total, 0)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Employees</h3>
              <p className="text-3xl font-bold text-cyan-600">
                {hiringData.reduce((sum, item) => sum + item.employees, 0)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total HR Staff</h3>
              <p className="text-3xl font-bold text-green-600">
                {hiringData.reduce((sum, item) => sum + item.hr, 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
