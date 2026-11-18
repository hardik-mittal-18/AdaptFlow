import React from 'react';
import { PredictionCenterView } from '../../components/views/PredictionCenterView';

export const PredictionPage = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Customer Churn Inference Center</h1>
        <p className="text-xs text-slate-400 mt-1">
          Input customer demographics, service plans, and billing configurations to compute calibrated churn risk.
        </p>
      </div>
      <PredictionCenterView />
    </div>
  );
};

export default PredictionPage;
