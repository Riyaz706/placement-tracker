import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col lg:flex-row text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto lg:h-screen pt-16 lg:pt-0">
        <div className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {/* Outlet for Nested Pages */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
