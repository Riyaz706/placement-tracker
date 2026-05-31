import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { TableRowSkeleton } from '../../components/SkeletonLoader';
import StatusBadge from '../../components/StatusBadge';
import { FileText, Briefcase, Calendar, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/applications/my-applications');
      if (response.data.success) {
        setApplications(response.data.applications);
        if (response.data.applications.length > 0) {
          setSelectedApp(response.data.applications[0]); // Default to first application in timeline
        }
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      toast('Failed to load your applications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getTimelineSteps = (app) => {
    if (!app) return [];
    const steps = [
      { name: 'Applied', desc: 'Application received by TPO.', done: true },
      { 
        name: 'Shortlisted', 
        desc: 'Academic & resume screening clearance.', 
        done: app.status === 'Shortlisted' || app.status === 'Hired'
      },
      { 
        name: app.status === 'Rejected' ? 'Rejected' : 'Hired', 
        desc: app.status === 'Rejected' ? 'Application dismissed.' : 'Offer letter generated!', 
        done: app.status === 'Hired' || app.status === 'Rejected',
        isCritical: true,
        type: app.status
      }
    ];
    return steps;
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">Application Ledger</h1>
        <p className="text-gray-400 text-sm mt-1">Track recruitment statuses, timelines, and screening results.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Applications List Table */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold font-display text-white">Submission History</h2>
          
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs uppercase font-bold text-gray-400 bg-white/5 border-b border-white/5 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Salary Package</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRowSkeleton key={i} cols={4} />
                    ))
                  ) : applications.length > 0 ? (
                    applications.map((app) => (
                      <tr 
                        key={app._id}
                        onClick={() => setSelectedApp(app)}
                        className={`hover:bg-white/5 cursor-pointer transition-colors duration-150 ${
                          selectedApp?._id === app._id ? 'bg-purple-600/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-white">
                          <div>
                            <p className="font-bold font-display">{app.company?.companyName}</p>
                            <p className="text-xs text-gray-500 font-medium">{app.company?.role}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-display font-bold text-cyan-400">
                          {app.company?.package} LPA
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        <FileText className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-sm font-semibold">No applications submitted yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Application Timeline Card */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-display text-white">Process Tracker</h2>

          {selectedApp ? (
            <motion.div
              key={selectedApp._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 rounded-2xl border border-white/5 space-y-6"
            >
              {/* Card Header Info */}
              <div className="border-b border-white/5 pb-4">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-400 mb-2">
                  ID: #{selectedApp._id.substring(selectedApp._id.length - 8).toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-white font-display leading-tight">{selectedApp.company?.companyName}</h3>
                <p className="text-xs text-purple-400 font-medium">{selectedApp.company?.role}</p>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/15">
                {getTimelineSteps(selectedApp).map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Node Dot */}
                    <div 
                      className={`absolute -left-6 top-1 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center -translate-x-1/2 ${
                        step.done
                          ? step.type === 'Rejected'
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-zinc-950 border-white/20'
                      }`}
                    >
                      {step.done && <ShieldCheck className="h-3 w-3" />}
                    </div>

                    <h4 className={`text-sm font-bold font-display ${
                      step.done 
                        ? step.type === 'Rejected'
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                        : 'text-gray-400'
                    }`}>
                      {step.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium pr-2">{step.desc}</p>
                  </div>
                ))}
              </div>

              {/* Timestamps */}
              <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Last status update:</span>
                  <span className="font-semibold text-white">{formatDate(selectedApp.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Submission timestamp:</span>
                  <span className="font-semibold text-white">{formatDate(selectedApp.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass p-8 rounded-2xl border border-white/5 text-center text-gray-500">
              <HelpCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs font-semibold">Select an application from the history list to inspect its process timeline.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentApplications;
