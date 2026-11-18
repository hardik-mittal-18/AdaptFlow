import React from 'react';
import { AuditLogsView } from '../../components/views/AuditLogsView';

export const LogsPage = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Audit Trail & Operational Telemetry</h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically hashed immutable audit events and real-time Prometheus system metrics.
        </p>
      </div>
      <AuditLogsView />
    </div>
  );
};

export default LogsPage;
