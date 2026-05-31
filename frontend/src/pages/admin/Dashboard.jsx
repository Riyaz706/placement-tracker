import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  Building2, 
  FileSpreadsheet, 
  Award, 
  Plus, 
  Send,
  Calendar,
  Loader2,
  RefreshCw,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatsSkeleton } from '../../components/SkeletonLoader';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick notice publishing state
  const [notice, setNotice] = useState('');
  const [publishing, setPublishing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await apiClient.get('/dashboard/admin');
      
      if (statsRes.data.success) {
        setStats(statsRes.data);
      }
      
      // Let's also fetch recent applications to show in a list
      // Since there's no direct "recent activity" endpoint, we can load applicants from a popular company or mock them,
      // or fetch applicants if we query recent ones. Let's make a mock recent applications or load them if any company exists.
      // We can also fetch the list of companies to display some metrics.
      const companiesRes = await apiClient.get('/companies');
      if (companiesRes.data.success && companiesRes.data.companies.length > 0) {
        // Fetch applicants for the first company to show some actual recent logs
        const firstCompany = companiesRes.data.companies[0];
        const applicantsRes = await apiClient.get(`/applications/company/${firstCompany._id}`);
        if (applicantsRes.data.success) {
          setRecentApplications(applicantsRes.data.applications.slice(0, 4));
        }
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      toast('Failed to load overview data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePublishNotice = (e) => {
    e.preventDefault();
    if (!notice.trim()) return;

    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setNotice('');
      toast('Notification broadcasted to all student dashboards!', 'success');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 bg-white/5 rounded-lg w-1/3 animate-pulse"></div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl animate-pulse"></div>
          <div className="h-64 bg-white/5 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Registered Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
    { title: 'Partnered Companies', value: stats?.totalCompanies || 0, icon: Building2, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
    { title: 'Submitted Applications', value: stats?.totalApplications || 0, icon: FileSpreadsheet, color: 'text-pink-400 border-pink-500/20 bg-pink-500/5' },
    { title: 'Students Hired / Placed', value: stats?.hiredStudents || 0, icon: Award, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-white">TPO Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Global campus recruitment metrics, postings, and audit trails.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-300 transition-colors w-fit flex items-center space-x-1.5 text-xs font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/companies"
            className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md shadow-purple-600/10 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Post Job opening</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`glass p-6 rounded-2xl border ${card.color} flex items-center justify-between`}
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-extrabold tracking-tight font-display text-white">{card.value}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-inherit">
                <Icon className="h-6 w-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Applications Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold font-display text-white">Recent Portal Application Activity</h2>
          
          <div className="space-y-4">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div 
                  key={app._id}
                  className="glass p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/5 duration-200"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-purple-400 text-sm">
                      {app.student?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">
                        {app.student?.name} <span className="text-xs text-gray-500 font-medium">applied to</span> {app.company?.companyName}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">{app.company?.role} • CGPA: {app.student?.cgpa} • {app.student?.branch}</p>
                      <p className="text-[10px] text-gray-500 mt-1">Submitted: {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/5">
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass p-8 rounded-2xl border border-white/5 text-center text-gray-500 space-y-2">
                <FileSpreadsheet className="h-10 w-10 text-gray-600 mx-auto" />
                <p className="text-sm font-semibold">No recent activity logged.</p>
                <p className="text-xs max-w-xs mx-auto">Student submissions will log here once applications begin.</p>
              </div>
            )}
          </div>
        </div>

        {/* Notice Board Broadcaster */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-display text-white">Broadcast Center</h2>

          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Bell className="h-4 w-4 text-purple-400" />
              <span>Broadcast Notice</span>
            </div>
            
            <form onSubmit={handlePublishNotice} className="space-y-4">
              <textarea
                placeholder="Write a message to broadcast to all student dashboard accounts (e.g. 'Google deadline extended to June 15th')..."
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                rows={4}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium resize-none"
                required
              />

              <button
                type="submit"
                disabled={publishing || !notice.trim()}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/10"
              >
                {publishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Broadcast Notice</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
