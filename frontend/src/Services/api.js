import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to request headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============= AUTH ENDPOINTS =============

export const authAPI = {
  register: async (name, email, password, confirmPassword, role = "EMPLOYEE", company_id) => {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
      confirmPassword,
      role,
      company_id,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  verify: async () => {
    const response = await apiClient.get("/auth/verify");
    return response.data;
  },

  getAllCompanies: async () => {
    const response = await apiClient.get("/auth/companies");
    return response.data;
  },

  registerHR: async (name, email, password, confirmPassword) => {
    const response = await apiClient.post("/auth/register-hr", {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  registerAdmin: async (name, email, password, confirmPassword) => {
    const response = await apiClient.post("/auth/register-admin", {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },
};

// ============= EMPLOYEE ENDPOINTS =============

export const employeeAPI = {
  getProfile: async () => {
    const response = await apiClient.get("/employee/profile");
    return response.data;
  },

  updateProfile: async (name, email, phone, department, designation) => {
    const response = await apiClient.put("/employee/profile", {
      name,
      email,
      phone,
      department,
      designation,
    });
    return response.data;
  },

  getLeaves: async () => {
    const response = await apiClient.get("/employee/leaves");
    return response.data;
  },

  applyForLeave: async (startDate, endDate, reason) => {
    const response = await apiClient.post("/employee/leaves", {
      start_date: startDate,
      end_date: endDate,
      reason,
    });
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get("/employee/dashboard");
    return response.data;
  },

  punchInOut: async () => {
    const response = await apiClient.post("/attendance/punch");
    return response.data;
  },

  getTodayAttendance: async () => {
    const response = await apiClient.get("/attendance/today");
    return response.data;
  },

  getAttendanceHistory: async (month, year) => {
    const response = await apiClient.get("/attendance/history", {
      params: { month, year },
    });
    return response.data;
  },

  getEvents: async () => {
    const response = await apiClient.get("/employee/events");
    return response.data;
  },

  getSalarySlip: async () => {
    try {
      // Call the employee salary endpoint (no need to pass userId, backend uses req.user)
      const response = await apiClient.get("/employee/salary");
      console.log("Salary slip response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching salary slip:", error.response?.data || error.message);
      // Return graceful error response instead of throwing
      return { success: false, message: error.response?.data?.message || "Failed to load salary slip" };
    }
  },
};

// ============= HR ENDPOINTS =============

export const hrAPI = {
  getAllEmployees: async () => {
    const response = await apiClient.get("/hr/employees");
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await apiClient.get(`/hr/employees/${id}`);
    return response.data;
  },

  createEmployee: async (name, email, password, phone, department, designation) => {
    const response = await apiClient.post("/hr/employees", {
      name,
      email,
      password,
      phone,
      department,
      designation,
    });
    return response.data;
  },

  updateEmployee: async (id, name, email, phone, department, designation) => {
    const response = await apiClient.put(`/hr/employees/${id}`, {
      name,
      email,
      phone,
      department,
      designation,
    });
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await apiClient.delete(`/hr/employees/${id}`);
    return response.data;
  },

  getAllLeaveRequests: async () => {
    try {
      const response = await apiClient.get("/hr/leaves");
      return response.data;
    } catch (error) {
      console.error("Error fetching leave requests:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to load leave requests", data: [] };
    }
  },

  getPendingLeaveRequests: async () => {
    try {
      const response = await apiClient.get("/hr/leaves/pending");
      return response.data;
    } catch (error) {
      console.error("Error fetching pending leave requests:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to load pending requests", data: [] };
    }
  },

  getEmployeeLeaves: async (employeeId) => {
    const response = await apiClient.get(`/hr/leaves/employee/${employeeId}`);
    return response.data;
  },

  approveLeaveRequest: async (leaveId) => {
    const response = await apiClient.put(`/hr/leaves/${leaveId}/approve`);
    return response.data;
  },

  rejectLeaveRequest: async (leaveId, reason) => {
    const response = await apiClient.put(`/hr/leaves/${leaveId}/reject`, {
      reason,
    });
    return response.data;
  },

  getDashboardStats: async () => {
    try {
      const response = await apiClient.get("/hr/stats/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching HR dashboard stats:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to load dashboard stats" };
    }
  },

  getLeaveReport: async () => {
    const response = await apiClient.get("/hr/reports/leaves");
    return response.data;
  },

  getAttendanceReport: async () => {
    const response = await apiClient.get("/hr/reports/attendance");
    return response.data;
  },

  // ================ EVENTS ================
  getAllEvents: async () => {
    const response = await apiClient.get("/hr/events");
    return response.data;
  },

  createEvent: async (title, description, event_date, location) => {
    const response = await apiClient.post("/hr/events", {
      title,
      description,
      event_date,
      location,
    });
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await apiClient.delete(`/hr/events/${id}`);
    return response.data;
  },

  // ================ SALARY SLIP ================
  getSalarySlipData: async (employeeId) => {
    const response = await apiClient.get(`/hr/salary-slip/${employeeId}`);
    return response.data;
  },

  // ================ ATTENDANCE ================
  getAllAttendance: async (userId, month, year) => {
    try {
      const response = await apiClient.get("/attendance/all", {
        params: { userId, month, year },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all attendance:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to load attendance" };
    }
  },

  getAttendanceStats: async (month, year) => {
    try {
      const response = await apiClient.get("/attendance/stats", {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance stats:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to load attendance stats", data: [] };
    }
  },
};

// ============= ADMIN ENDPOINTS =============

export const adminAPI = {
  getAllUsers: async () => {
    const response = await apiClient.get("/admin/users");
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id, name, email, role, company_id) => {
    const response = await apiClient.put(`/admin/users/${id}`, {
      name,
      email,
      role,
      company_id,
    });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  createUserInvite: async (name, email, role, company_id) => {
    const response = await apiClient.post(`/admin/users`, { name, email, role, company_id });
    return response.data;
  },

  resetUserPassword: async (id, password) => {
    const response = await apiClient.put(`/admin/users/${id}/reset-password`, { password });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get("/admin/stats/dashboard");
    return response.data;
  },

  getMonthlyHiringTrend: async () => {
    const response = await apiClient.get("/admin/stats/monthly-hiring");
    return response.data;
  },

  getEmployeesByDepartment: async () => {
    const response = await apiClient.get("/admin/stats/employees-by-department");
    return response.data;
  },

  getAllCompanies: async () => {
    const response = await apiClient.get("/admin/companies");
    return response.data;
  },

  createCompany: async (name, email, address, defaultLeaves) => {
    const response = await apiClient.post("/admin/companies", {
      name,
      email,
      address,
      default_leaves: defaultLeaves,
    });
    return response.data;
  },

  updateCompany: async (id, name, email, address, defaultLeaves) => {
    const response = await apiClient.put(`/admin/companies/${id}`, {
      name,
      email,
      address,
      default_leaves: defaultLeaves,
    });
    return response.data;
  },

  deleteCompany: async (id) => {
    const response = await apiClient.delete(`/admin/companies/${id}`);
    return response.data;
  },

  getUserReport: async () => {
    const response = await apiClient.get("/admin/reports/users");
    return response.data;
  },
};

export default apiClient;
