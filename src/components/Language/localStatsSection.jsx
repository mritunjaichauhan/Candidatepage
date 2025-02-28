import React from "react";

const LocalStatsSection = ({ stats = {} }) => {
  return (
    <div className="stats-container p-4 rounded-lg bg-slate-50 dark:bg-slate-800 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Local Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="stat-item p-3 bg-white dark:bg-slate-700 rounded-md">
            <div className="stat-label text-sm text-gray-500 dark:text-gray-400">{key}</div>
            <div className="stat-value text-xl font-bold">{value}</div>
          </div>
        ))}
        
        {/* Fallback for no stats */}
        {Object.keys(stats).length === 0 && (
          <div className="col-span-full text-center py-6 text-gray-500">
            No statistics available
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalStatsSection;
