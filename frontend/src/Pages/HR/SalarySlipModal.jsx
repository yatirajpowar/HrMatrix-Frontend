import React, { useState } from "react";
import { X, Download } from "lucide-react";
import { hrAPI } from "../../Services/Api";

const SalarySlipModal = ({ employeeId, employeeName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salaryData, setSalaryData] = useState(null);

  React.useEffect(() => {
    loadSalarySlip();
  }, [employeeId]);

  const loadSalarySlip = async () => {
    try {
      setLoading(true);
      const response = await hrAPI.getSalarySlipData(employeeId);
      if (response.success) {
        setSalaryData(response.data);
      } else {
        setError(response.message || "Failed to load salary slip");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading salary slip");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // Simple PDF generation using template
    const content = `
SALARY SLIP - ${salaryData.month}
================================

Employee Details:
Name: ${salaryData.employee.name}
Email: ${salaryData.employee.email}
Department: ${salaryData.employee.department}
Designation: ${salaryData.employee.designation}

EARNINGS:
Basic Salary: ₹${salaryData.salary.basicSalary.toFixed(2)}
Dearness Allowance: ₹${salaryData.salary.allowances.dearness.toFixed(2)}
House Allowance: ₹${salaryData.salary.allowances.houseAllowance.toFixed(2)}
Other Allowance: ₹${salaryData.salary.allowances.otherAllowance.toFixed(2)}
---
Gross Salary: ₹${salaryData.salary.grossSalary.toFixed(2)}

DEDUCTIONS:
Income Tax: ₹${salaryData.salary.deductions.incomeTax.toFixed(2)}
PF: ₹${salaryData.salary.deductions.pf.toFixed(2)}
ESI: ₹${salaryData.salary.deductions.esi.toFixed(2)}
Insurance: ₹${salaryData.salary.deductions.insurance.toFixed(2)}
---
Total Deductions: ₹${salaryData.salary.totalDeductions.toFixed(2)}

NET SALARY: ₹${salaryData.salary.netSalary.toFixed(2)}
    `;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", `SalarySlip_${salaryData.month}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading salary slip...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Error</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Salary Slip</h2>
            <p className="text-sm text-white/80">{salaryData.month}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/30 transition"
              title="Download as text"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Employee Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase">
              Employee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {salaryData.employee.name}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {salaryData.employee.email}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {salaryData.employee.department}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Designation</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {salaryData.employee.designation}
                </p>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-3 uppercase">
              Earnings
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Basic Salary</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{salaryData.salary.basicSalary.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Dearness Allowance</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{salaryData.salary.allowances.dearness.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">House Allowance</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{salaryData.salary.allowances.houseAllowance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Other Allowance</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{salaryData.salary.allowances.otherAllowance.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-green-200 dark:border-green-800 pt-2 flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-white">Gross Salary</span>
                <span className="text-green-700 dark:text-green-400">
                  ₹{salaryData.salary.grossSalary.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3 uppercase">
              Deductions
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Income Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{salaryData.salary.deductions.incomeTax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Provident Fund (PF)</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{salaryData.salary.deductions.pf.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">ESI</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{salaryData.salary.deductions.esi.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Insurance</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{salaryData.salary.deductions.insurance.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-red-200 dark:border-red-800 pt-2 flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-white">Total Deductions</span>
                <span className="text-red-700 dark:text-red-400">
                  ₹{salaryData.salary.totalDeductions.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">NET SALARY</span>
              <span className="text-2xl font-bold text-white">
                ₹{salaryData.salary.netSalary.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalarySlipModal;
