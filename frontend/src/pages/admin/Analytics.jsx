import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Award, Layers, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAnalytics = () => {
  const { toast } = useToast();
  
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Metrics States
  const [branchSalaryData, setBranchSalaryData] = useState([]);
  const [packageDistData, setPackageDistData] = useState([]);
  const [hiringRatioData, setHiringRatioData] = useState([]);

  const compileAnalytics = (companiesList, overviewStats) => {
    // 1. Average Package Per Branch Calculation
    // For each branch, find all companies that allow it and calculate the average package
    const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
    const salaryByBranch = branches.map((branch) => {
      const allowedCompanies = companiesList.filter((c) => c.allowedBranches.includes(branch));
      const avgSalary = allowedCompanies.length > 0
        ? parseFloat((allowedCompanies.reduce((acc, c) => acc + c.package, 0) / allowedCompanies.length).toFixed(2))
        : 0;
      return { name: branch, 'Avg Package (LPA)': avgSalary, postings: allowedCompanies.length };
    });
    setBranchSalaryData(salaryByBranch);

    // 2. Package Distribution Calculation
    // Group companies into brackets: Tier 3 (< 8 LPA), Tier 2 (8 - 15 LPA), Tier 1 (15 - 25 LPA), Elite (25+ LPA)
    const tiers = {
      'Tier 3 (<8 LPA)': 0,
      'Tier 2 (8-15 LPA)': 0,
      'Tier 1 (15-25 LPA)': 0,
      'Elite (25+ LPA)': 0
    };
    companiesList.forEach((c) => {
      if (c.package < 8) tiers['Tier 3 (<8 LPA)']++;
      else if (c.package <= 15) tiers['Tier 2 (8-15 LPA)']++;
      else if (c.package <= 25) tiers['Tier 1 (15-25 LPA)']++;
      else tiers['Elite (25+ LPA)']++;
    });
    const distData = Object.keys(tiers).map((tier) => ({ name: tier, value: tiers[tier] }));
    setPackageDistData(distData);

    // 3. Hiring Placement Status Ratio
    // Applied vs Hired
    const totalApplied = overviewStats?.totalApplications || 0;
    const hired = overviewStats?.hiredStudents || 0;
    const pending = Math.max(0, totalApplied - hired);
    
    setHiringRatioData([
      { name: 'Hired / Placed', value: hired, color: '#10b981' },
      { name: 'Pending / Screening', value: pending, color: '#f59e0b' }
    ]);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [companiesRes, statsRes] = await Promise.all([
        apiClient.get('/companies'),
        apiClient.get('/dashboard/admin')
      ]);

      if (companiesRes.data.success && statsRes.data.success) {
        setCompanies(companiesRes.data.companies);
        setStats(statsRes.data);
        compileAnalytics(companiesRes.data.companies, statsRes.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      toast('Failed to load portal analytics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = ['#a855f7', '#06b6d4', '#ec4899', '#3b82f6'];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-white/5 rounded-3xl"></div>
          <div className="h-96 bg-white/5 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">System Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Salary distributions, branch placements, and placement ratio insights.</p>
        </div>
        <button
          onClick={fetchData}
          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-300 transition-colors w-fit flex items-center space-x-1.5 text-xs font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Grid Sub-dashboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Branch Salary Distribution (Bar Chart) */}
        <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white leading-none">Salary Package by Branch</h3>
              <p className="text-xs text-gray-500 mt-1">Average salary package in LPA allowed across departments</p>
            </div>
          </div>

          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchSalaryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="Avg Package (LPA)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company Package Tiers Distribution (Pie Chart) */}
        <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white leading-none">Job Postings Package Tiers</h3>
              <p className="text-xs text-gray-500 mt-1">Distribution of company openings divided by salary tiers</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="h-60 w-full md:w-60 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {packageDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="space-y-3 text-sm flex-1 text-left w-full md:w-auto">
              {packageDistData.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-3 w-3 rounded" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-gray-400 font-medium">{entry.name}</span>
                  </div>
                  <span className="font-bold text-white">{entry.value} postings</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hiring Conversion Ratio (Half Pie / Funnel) */}
        <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white leading-none">Placement Pipeline conversion</h3>
              <p className="text-xs text-gray-500 mt-1">Hired conversion ratio against pending interview screens</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            {/* Visual Progress */}
            <div className="h-52 w-full md:w-80 text-xs relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hiringRatioData}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {hiringRatioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Placement Rate Center Text */}
              <div className="absolute bottom-6 text-center">
                <span className="text-3xl font-extrabold text-white font-display">
                  {stats?.totalApplications > 0
                    ? ((stats.hiredStudents / stats.totalApplications) * 100).toFixed(1)
                    : 0}%
                </span>
                <p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">Conversion Rate</p>
              </div>
            </div>

            {/* Ratios Metrics */}
            <div className="space-y-4 flex-1 max-w-md w-full text-left">
              {hiringRatioData.map((entry, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{entry.name}</h4>
                      <p className="text-[10px] text-gray-500">Student application submissions</p>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold font-display" style={{ color: entry.color }}>
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
