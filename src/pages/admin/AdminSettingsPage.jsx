import React from 'react';
import { SettingsView } from '../../components/views/SettingsView';

export const AdminSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Configuration & Thresholds</h1>
        <p className="text-xs text-slate-400 mt-1">
          Tune automated retraining trigger quotas, drift confidence thresholds, and model deployment gates.
        </p>
      </div>
      <SettingsView />
    </div>
  );
};

export default AdminSettingsPage;
