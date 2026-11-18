import React from 'react';
import { DeploymentCenterView } from '../../components/views/DeploymentCenterView';

export const DeploymentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Blue-Green Deployments & Rollback Gate</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review candidate model lift, inspect latency verification benchmarks, and execute 1-click canary rollouts.
        </p>
      </div>
      <DeploymentCenterView />
    </div>
  );
};

export default DeploymentsPage;
