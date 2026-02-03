import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, Calendar, User, Save, X } from "lucide-react";
import { employeeAPI } from "../../services/api";
import { useAuth } from "../../context/authContext";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await employeeAPI.getProfile();
      if (response.success) {
        setProfile(response.data);
        setFormData(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await employeeAPI.updateProfile(
        formData.name,
        formData.email,
        formData.phone,
        formData.department,
        formData.designation
      );
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
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
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
          />
          <NavItem
            icon={<User size={20} />}
            label="My Profile"
            onClick={() => navigate("/employee/profile")}
            active
          />
          <NavItem
            icon={<Calendar size={20} />}
            label="My Leaves"
            onClick={() => navigate("/employee/leaves")}
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {isEditing ? "Edit Profile" : "My Profile"}
          </h2>
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

          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              {!isEditing ? (
                // View Mode
                <div>
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                      {profile?.name?.charAt(0) || "E"}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <InfoField label="Full Name" value={profile?.name} />
                    <InfoField label="Email Address" value={profile?.email} />
                    <InfoField label="Phone Number" value={profile?.phone || "Not provided"} />
                    <InfoField label="Department" value={profile?.department || "Not provided"} />
                    <InfoField label="Designation" value={profile?.designation || "Not provided"} />
                    <InfoField label="Role" value={profile?.role?.replace("_", " ")} />
                    <InfoField 
                      label="Joined Date" 
                      value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"} 
                    />
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <User size={20} />
                    Edit Profile
                  </button>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <div className="space-y-6">
                    <FormField
                      label="Full Name"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <FormField
                      label="Phone Number"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                    />
                    <FormField
                      label="Department"
                      name="department"
                      value={formData.department || ""}
                      onChange={handleInputChange}
                    />
                    <FormField
                      label="Designation"
                      name="designation"
                      value={formData.designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
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

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-lg text-gray-800 dark:text-white font-semibold">{value}</p>
  </div>
);

const FormField = ({ label, name, type = "text", value, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
  </div>
);

export default EmployeeProfile;
