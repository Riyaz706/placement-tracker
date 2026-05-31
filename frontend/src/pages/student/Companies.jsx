import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/client';
import CompanyCard from '../../components/CompanyCard';
import { CardSkeleton } from '../../components/SkeletonLoader';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentCompanies = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [companies, setCompanies] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [minPackage, setMinPackage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both companies and student applications
      const [companiesRes, appsRes] = await Promise.all([
        apiClient.get('/companies', {
          params: {
            search: search || undefined,
            branch: branchFilter || undefined,
            minPackage: minPackage || undefined,
            sort: sortOrder || undefined,
            limit: 100 // Load more at once for simplicity
          }
        }),
        apiClient.get('/applications/my-applications')
      ]);

      if (companiesRes.data.success) {
        setCompanies(companiesRes.data.companies);
      }
      if (appsRes.data.success) {
        setMyApplications(appsRes.data.applications);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      toast('Failed to load companies list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, branchFilter, minPackage, sortOrder]);

  const handleApply = async (companyId) => {
    // Basic pre-check: does the student have a resume uploaded?
    if (!user?.resume) {
      toast('Please upload your resume in the Profile section before applying.', 'error');
      return;
    }

    try {
      setApplyingId(companyId);
      const response = await apiClient.post(`/applications/apply/${companyId}`);
      if (response.data.success) {
        toast('Applied successfully! A confirmation email has been dispatched.', 'success');
        // Refresh applications to reflect apply state
        const appsRes = await apiClient.get('/applications/my-applications');
        if (appsRes.data.success) {
          setMyApplications(appsRes.data.applications);
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit application.';
      toast(message, 'error');
    } finally {
      setApplyingId(null);
    }
  };

  const getEligibility = (company) => {
    if (!user) return { eligible: false, reason: '' };

    // Check CGPA
    if (user.cgpa < company.minCGPA) {
      return { 
        eligible: false, 
        reason: `Requires CGPA ${company.minCGPA} (Yours: ${user.cgpa})` 
      };
    }

    // Check Branch
    if (!company.allowedBranches.includes(user.branch)) {
      return { 
        eligible: false, 
        reason: `Allows branches: ${company.allowedBranches.join(', ')} (Yours: ${user.branch})` 
      };
    }

    return { eligible: true, reason: '' };
  };

  const checkHasApplied = (companyId) => {
    const app = myApplications.find(a => a.company?._id === companyId);
    return app ? { hasApplied: true, status: app.status } : { hasApplied: false, status: '' };
  };

  const clearFilters = () => {
    setSearch('');
    setBranchFilter('');
    setSortOrder('');
    setMinPackage('');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">Recruitment Openings</h1>
          <p className="text-gray-400 text-sm mt-1">Explore job openings, evaluate eligibility criteria, and submit applications.</p>
        </div>
        <button
          onClick={fetchData}
          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-300 transition-colors w-fit flex items-center space-x-1.5 text-xs font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Station */}
      <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <SlidersHorizontal className="h-4 w-4 text-purple-400" />
          <span>Filter Station</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
            />
          </div>

          {/* Branch Select */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm font-medium"
          >
            <option value="" className="bg-zinc-950">Filter Branch</option>
            <option value="CSE" className="bg-zinc-950">CSE</option>
            <option value="IT" className="bg-zinc-950">IT</option>
            <option value="ECE" className="bg-zinc-950">ECE</option>
            <option value="EEE" className="bg-zinc-950">EEE</option>
            <option value="MECH" className="bg-zinc-950">MECH</option>
            <option value="CIVIL" className="bg-zinc-950">CIVIL</option>
          </select>

          {/* Package Filter */}
          <select
            value={minPackage}
            onChange={(e) => setMinPackage(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm font-medium"
          >
            <option value="" className="bg-zinc-950">Min Salary (LPA)</option>
            <option value="5" className="bg-zinc-950">5+ LPA</option>
            <option value="10" className="bg-zinc-950">10+ LPA</option>
            <option value="15" className="bg-zinc-950">15+ LPA</option>
            <option value="20" className="bg-zinc-950">20+ LPA</option>
            <option value="30" className="bg-zinc-950">30+ LPA</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm font-medium"
          >
            <option value="" className="bg-zinc-950">Sort By Salary</option>
            <option value="high" className="bg-zinc-950">Salary: High to Low</option>
            <option value="low" className="bg-zinc-950">Salary: Low to High</option>
          </select>
        </div>

        {/* Clear Filters Indicator */}
        {(search || branchFilter || minPackage || sortOrder) && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-2"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* Companies List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {companies.map((company) => {
              const { eligible, reason } = getEligibility(company);
              const { hasApplied, status } = checkHasApplied(company._id);
              return (
                <div key={company._id} className="h-full">
                  <CompanyCard
                    company={company}
                    onApply={handleApply}
                    isEligible={eligible}
                    eligibilityReason={reason}
                    hasApplied={hasApplied}
                    applicationStatus={status}
                    isApplying={applyingId === company._id}
                  />
                </div>
              );
            })}
          </AnimatePresence>

          {companies.length === 0 && (
            <div className="col-span-full glass p-12 rounded-3xl border border-white/5 text-center text-gray-500 space-y-3">
              <Search className="h-10 w-10 text-gray-600 mx-auto" />
              <h3 className="text-lg font-bold text-white font-display">No companies found</h3>
              <p className="text-sm max-w-sm mx-auto">Try adjusting your filters, searching for alternate titles, or clearing search tags.</p>
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white font-semibold text-xs transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCompanies;
