import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/client';
import { 
  Award, 
  Briefcase, 
  FileCheck, 
  AlertTriangle, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  GitBranch,
  AwardIcon,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import { StatsSkeleton } from '../../components/SkeletonLoader';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const { user, syncExternalProfile } = useAuth();
  const { toast } = useToast();
  
  const [githubInput, setGithubInput] = useState('');
  const [leetcodeInput, setLeetcodeInput] = useState('');
  const [syncing, setSyncing] = useState({ github: false, leetcode: false });
  
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, appsRes, eligibleRes] = await Promise.all([
        apiClient.get('/dashboard/student'),
        apiClient.get('/applications/my-applications'),
        apiClient.get('/companies/eligible')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data);
      }
      if (appsRes.data.success) {
        setRecentApps(appsRes.data.applications.slice(0, 3));
      }
      if (eligibleRes.data.success) {
        setEligibleCount(eligibleRes.data.count);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast('Failed to load dashboard statistics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (platform, username) => {
    if (!username.trim()) {
      toast(`Please enter a ${platform} username`, 'error');
      return;
    }
    
    setSyncing(prev => ({ ...prev, [platform]: true }));
    const result = await syncExternalProfile(platform, username);
    setSyncing(prev => ({ ...prev, [platform]: false }));
    
    if (result.success) {
      toast(result.message, 'success');
      if (platform === 'github') setGithubInput('');
      if (platform === 'leetcode') setLeetcodeInput('');
    } else {
      toast(result.message, 'error');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
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

  // Cards configuration
  const cardData = [
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: Briefcase,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
      desc: 'Applied job listings'
    },
    {
      title: 'Shortlisted Rounds',
      value: stats?.shortlisted || 0,
      icon: FileCheck,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
      desc: 'Selected for interviews'
    },
    {
      title: 'Offers Hired',
      value: stats?.hired || 0,
      icon: Award,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      desc: 'Placement offers secured'
    },
    {
      title: 'Applications Rejected',
      value: stats?.rejected || 0,
      icon: AlertTriangle,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
      desc: 'Re-evaluation opportunities'
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Greetings Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-white">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here is a summary of your academic recruitment workflow.</p>
        </div>

        {/* Quick Link/Alert */}
        {eligibleCount > 0 && (
          <Link
            to="/student/companies"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 transition-all text-xs font-semibold w-fit"
          >
            <Sparkles className="h-4 w-4" />
            <span>You are eligible for {eligibleCount} companies!</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`glass p-6 rounded-2xl border ${card.color} flex items-center justify-between`}
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-extrabold tracking-tight font-display text-white">{card.value}</p>
                <p className="text-xs text-gray-500">{card.desc}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-inherit">
                <Icon className="h-6 w-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Dashboard Sub-grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Applications Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-display text-white">Recent Applications</h2>
            <Link to="/student/applications" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentApps.length > 0 ? (
              recentApps.map((app) => (
                <div 
                  key={app._id}
                  className="glass p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/5 duration-200"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-purple-400 font-bold font-display h-12 w-12 flex items-center justify-center">
                      {app.company?.companyName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-display">{app.company?.companyName}</h4>
                      <p className="text-xs text-gray-400 font-medium">{app.company?.role} • {app.company?.package} LPA</p>
                      <p className="text-[10px] text-gray-500 mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="glass p-8 rounded-2xl text-center border border-white/5">
                <Briefcase className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-400">No applications submitted yet.</p>
                <Link to="/student/companies" className="text-xs text-purple-400 hover:underline mt-2 inline-block font-semibold">
                  Browse eligible companies
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Coding & Profile Stats Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-display text-white">Coding Platforms</h2>
          
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-5">
            <p className="text-xs text-gray-400 font-medium">Verify your profiles to improve placement scores & predictions.</p>
            
            {/* LeetCode Sync */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center space-x-3 w-full max-w-[70%]">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
                  <AwardIcon className="h-5 w-5" />
                </div>
                {user?.leetcode?.username ? (
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">LeetCode: {user.leetcode.username}</h4>
                    <p className="text-[10px] text-amber-400 font-medium">Solved: {user.leetcode.solved} problems</p>
                  </div>
                ) : (
                  <div className="w-full">
                    <h4 className="text-sm font-bold text-white font-display mb-1">LeetCode Profile</h4>
                    <input
                      type="text"
                      placeholder="Enter LeetCode username"
                      value={leetcodeInput}
                      onChange={(e) => setLeetcodeInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                )}
              </div>
              {user?.leetcode?.username ? (
                <button className="text-[10px] font-semibold px-2 py-1 rounded bg-white/5 text-gray-400 hover:text-white transition-colors">
                  Connected
                </button>
              ) : (
                <button 
                  onClick={() => handleSync('leetcode', leetcodeInput)}
                  disabled={syncing.leetcode}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/20 transition-colors disabled:opacity-50"
                >
                  {syncing.leetcode ? 'Syncing...' : 'Sync'}
                </button>
              )}
            </div>

            {/* GitHub Sync */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center space-x-3 w-full max-w-[70%]">
                <div className="p-2 bg-zinc-800 text-white rounded-lg shrink-0">
                  <GitBranch className="h-5 w-5" />
                </div>
                {user?.github?.username ? (
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">GitHub: {user.github.username}</h4>
                    <p className="text-[10px] text-cyan-400 font-medium">Public Repos: {user.github.repos}</p>
                  </div>
                ) : (
                  <div className="w-full">
                    <h4 className="text-sm font-bold text-white font-display mb-1">GitHub Integrations</h4>
                    <input
                      type="text"
                      placeholder="Enter GitHub username"
                      value={githubInput}
                      onChange={(e) => setGithubInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                )}
              </div>
              {user?.github?.username ? (
                <button className="text-[10px] font-semibold px-2 py-1 rounded bg-white/5 text-gray-400 hover:text-white transition-colors">
                  Connected
                </button>
              ) : (
                <button 
                  onClick={() => handleSync('github', githubInput)}
                  disabled={syncing.github}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600/30 text-purple-300 hover:bg-purple-600/40 border border-purple-500/20 transition-colors disabled:opacity-50"
                >
                  {syncing.github ? 'Syncing...' : 'Sync'}
                </button>
              )}
            </div>

            {/* Placement Score Progress */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-semibold">Workstation Profile Completion</span>
                <span className="text-purple-400 font-bold">85%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full w-[85%]" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
