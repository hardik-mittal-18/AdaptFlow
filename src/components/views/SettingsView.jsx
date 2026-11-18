import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Lock,
  RotateCcw
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";
import { Toggle } from "../ui/Toggle";

export const SettingsView = () => {
  const { currentUser, showToast, refreshData } = useApp();
  const [config, setConfig] = useState({
    driftThreshold: 0.15,
    minFeedbackSamplesForRetrain: 25,
    minAccuracyRequirement: 0.80,
    minF1Requirement: 0.76,
    minRocAucRequirement: 0.82,
    autoRetrainOnDrift: true,
    requireAdminApprovalForDeploy: true,
    retrainingCooldownHours: 24
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateConfig(config);
      showToast("Platform policies and retraining thresholds updated successfully.", "success");
      refreshData();
    } catch (err) {
      showToast(err.message || "Failed to update configuration", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl shrink-0 border border-blue-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Monitoring Thresholds &amp; Self-Adaptive Retraining Policies
            </h2>
            <div className="text-xs text-slate-300 mt-1 max-w-2xl">
              Configure automated trigger sensitivity, statistical drift tolerances, feedback quotas, and model validation gate acceptance thresholds.
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Drift Threshold */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                Evidently AI Statistical Drift Threshold
              </label>
              <span className="text-xs font-mono font-bold text-blue-400">
                {(config.driftThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Maximum allowable Kolmogorov-Smirnov statistic or PSI before triggering retraining alert.
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.01"
              value={config.driftThreshold}
              onChange={(e) => setConfig({ ...config, driftThreshold: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Min Feedback Quota */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                Minimum Verified Feedback Samples for Retrain
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {config.minFeedbackSamplesForRetrain} records
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Minimum number of verified customer ground truths required to initiate automated retraining.
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={config.minFeedbackSamplesForRetrain}
              onChange={(e) => setConfig({ ...config, minFeedbackSamplesForRetrain: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Min Accuracy Requirement */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                Candidate Model Min Accuracy Gate
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {(config.minAccuracyRequirement * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Candidate models failing this validation gate will be rejected automatically.
            </div>
            <input
              type="range"
              min="0.70"
              max="0.90"
              step="0.01"
              value={config.minAccuracyRequirement}
              onChange={(e) => setConfig({ ...config, minAccuracyRequirement: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Retraining Cooldown */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                Retraining Cooldown Period
              </label>
              <span className="text-xs font-mono font-bold text-blue-400">
                {config.retrainingCooldownHours} Hours
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Prevents duplicate continuous retraining runs while feedback is being validated.
            </div>
            <input
              type="range"
              min="6"
              max="72"
              step="6"
              value={config.retrainingCooldownHours}
              onChange={(e) => setConfig({ ...config, retrainingCooldownHours: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* Interactive Toggles */}
        <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">
                Auto-Retrain on Drift Threshold Breach
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Automatically kick off the DVC retraining workflow when Evidently AI detects statistical feature drift.
              </div>
            </div>
            <Toggle
              checked={config.autoRetrainOnDrift}
              onChange={(val) => setConfig({ ...config, autoRetrainOnDrift: val })}
            />
          </div>

          <div className="border-t border-slate-800" />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">
                Require Admin Signoff for Production Deployment
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Ensures human-in-the-loop governance before any candidate model receives live user traffic.
              </div>
            </div>
            <Toggle
              checked={config.requireAdminApprovalForDeploy}
              onChange={(val) => setConfig({ ...config, requireAdminApprovalForDeploy: val })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving Policy..." : "Save Monitoring Thresholds"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
