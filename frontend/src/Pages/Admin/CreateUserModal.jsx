import React, { useState } from "react";
import { X } from "lucide-react";
import { authAPI } from "../../services/api";

const roles = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "HR", label: "HR" },
  { value: "COMPANY_ADMIN", label: "Company Admin" },
];

function generateTempPassword() {
  return Math.random().toString(36).slice(-10) + "A1!";
}

const CreateUserModal = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [sendInvite, setSendInvite] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim()) {
      setMessage("Name and email are required");
      return;
    }

    setSubmitting(true);
    try {
      // generate a temporary password when creating via admin UI
      const tempPassword = generateTempPassword();

      let resp;
      if (role === "HR") {
        resp = await authAPI.registerHR(name, email, tempPassword, tempPassword);
      } else if (role === "COMPANY_ADMIN") {
        resp = await authAPI.registerAdmin(name, email, tempPassword, tempPassword);
      } else {
        // EMPLOYEE
        resp = await authAPI.register(name, email, tempPassword, tempPassword);
      }

      if (resp && resp.success) {
        setMessage("User created successfully. Temporary password shown below.");
        onCreated && onCreated();
        // show temp password to admin
        setMessage((m) => m + "\nTemporary password: " + tempPassword);
      } else {
        throw new Error(resp?.message || "Failed to create user");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Error creating user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create User</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md bg-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md bg-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md bg-transparent">
              {roles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input id="sendInvite" type="checkbox" checked={sendInvite} onChange={(e) => setSendInvite(e.target.checked)} />
            <label htmlFor="sendInvite" className="text-sm text-gray-600">Send invite email (not implemented) — shows temporary password</label>
          </div>

          {message && (
            <div className="whitespace-pre-wrap p-3 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 rounded">
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-violet-600 text-white disabled:opacity-60">
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
