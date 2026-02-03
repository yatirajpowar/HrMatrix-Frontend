import React from 'react';
import { LayoutDashboard, Users, Calendar, Settings } from 'lucide-react';

const Sidebar = ({ userRole }) => {
  return (
    <aside className="w-64 bg-slate-900 text-white h-full flex flex-col p-4">
      <div className="text-2xl font-bold text-violet-400 mb-10 px-2">HRMatrix</div>
      
      <nav className="flex-1 space-y-2">
        <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" />
        <NavItem icon={<Calendar size={20}/>} label="My Leaves" />

        
        {(userRole === 'admin' || userRole === 'hr') && (
          <>
            <NavItem icon={<Users size={20}/>} label="Employee List" />
            <NavItem icon={<Settings size={20}/>} label="Company Settings" />
          </>
        )}
      </nav>
    </aside>
  );
};


const NavItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer text-slate-300 hover:text-white transition-all">
    {icon} <span>{label}</span>
  </div>
);

export default Sidebar;