import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { adminAPI } from "../../services/api";

const AdminCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    default_leaves: 12,
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await adminAPI.getAllCompanies();
      if (response.success) {
        setCompanies(response.data || []);
      } else {
        setError(response.message || "Failed to load companies");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading companies");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let response;
      if (editingId) {
        // Update existing company
        response = await adminAPI.updateCompany(
          editingId,
          formData.name,
          formData.email,
          formData.address,
          parseInt(formData.default_leaves)
        );
        if (response.success) {
          alert("Company updated successfully!");
          setEditingId(null);
          setFormData({ name: "", email: "", address: "", default_leaves: 12 });
          setShowForm(false);
          loadCompanies();
        } else {
          setError(response.message || "Failed to update company");
        }
      } else {
        // Create new company
        response = await adminAPI.createCompany(
          formData.name,
          formData.email,
          formData.address,
          parseInt(formData.default_leaves)
        );
        if (response.success) {
          alert("Company created successfully!");
          setFormData({ name: "", email: "", address: "", default_leaves: 12 });
          setShowForm(false);
          loadCompanies();
        } else {
          setError(response.message || "Failed to create company");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error saving company");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      const response = await adminAPI.deleteCompany(id);
      if (response.success) {
        alert("Company deleted successfully!");
        loadCompanies();
      } else {
        alert(response.message || "Failed to delete company");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting company");
    }
  };

  const handleEdit = (company) => {
    setEditingId(company.company_id);
    setFormData({
      name: company.name,
      email: company.email || "",
      address: company.address || "",
      default_leaves: company.default_leaves || 12,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", address: "", default_leaves: 12 });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
          >
            <Plus size={20} />
            New_Business_Unit
          </button>
        </div>

        {/* Add/Edit Company Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              {editingId ? "Edit Company" : "Add New Company"}
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Leaves</label>
                <input
                  type="number"
                  value={formData.default_leaves}
                  onChange={(e) => setFormData({ ...formData, default_leaves: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  rows="3"
                ></textarea>
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700">
                  {editingId ? "Update Company" : "Create Company"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Companies Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Address</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Default Leaves</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.company_id}>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{company.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{company.email || "N/A"}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{company.address || "N/A"}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{company.default_leaves || 12}</td>
                    <td className="px-6 py-3 text-sm flex gap-2">
                      <button 
                        onClick={() => handleEdit(company)}
                        className="text-blue-600 hover:text-blue-700 transition"
                        title="Edit company"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(company.company_id)} 
                        className="text-red-600 hover:text-red-700 transition"
                        title="Delete company"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-3 text-center text-gray-500 dark:text-gray-400">
                    No companies found
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

export default AdminCompanies;
