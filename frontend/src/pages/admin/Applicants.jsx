import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { TableRowSkeleton } from '../../components/SkeletonLoader';
import { Building2, FileText, Eye, CheckCircle2, Loader2, ArrowRightLeft, Users, RefreshCw } from 'lucide-react';

const AdminApplicants = () => {
  const { toast } = useToast();

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [applicants, setApplicants] = useState([]);
  
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Load companies list on mount
  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const response = await apiClient.get('/companies');
      if (response.data.success) {
        setCompanies(response.data.companies);
        if (response.data.companies.length > 0) {
          // Auto select first company
          setSelectedCompanyId(response.data.companies[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
      toast('Failed to load companies dropdown list.', 'error');
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchApplicants = async (companyId) => {
    if (!companyId) return;
    try {
      setLoadingApplicants(true);
      const response = await apiClient.get(`/applications/company/${companyId}`);
      if (response.data.success) {
        setApplicants(response.data.applications);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err);
      toast('Failed to load applicants for this company.', 'error');
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchApplicants(selectedCompanyId);
    } else {
      setApplicants([]);
    }
  }, [selectedCompanyId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      const response = await apiClient.put(`/applications/${applicationId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        toast(`Application status updated to "${newStatus}"! Notification email dispatched.`, 'success');
        // Refresh list to update state
        fetchApplicants(selectedCompanyId);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      const message = err.response?.data?.message || 'Failed to update status.';
      toast(message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">Applicant Tracking System</h1>
          <p className="text-gray-400 text-sm mt-1">Review student applications, inspect resumes, and update recruitment status rounds.</p>
        </div>
        
        {/* Select Company Dropdown */}
        <div className="flex items-center space-x-3">
          {selectedCompanyId && (
            <button
              onClick={() => fetchApplicants(selectedCompanyId)}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-300 transition-colors w-fit flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 animate-none" />
            </button>
          )}
          
          <div className="relative min-w-[200px]">
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              disabled={loadingCompanies}
              className="w-full pl-3 pr-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm font-semibold appearance-none cursor-pointer"
            >
              {loadingCompanies ? (
                <option>Loading companies...</option>
              ) : companies.length > 0 ? (
                companies.map((c) => (
                  <option key={c._id} value={c._id} className="bg-zinc-950">
                    {c.companyName} ({c.role})
                  </option>
                ))
              ) : (
                <option value="">No companies posted</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Applicants ledger */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase font-bold text-gray-400 bg-white/5 border-b border-white/5 tracking-wider">
              <tr>
                <th className="px-6 py-4">Student Details</th>
                <th className="px-6 py-4">Academic Record</th>
                <th className="px-6 py-4">Skills Profile</th>
                <th className="px-6 py-4 text-center">Resume</th>
                <th className="px-6 py-4">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadingApplicants ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))
              ) : applicants.length > 0 ? (
                applicants.map((app) => (
                  <tr key={app._id} className="hover:bg-white/3 transition-colors duration-150">
                    {/* Student Name / Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-purple-400 text-xs">
                          {app.student?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white font-display">{app.student?.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{app.student?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Branch / CGPA */}
                    <td className="px-6 py-4 text-xs">
                      <div>
                        <p className="font-semibold text-gray-300">{app.student?.branch}</p>
                        <p className="text-gray-500 font-medium">CGPA: <strong className="text-white">{app.student?.cgpa}</strong></p>
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {app.student?.skills && app.student.skills.length > 0 ? (
                          app.student.skills.map((s, idx) => (
                            <span 
                              key={idx} 
                              className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/5"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-600 italic">No skills listed</span>
                        )}
                      </div>
                    </td>

                    {/* Resume view */}
                    <td className="px-6 py-4 text-center">
                      {app.student?.resume ? (
                        <a
                          href={app.student.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/5 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </a>
                      ) : (
                        <span className="text-xs text-rose-400/70 italic">No resume</span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {updatingId === app._id ? (
                          <Loader2 className="h-4 w-4 text-purple-400 animate-spin flex-shrink-0" />
                        ) : (
                          <ArrowRightLeft className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                        )}
                        <select
                          value={app.status}
                          disabled={updatingId === app._id}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs font-semibold focus:outline-none transition-colors ${
                            app.status === 'Hired'
                              ? 'text-emerald-400 border-emerald-500/25'
                              : app.status === 'Shortlisted'
                              ? 'text-cyan-400 border-cyan-500/25'
                              : app.status === 'Rejected'
                              ? 'text-rose-400 border-rose-500/25'
                              : 'text-amber-400 border-amber-500/25'
                          }`}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    <Users className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white font-display">No applicants registered</h3>
                    <p className="text-xs max-w-xs mx-auto mt-1">Students have not applied for this company listing yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicants;
