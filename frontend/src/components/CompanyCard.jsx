import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, Award, GraduationCap, Code2, ShieldAlert } from 'lucide-react';
import StatusBadge from './StatusBadge';

const CompanyCard = ({ 
  company, 
  onApply, 
  onEdit, 
  onDelete, 
  isAdmin = false, 
  isEligible = true,
  eligibilityReason = '',
  hasApplied = false, 
  applicationStatus = '',
  isApplying = false 
}) => {
  const {
    companyName,
    role,
    package: salaryPackage,
    minCGPA,
    allowedBranches,
    requiredSkills,
    deadline,
    description
  } = company;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isDeadlinePassed = new Date(deadline) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`glass glass-hover p-6 rounded-2xl flex flex-col relative overflow-hidden h-full ${
        !isEligible && !isAdmin ? 'opacity-70' : ''
      }`}
    >
      {/* Dynamic Glow Accent */}
      <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/20 mb-2">
            {role}
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight font-display mb-1">{companyName}</h3>
        </div>

        {/* Package Stat */}
        <div className="text-right">
          <p className="text-2xl font-extrabold text-cyan-400 font-display">{salaryPackage} <span className="text-xs text-gray-500 font-medium">LPA</span></p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-5 line-clamp-2 min-h-[40px]">{description || 'No description provided.'}</p>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4 mb-5 text-sm text-gray-400 border-t border-b border-white/5 py-4 my-auto">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-4 w-4 text-purple-400 flex-shrink-0" />
          <span>Min. CGPA: <strong className="text-white">{minCGPA}</strong></span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-purple-400 flex-shrink-0" />
          <span className={isDeadlinePassed ? 'text-rose-400' : ''}>
            Deadline: <strong className="text-white">{formatDate(deadline)}</strong>
          </span>
        </div>
        <div className="col-span-2 flex items-start space-x-2">
          <Briefcase className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <span className="truncate">
            Branches: <strong className="text-white">{allowedBranches.join(', ')}</strong>
          </span>
        </div>
      </div>

      {/* Skills Required */}
      {requiredSkills && requiredSkills.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
            <Code2 className="h-3 w-3 mr-1 text-cyan-400" /> Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-gray-300 border border-white/5"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-auto pt-2">
        {isAdmin ? (
          <div className="flex space-x-3 w-full">
            <button
              onClick={() => onEdit(company)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition-all duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(company._id)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/20 font-semibold text-sm hover:bg-rose-600/30 hover:text-white transition-all duration-200"
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="w-full">
            {hasApplied ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-gray-500 font-semibold">Application:</span>
                <StatusBadge status={applicationStatus} />
              </div>
            ) : !isEligible ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-start space-x-2 text-xs text-rose-400/80 bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-xl">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                  <span>{eligibilityReason || 'You are not eligible for this company.'}</span>
                </div>
                <button
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed font-bold text-sm"
                >
                  Ineligible
                </button>
              </div>
            ) : isDeadlinePassed ? (
              <button
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed font-bold text-sm"
              >
                Deadline Expired
              </button>
            ) : (
              <button
                onClick={() => onApply(company._id)}
                disabled={isApplying}
                className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-98 disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-600/25 glow-button"
              >
                {isApplying ? 'Applying...' : 'Apply Now'}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompanyCard;
