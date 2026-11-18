import React from 'react';
import { DriftMonitoringView } from '../../components/views/DriftMonitoringView';

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Evidently AI Statistical Drift Monitoring</h1>
        <p className="text-xs text-slate-400 mt-1">
          Two-sample Kolmogorov-Smirnov test and Population Stability Index (PSI) tracking data divergence from baseline dataset v1.0.0.
        </p>
      </div>
      <DriftMonitoringView />
    </div>
  );
};

export default AnalyticsPage;
