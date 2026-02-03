import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, X, FileText } from "lucide-react";
import { hrAPI } from "../../services/api";
import SalarySlipModal from "./SalarySlipModal";

const HREmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [salarySlipEmployee, setSalarySlipEmployee] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await hrAPI.getAllEmployees();
      if (response.success) {
        setEmployees(response.data || []);
      } else {
        setError(response.message || "Failed to load employees");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading employees");
    } finally {
      setLoading(false);
    }
  };


  const handleEditClick = (employee) => {
    setEditingEmployee(employee.user_id);
    setEditForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
    });
    setError("");
    setSuccess("");
  };

  const handleCloseEdit = () => {
    setEditingEmployee(null);
    setEditForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editForm.name || !editForm.email) {
      setError("Name and email are required");
      return;
    }

    try {
      setUpdating(true);
      const response = await hrAPI.updateEmployee(
        editingEmployee,
        editForm.name,
        editForm.email,
        editForm.phone,
        editForm.department,
        editForm.designation
      );

      if (response.success) {
        setSuccess("Employee updated successfully!");
        setTimeout(() => {
          loadEmployees();
          handleCloseEdit();
          setSuccess("");
        }, 1500);
      } else {
        setError(response.message || "Failed to update employee");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating employee");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const response = await hrAPI.deleteEmployee(id);
      if (response.success) {
        setSuccess("Employee deleted successfully!");
        setTimeout(() => {
          loadEmployees();
          setSuccess("");
        }, 1500);
      } else {
        setError(response.message || "Failed to delete employee");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting employee");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/hr/dashboard")}
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Employee Management
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-600 dark:text-green-300 rounded-lg">
            {success}
          </div>
        )}

        {/* Employees Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-violet-600 to-purple-600">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Business Unit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Designation</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {employees.length > 0 ? (
                  employees.map((emp, idx) => (
                    <tr key={emp.user_id} className={idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{emp.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium">
                          {emp.business_unit || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{emp.phone || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{emp.designation || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(emp.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-3">
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition"
                          title="Edit employee"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setSalarySlipEmployee(emp)}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition"
                          title="View salary slip"
                        >
                          <FileText size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.user_id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Delete employee"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Edit Employee</h2>
              <button
                onClick={handleCloseEdit}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
                  placeholder="Enter employee name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
                  placeholder="Enter employee email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
                  placeholder="Enter department"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  value={editForm.designation}
                  onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
                  placeholder="Enter designation"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Employee"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Slip Modal */}
      {salarySlipEmployee && (
        <SalarySlipModal
          employeeId={salarySlipEmployee.user_id}
          employeeName={salarySlipEmployee.name}
          onClose={() => setSalarySlipEmployee(null)}
        />
      )}
    </div>
  );
};

export default HREmployees;
