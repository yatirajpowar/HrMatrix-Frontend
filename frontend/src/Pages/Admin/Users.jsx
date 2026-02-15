import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { adminAPI } from "../../Services/Api";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        setError(response.message || "Failed to load users");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await adminAPI.deleteUser(id);
      if (response.success) {
        alert("User deleted successfully!");
        loadUsers();
      } else {
        alert(response.message || "Failed to delete user");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-violet-600 hover:text-violet-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* HR Users */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">HR Users</h3>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden mb-4">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Business Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.filter(u => u.role === 'HR').length > 0 ? (
                  users.filter(u => u.role === 'HR').map((user) => (
                    <tr key={user.user_id}>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{user.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{user.company_id || 'N/A'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-sm flex items-center gap-3">
                        <button
                          onClick={async () => {
                            const name = window.prompt('Name', user.name);
                            if (name === null) return;
                            const email = window.prompt('Email', user.email);
                            if (email === null) return;
                            const company_id = window.prompt('Business Unit ID', user.company_id || '');
                            if (company_id === null) return;
                            try {
                              const res = await adminAPI.updateUser(user.user_id, name, email, 'HR', company_id);
                              if (res.success) {
                                alert('User updated');
                                loadUsers();
                              } else {
                                alert(res.message || 'Failed to update user');
                              }
                            } catch (err) {
                              alert(err.response?.data?.message || err.message || 'Error updating user');
                            }
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Update
                        </button>
                        <button onClick={() => handleDelete(user.user_id)} className="text-red-600 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-3 text-center text-gray-500 dark:text-gray-400">No HR users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employees */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Employees</h3>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Business Unit</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.filter(u => u.role === 'EMPLOYEE').length > 0 ? (
                  users.filter(u => u.role === 'EMPLOYEE').map((user) => (
                    <tr key={user.user_id}>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{user.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{user.company_id || 'N/A'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-sm flex items-center gap-3">
                        <button
                          onClick={async () => {
                            const name = window.prompt('Name', user.name);
                            if (name === null) return;
                            const email = window.prompt('Email', user.email);
                            if (email === null) return;
                            const company_id = window.prompt('Business Unit ID', user.company_id || '');
                            if (company_id === null) return;
                            try {
                              const res = await adminAPI.updateUser(user.user_id, name, email, 'EMPLOYEE', company_id);
                              if (res.success) {
                                alert('User updated');
                                loadUsers();
                              } else {
                                alert(res.message || 'Failed to update user');
                              }
                            } catch (err) {
                              alert(err.response?.data?.message || err.message || 'Error updating user');
                            }
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Update
                        </button>
                        <button onClick={() => handleDelete(user.user_id)} className="text-red-600 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-3 text-center text-gray-500 dark:text-gray-400">No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
