import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  FileText,
  ExternalLink
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";

export const DriftMonitoringView = () => {
  const { driftReport, refreshData, showToast } = useApp();
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleRunDriftCheck = async () => {
    setIsRunningCheck(true);
    try {
      await api.runMonitoringCheck();
      showToast("Statistical drift check completed against live window.", "success");
      refreshData();
    } catch (err) {
      showToast(err.message || "Drift check failed", "error");
    } finally {
      setIsRunningCheck(false);
    }
  };

  const currentFeature = selectedFeature || (driftReport?.featureDriftResults?.[0] ?? {
    feature: "MonthlyCharges",
    testName: "2-Sample KS",
    driftScore: 0.22,
    pValue: 0.012,
    driftDetected: true,
    threshold: 0.05
  });

  const driftStatus = driftReport?.status || "warning";

  const distributionData = [
    { bucket: "< $35", reference: 28, production: 14 },
    { bucket: "$35-$65", reference: 22, production: 18 },
    { bucket: "$65-$85", reference: 30, production: 42 },
    { bucket: "$85-$105", reference: 15, production: 21 },
    { bucket: "> $105", reference: 5, production: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 border ${
              driftStatus === "warning"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            }`}
          >
            {driftStatus === "warning" ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Evidently AI Statistical Drift Monitor
              </h2>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  driftStatus === "warning"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {driftStatus === "warning" ? "Dataset Drift Detected" : "Distribution In-Bounds"}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-1 max-w-2xl">
              Comparing Reference Baseline Dataset (<span className="font-mono font-semibold text-blue-400">v1.0.0</span>, 7,043 samples) against Live Production Inferences. Evaluates 2-Sample Kolmogorov-Smirnov test for numerical features and PSI for categorical features.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={api.getDriftReportHtmlUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive Report</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={handleRunDriftCheck}
            disabled={isRunningCheck}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningCheck ? "animate-spin" : ""}`} />
            <span>{isRunningCheck ? "Testing KS Curves..." : "Run Drift Check"}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Drifted Features
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {driftReport?.driftedFeaturesCount ?? 2}{" "}
            <span className="text-xs font-normal text-slate-400">
              / {driftReport?.totalFeaturesCount ?? 7} Monitored
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-amber-400 font-semibold font-mono">
              {driftReport?.driftShare ?? 28.5}%
            </span>
            <span>drift share (threshold &gt;15%)</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Primary Drift Factor
          </div>
          <div className="text-xl font-bold text-rose-400 mt-1 truncate font-mono">
            MonthlyCharges
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            KS-Statistic: 0.220 (p = 0.012)
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Reference Dataset
          </div>
          <div className="text-xl font-bold text-blue-400 mt-1 font-mono">
            v1.0.0
          </div>
          <div className="text-xs text-slate-400 mt-2">
            7,043 validated baseline rows
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Retraining Trigger
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1 flex items-center gap-1.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Candidate Ready</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Automated loop initiated candidate v1.1.0
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Features Table & Interactive Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monitored Features List */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white">
              Feature Drift Evaluation Table
            </h3>
            <span className="text-[11px] text-slate-400">Click row to inspect distribution</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase font-mono text-[10px]">
                  <th className="pb-2.5">Feature</th>
                  <th className="pb-2.5">Test</th>
                  <th className="pb-2.5">Score</th>
                  <th className="pb-2.5">p-Value</th>
                  <th className="pb-2.5 text-right">Drift Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {(driftReport?.featureDriftResults || [
                  { feature: "tenure", testName: "2-Sample KS", driftScore: 0.24, pValue: 0.0084, driftDetected: true, threshold: 0.05 },
                  { feature: "MonthlyCharges", testName: "2-Sample KS", driftScore: 0.22, pValue: 0.012, driftDetected: true, threshold: 0.05 },
                  { feature: "Contract", testName: "PSI", driftScore: 0.185, pValue: 0.021, driftDetected: true, threshold: 0.10 },
                  { feature: "InternetService", testName: "PSI", driftScore: 0.042, pValue: 0.450, driftDetected: false, threshold: 0.10 },
                  { feature: "PaymentMethod", testName: "PSI", driftScore: 0.038, pValue: 0.520, driftDetected: false, threshold: 0.10 },
                  { feature: "TotalCharges", testName: "2-Sample KS", driftScore: 0.061, pValue: 0.342, driftDetected: false, threshold: 0.05 }
                ]).map((f) => {
                  const isSelected = currentFeature?.feature === f.feature;
                  return (
                    <tr
                      key={f.feature}
                      onClick={() => setSelectedFeature(f)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-600/20 font-medium" : "hover:bg-slate-800/50"
                      }`}
                    >
                      <td className="py-3 font-semibold text-white">
                        {f.feature}
                      </td>
                      <td className="py-3 text-slate-400 text-[11px]">{f.testName}</td>
                      <td className="py-3 text-slate-300">{f.driftScore}</td>
                      <td className={`py-3 font-bold ${f.driftDetected ? "text-rose-400" : "text-emerald-400"}`}>
                        {f.pValue}
                      </td>
                      <td className="py-3 text-right">
                        {f.driftDetected ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3 text-rose-400" /> Drift
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Safe
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Distribution Shift Histogram for Selected Feature */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Distribution Shift:</span>
                  <span className="font-mono text-blue-400">{currentFeature?.feature}</span>
                </h3>
                <div className="text-xs text-slate-400">
                  Statistical test: {currentFeature?.testName} · Score: {currentFeature?.driftScore} (Threshold: {currentFeature?.threshold || 0.05})
                </div>
              </div>

              {currentFeature?.driftDetected && (
                <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-1 rounded">
                  Shift Detected
                </span>
              )}
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#020617", borderColor: "#1E293B", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                    formatter={(val) => [`${val}%`, "Frequency"]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar dataKey="reference" name="Reference Baseline %" fill="#64748B" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="production"
                    name="Current Production %"
                    fill={currentFeature?.driftDetected ? "#F43F5E" : "#3B82F6"}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs mt-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                {currentFeature?.driftDetected
                  ? "Significant distribution shift detected. Retraining engine has prepared candidate model."
                  : "Feature distribution is statistically consistent with baseline reference."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriftMonitoringView;
