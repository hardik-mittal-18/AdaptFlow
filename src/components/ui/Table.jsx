import React from 'react';
import PropTypes from 'prop-types';

export const Table = ({ children, className = '' }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/50">
    <table className={`w-full text-left text-sm text-slate-300 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className = '' }) => (
  <thead className={`bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 ${className}`}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-slate-800/60 ${className}`}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', hover = true }) => (
  <tr className={`transition-colors duration-150 ${hover ? 'hover:bg-slate-800/40' : ''} ${className}`}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = '' }) => (
  <th className={`px-4 py-3.5 ${className}`}>{children}</th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-4 py-3.5 text-sm ${className}`}>{children}</td>
);

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => (
  <div className={`flex flex-wrap gap-1 rounded-xl bg-slate-950/60 p-1 border border-slate-800/80 ${className}`}>
    {tabs.map((tab) => {
      const isActive = activeTab === tab.id;
      const Icon = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            isActive
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          {Icon && <Icon className="h-3.5 w-3.5" />}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'}`}>
              {tab.badge}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export const Skeleton = ({ className = '', rounded = 'rounded-md' }) => (
  <div className={`animate-pulse bg-slate-800/60 ${rounded} ${className}`} />
);

export const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'There is no data available to display right now.',
  action
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
    {Icon && (
      <div className="rounded-2xl bg-slate-800/50 p-4 text-slate-400 mb-3 border border-slate-700/40">
        <Icon className="h-8 w-8" />
      </div>
    )}
    <h4 className="text-sm font-semibold text-white">{title}</h4>
    <p className="mt-1 text-xs text-slate-400 max-w-sm">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
