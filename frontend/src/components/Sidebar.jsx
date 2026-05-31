import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Building2, 
  FileText, 
  BrainCircuit, 
  Users, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Profile', icon: User },
    { to: '/student/companies', label: 'Companies', icon: Building2 },
    { to: '/student/applications', label: 'My Applications', icon: FileText },
    { to: '/student/prediction', label: 'AI Predictor', icon: BrainCircuit },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/companies', label: 'Companies', icon: Building2 },
    { to: '/admin/applicants', label: 'Applicants', icon: Users },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const NavItem = ({ link }) => {
    const Icon = link.icon;
    return (
      <NavLink
        to={link.to}
        onClick={() => setIsOpen(false)}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
          }`
        }
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{link.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass z-40 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-purple-500" />
          <span className="text-xl font-bold tracking-tight text-white font-display">SmartPlace</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 glass border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen lg:flex lg:flex-col lg:w-64`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white font-display">SmartPlace</span>
              <span className="text-xs text-gray-500 font-medium">Placement Tracker</span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white font-display">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-purple-400 font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavItem key={link.to} link={link} />
          ))}
        </nav>

        {/* Footer Area with Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-35 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
