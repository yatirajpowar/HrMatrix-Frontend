import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { hrAPI } from "../../services/api";

const HRLeaves = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      const response = await hrAPI.getAllLeaveRequests();
      if (response.success) {
        setLeaves(response.data || []);
      } else {
        setError(response.message || "Failed to load leave requests");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading leave requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      const response = await hrAPI.approveLeaveRequest(leaveId);
      if (response.success) {
        alert("Leave approved successfully!");
        loadLeaves();
      } else {
        alert(response.message || "Failed to approve leave");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error approving leave");
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const response = await hrAPI.rejectLeaveRequest(leaveId, "Rejected");
      if (response.success) {
        alert("Leave rejected successfully!");
        loadLeaves();
      } else {
        alert(response.message || "Failed to reject leave");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting leave");
    }
  };

  const filteredLeaves =
    filter === "all" ? leaves : leaves.filter((leave) => leave.status === filter.toUpperCase());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/hr/dashboard")}
          className="flex items-center gap-2 text-violet-600 hover:text-violet-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="flex gap-2 mb-6">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? "bg-violet-600 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Leave Requests Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Employee</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">End Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Reason</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr key={leave.leave_id}>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.employee_name || "N/A"}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.employee_email || "N/A"}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(leave.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(leave.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.reason || "N/A"}</td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    <td className="px-6 py-3 text-sm flex gap-2">
                      {leave.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(leave.leave_id)}
                            className="text-green-600 hover:text-green-700 flex items-center gap-1"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(leave.leave_id)}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-3 text-center text-gray-500 dark:text-gray-400">
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRLeaves;
