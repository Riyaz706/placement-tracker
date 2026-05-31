import React from 'react';
import { CheckCircle2, XCircle, Clock, Award } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Hired':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: <Award className="h-3.5 w-3.5 mr-1.5" />,
        };
      case 'Shortlisted':
        return {
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />,
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: <XCircle className="h-3.5 w-3.5 mr-1.5" />,
        };
      default: // Applied / Pending
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <Clock className="h-3.5 w-3.5 mr-1.5" />,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg}`}>
      {style.icon}
      {status}
    </span>
  );
};

export default StatusBadge;
