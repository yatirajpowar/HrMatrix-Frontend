import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear everything from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Redirect to login
    navigate("/login");
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-500 hover:bg-red-50 p-3 rounded-lg w-full transition-all mt-auto"
    >
      <LogOut size={20} />
      <span className="font-medium">Sign Out</span>
    </button>
  );
};

export default LogoutButton;