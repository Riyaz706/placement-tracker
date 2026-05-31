import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="glass p-6 rounded-2xl animate-pulse space-y-4 h-full">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/10 rounded w-1/4"></div>
          <div className="h-6 bg-white/10 rounded w-3/4"></div>
        </div>
        <div className="h-8 bg-white/10 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
      </div>
      <div className="border-t border-b border-white/5 py-4 grid grid-cols-2 gap-4">
        <div className="h-4 bg-white/10 rounded"></div>
        <div className="h-4 bg-white/10 rounded"></div>
        <div className="h-4 bg-white/10 rounded col-span-2"></div>
      </div>
      <div className="h-10 bg-white/10 rounded-xl w-full"></div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
        </td>
      ))}
    </tr>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass p-6 rounded-2xl animate-pulse space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-white/10 rounded w-20"></div>
            <div className="h-8 w-8 bg-white/10 rounded-lg"></div>
          </div>
          <div className="h-8 bg-white/10 rounded w-16"></div>
          <div className="h-3 bg-white/10 rounded w-28"></div>
        </div>
      ))}
    </div>
  );
};
