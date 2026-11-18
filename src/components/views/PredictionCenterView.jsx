import React, { useState } from "react";
import {
  BrainCircuit,
  Zap,
  CheckCircle2,
  Sliders,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Layers,
  CreditCard,
  Wifi,
  FileText,
  User,
  Users,
  Tv,
  Film,
  Lock,
  Headphones,
  HardDrive,
  Activity,
  ArrowRight
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../services/api";
import { Toggle } from "../ui/Toggle";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const DEFAULT_FEATURES = {
  gender: "Female",
  seniorCitizen: 0,
  partner: "No",
  dependents: "No",
  tenure: 2,
  phoneService: "Yes",
  multipleLines: "No",
  internetService: "Fiber optic",
  onlineSecurity: "No",
  onlineBackup: "No",
  deviceProtection: "No",
  techSupport: "No",
  streamingTV: "Yes",
  streamingMovies: "Yes",
  contract: "Month-to-month",
  paperlessBilling: "Yes",
  paymentMethod: "Electronic check",
  monthlyCharges: 92.5,
  totalCharges: 185.0
};

export const PredictionCenterView = () => {
  const { recentPredictions, showToast, refreshData, productionModel } = useApp();
  const { isDark } = useTheme();
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [customerId, setCustomerId] = useState("CUST-8492");
  const [isPredicting, setIsPredicting] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [feedbackModalTarget, setFeedbackModalTarget] = useState(null);
  const [actualOutcome, setActualOutcome] = useState("Churn");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Helper for boolean toggle switches
  const isToggleOn = (key) => {
    if (key === "seniorCitizen") return features.seniorCitizen === 1;
    return features[key] === "Yes";
  };

  const handleToggle = (key, val) => {
    if (key === "seniorCitizen") {
      setFeatures((prev) => ({ ...prev, seniorCitizen: val ? 1 : 0 }));
    } else {
      setFeatures((prev) => ({ ...prev, [key]: val ? "Yes" : "No" }));
    }
  };

  const loadPreset = (presetType) => {
    const newId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    setCustomerId(newId);

    if (presetType === "high_risk") {
      setFeatures({
        gender: "Female",
        seniorCitizen: 1,
        partner: "No",
        dependents: "No",
        tenure: 3,
        phoneService: "Yes",
        multipleLines: "Yes",
        internetService: "Fiber optic",
        onlineSecurity: "No",
        onlineBackup: "No",
        deviceProtection: "No",
        techSupport: "No",
        streamingTV: "Yes",
        streamingMovies: "Yes",
        contract: "Month-to-month",
        paperlessBilling: "Yes",
        paymentMethod: "Electronic check",
        monthlyCharges: 104.5,
        totalCharges: 313.5
      });
      showToast("Loaded preset: High Risk Fiber Optic Churner", "info");
    } else if (presetType === "loyal") {
      setFeatures({
        gender: "Male",
        seniorCitizen: 0,
        partner: "Yes",
        dependents: "Yes",
        tenure: 62,
        phoneService: "Yes",
        multipleLines: "Yes",
        internetService: "DSL",
        onlineSecurity: "Yes",
        onlineBackup: "Yes",
        deviceProtection: "Yes",
        techSupport: "Yes",
        streamingTV: "No",
        streamingMovies: "No",
        contract: "Two year",
        paperlessBilling: "No",
        paymentMethod: "Credit card (automatic)",
        monthlyCharges: 64.0,
        totalCharges: 3968.0
      });
      showToast("Loaded preset: Loyal 2-Year Contract Family", "info");
    } else if (presetType === "streamer") {
      setFeatures({
        gender: "Male",
        seniorCitizen: 0,
        partner: "Yes",
        dependents: "No",
        tenure: 14,
        phoneService: "Yes",
        multipleLines: "Yes",
        internetService: "Fiber optic",
        onlineSecurity: "Yes",
        onlineBackup: "Yes",
        deviceProtection: "No",
        techSupport: "Yes",
        streamingTV: "Yes",
        streamingMovies: "Yes",
        contract: "Month-to-month",
        paperlessBilling: "Yes",
        paymentMethod: "Bank transfer (automatic)",
        monthlyCharges: 89.2,
        totalCharges: 1248.8
      });
      showToast("Loaded preset: Fiber Streamer with Tech Support", "info");
    } else if (presetType === "budget") {
      setFeatures({
        gender: "Female",
        seniorCitizen: 0,
        partner: "No",
        dependents: "No",
        tenure: 18,
        phoneService: "Yes",
        multipleLines: "No",
        internetService: "No",
        onlineSecurity: "No internet service",
        onlineBackup: "No internet service",
        deviceProtection: "No internet service",
        techSupport: "No internet service",
        streamingTV: "No internet service",
        streamingMovies: "No internet service",
        contract: "One year",
        paperlessBilling: "No",
        paymentMethod: "Mailed check",
        monthlyCharges: 20.4,
        totalCharges: 367.2
      });
      showToast("Loaded preset: Budget Phone-Only User", "info");
    }
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setIsPredicting(true);
    try {
      const result = await api.predict(features, customerId);
      setCurrentResult(result);
      showToast(
        `Prediction generated: ${result.prediction} (${(result.churnProbability * 100).toFixed(1)}% risk)`,
        "success"
      );
      refreshData();
    } catch (err) {
      showToast(err.message || "Prediction failed", "error");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackModalTarget) return;
    setIsSubmittingFeedback(true);
    try {
      await api.submitFeedback(feedbackModalTarget.id, actualOutcome, feedbackComments);
      showToast(`Ground truth recorded for ${feedbackModalTarget.customerId}: ${actualOutcome}`, "success");
      setFeedbackModalTarget(null);
      setFeedbackComments("");
      refreshData();
    } catch (err) {
      showToast(err.message || "Failed to submit feedback", "error");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Customer Preset Profiles */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 dark:bg-slate-900/90 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Quick Customer Profiles:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => loadPreset("high_risk")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <span>🚨 High Risk Churner</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset("loyal")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <span>🛡️ Loyal 2-Yr Family</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset("streamer")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 transition-all flex items-center gap-1.5"
            >
              <span>📺 Fiber Streamer</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset("budget")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>🏷️ Budget User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Feature Input Form + Model Output Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Feature Form with Toggles */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800/80 bg-slate-900/90 dark:bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-blue-400" />
                <span>Customer Churn Feature Input Form</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Processed with active production model ({productionModel?.name || "v1.0.0 Optuna XGBoost"})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono font-semibold">Customer ID:</span>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-32 px-2.5 py-1 text-xs font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <form onSubmit={handlePredict} className="space-y-6">
            {/* Section 1: Contract, Plan & Billing (Segmented Controls) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Contract Term &amp; Commitment
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: "Month-to-month", label: "Month-to-Month", note: "High Risk" },
                  { value: "One year", label: "1 Year Contract", note: "Moderate" },
                  { value: "Two year", label: "2 Year Contract", note: "Highest Retention" }
                ].map((item) => {
                  const selected = features.contract === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFeatures({ ...features, contract: item.value })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selected
                          ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className={`text-[10px] mt-0.5 ${selected ? "text-blue-300 font-medium" : "text-slate-500"}`}>
                        {item.note}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Internet Service & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Internet Service Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Fiber optic", "DSL", "No"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFeatures({ ...features, internetService: type })}
                      className={`py-2 px-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        features.internetService === type
                          ? "bg-blue-600/20 border-blue-500 text-white"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Payment Method
                </label>
                <select
                  value={features.paymentMethod}
                  onChange={(e) => setFeatures({ ...features, paymentMethod: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:border-blue-500 focus:outline-none"
                >
                  <option value="Electronic check" className="bg-slate-900 text-white">Electronic check</option>
                  <option value="Mailed check" className="bg-slate-900 text-white">Mailed check</option>
                  <option value="Bank transfer (automatic)" className="bg-slate-900 text-white">Bank transfer (automatic)</option>
                  <option value="Credit card (automatic)" className="bg-slate-900 text-white">Credit card (automatic)</option>
                </select>
              </div>
            </div>

            {/* Section 3: Sliders for Tenure & Charges with Live Numeric Bubbles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              {/* Tenure Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Tenure (Months with Company)</span>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {features.tenure} {features.tenure === 1 ? "month" : "months"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="72"
                  value={features.tenure}
                  onChange={(e) => {
                    const t = parseInt(e.target.value) || 0;
                    setFeatures({
                      ...features,
                      tenure: t,
                      totalCharges: Math.round(t * features.monthlyCharges * 10) / 10
                    });
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 mo (New)</span>
                  <span>36 mo (Mid)</span>
                  <span>72 mo (Veteran)</span>
                </div>
              </div>

              {/* Monthly Charges Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Monthly Charges ($)</span>
                  <span className="font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    ${Number(features.monthlyCharges).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="125"
                  step="0.5"
                  value={features.monthlyCharges}
                  onChange={(e) => {
                    const mc = parseFloat(e.target.value) || 18.0;
                    setFeatures({
                      ...features,
                      monthlyCharges: mc,
                      totalCharges: Math.round(features.tenure * mc * 10) / 10
                    });
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>$18.00 (Base)</span>
                  <span>$70.00 (Standard)</span>
                  <span>$125.00 (Premium)</span>
                </div>
              </div>
            </div>

            {/* Section 4: Interactive Toggles for Services & Add-ons */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Subscription Add-ons &amp; Security Services (Interactive Toggles)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Tech Support"
                    description="24/7 dedicated tier"
                    checked={isToggleOn("techSupport")}
                    onChange={(val) => handleToggle("techSupport", val)}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Online Security"
                    description="Firewall & threat shield"
                    checked={isToggleOn("onlineSecurity")}
                    onChange={(val) => handleToggle("onlineSecurity", val)}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Online Backup"
                    description="Cloud storage drive"
                    checked={isToggleOn("onlineBackup")}
                    onChange={(val) => handleToggle("onlineBackup", val)}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Device Protection"
                    description="Hardware warranty"
                    checked={isToggleOn("deviceProtection")}
                    onChange={(val) => handleToggle("deviceProtection", val)}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Streaming TV"
                    description="Live TV channels"
                    checked={isToggleOn("streamingTV")}
                    onChange={(val) => handleToggle("streamingTV", val)}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Streaming Movies"
                    description="On-demand library"
                    checked={isToggleOn("streamingMovies")}
                    onChange={(val) => handleToggle("streamingMovies", val)}
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Demographics & Billing Toggles */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Customer Demographics &amp; Invoicing
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Senior Citizen"
                    description="Age 65+"
                    checked={isToggleOn("seniorCitizen")}
                    onChange={(val) => handleToggle("seniorCitizen", val)}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Partner"
                    description="Has partner"
                    checked={isToggleOn("partner")}
                    onChange={(val) => handleToggle("partner", val)}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Dependents"
                    description="Has children"
                    checked={isToggleOn("dependents")}
                    onChange={(val) => handleToggle("dependents", val)}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Toggle
                    label="Paperless Bill"
                    description="E-invoicing"
                    checked={isToggleOn("paperlessBilling")}
                    onChange={(val) => handleToggle("paperlessBilling", val)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <Button
                type="submit"
                loading={isPredicting}
                variant="primary"
                size="lg"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 text-white font-bold text-sm tracking-wide uppercase"
              >
                <Zap className="h-4 w-4 mr-2 fill-white" />
                <span>Generate Live Churn Risk Prediction</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Model Output Analysis Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 dark:bg-slate-900/90 p-6 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Model Output Analysis
                </span>
                <Badge variant={currentResult ? "primary" : "secondary"} size="sm">
                  {currentResult ? "Computed (<0.2ms)" : "Awaiting Input"}
                </Badge>
              </div>

              {currentResult ? (
                <div className="space-y-6">
                  {/* Probability Gauge & Status */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                          Predicted Status
                        </div>
                        <div
                          className={`text-2xl font-black mt-0.5 ${
                            currentResult.churnProbability >= 0.5 ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          {currentResult.prediction}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                          Probability
                        </div>
                        <div className="text-2xl font-mono font-black text-white mt-0.5">
                          {(currentResult.churnProbability * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          currentResult.churnProbability >= 0.5 ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${currentResult.churnProbability * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                      <span>Risk Tier: <strong className={currentResult.churnProbability >= 0.5 ? "text-rose-400" : "text-emerald-400"}>{currentResult.riskLevel}</strong></span>
                      <span>Latency: <strong className="text-emerald-400">{currentResult.inferenceDurationMs || 0.12} ms</strong></span>
                    </div>
                  </div>

                  {/* Tree-Based SHAP Factors */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Key Risk Driving Factors (SHAP):</span>
                      <span className="text-[10px] text-slate-400 font-mono">TreeExplainer</span>
                    </div>

                    <div className="space-y-2">
                      {(currentResult.topFactors || currentResult.featureImportances || [
                        { feature: "Contract", direction: "positive", importance: 0.28 },
                        { feature: "tenure", direction: "positive", importance: 0.22 },
                        { feature: "MonthlyCharges", direction: "positive", importance: 0.16 },
                        { feature: "TechSupport", direction: "negative", importance: 0.12 }
                      ]).map((imp, idx) => {
                        const isRiskIncreasing = imp.direction === "positive" || imp.direction === "risk_increasing";
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                          >
                            <div className="flex items-center gap-2">
                              {isRiskIncreasing ? (
                                <TrendingUp className="h-4 w-4 text-rose-400 shrink-0" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-emerald-400 shrink-0" />
                              )}
                              <span className="text-white font-semibold">{imp.feature}</span>
                            </div>

                            <span
                              className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded border ${
                                isRiskIncreasing
                                  ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              }`}
                            >
                              {isRiskIncreasing ? "+Risk Driver" : "-Risk Factor"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Feedback Shortcut */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setFeedbackModalTarget(currentResult)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700 shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Submit Real Customer Outcome (Feedback Loop)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-14 text-center text-slate-400 space-y-3">
                  <BrainCircuit className="w-12 h-12 mx-auto text-blue-500/40 animate-pulse" />
                  <div className="text-sm font-bold text-white">
                    Ready for Feature Ingestion
                  </div>
                  <div className="text-xs text-slate-400 max-w-xs mx-auto">
                    Configure customer attributes or pick one of the quick profiles above, then click <strong>Generate Live Churn Risk Prediction</strong>.
                  </div>
                </div>
              )}
            </div>

            {/* Model Metadata Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono mt-4">
              <span>Model: <strong className="text-slate-200">{productionModel?.version || "v1.0.0-champion"}</strong></span>
              <span className="text-emerald-400">Serving: FastAPI Inference Bridge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Live Inferences Stream Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 dark:bg-slate-900/90 p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              Recent Live Prediction Stream
            </h3>
            <p className="text-xs text-slate-400">
              Real-time customer churn inferences recorded with verified feedback telemetry
            </p>
          </div>
          <span className="text-xs text-blue-400 font-mono font-bold bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
            {recentPredictions.length} Records Ingested
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Customer ID</th>
                <th className="py-3 px-3">Contract</th>
                <th className="py-3 px-3">Monthly ($)</th>
                <th className="py-3 px-3">Tenure</th>
                <th className="py-3 px-3">Predicted</th>
                <th className="py-3 px-3">Probability</th>
                <th className="py-3 px-3">Risk Tier</th>
                <th className="py-3 px-3">Ground Truth</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {recentPredictions.slice(0, 10).map((pred) => {
                const isChurn = pred.prediction === "Churn";
                return (
                  <tr key={pred.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{pred.customerId}</td>
                    <td className="py-3 px-3 text-slate-300">{pred.features?.contract || "Month-to-month"}</td>
                    <td className="py-3 px-3 text-slate-300">${Number(pred.features?.monthlyCharges || 85).toFixed(2)}</td>
                    <td className="py-3 px-3 text-slate-300">{pred.features?.tenure || 12} mos</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${isChurn ? "text-rose-400" : "text-emerald-400"}`}>
                        {pred.prediction}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      {(pred.churnProbability * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          pred.riskLevel === "Critical" || pred.churnProbability >= 0.7
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : pred.riskLevel === "Moderate" || pred.churnProbability >= 0.4
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {pred.riskLevel || (pred.churnProbability >= 0.7 ? "Critical" : "Low")}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {pred.feedback ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Actual: {pred.feedback.actual_outcome}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Pending Outcome</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {!pred.feedback ? (
                        <button
                          type="button"
                          onClick={() => setFeedbackModalTarget(pred)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg transition-colors cursor-pointer"
                        >
                          Submit Actual
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[11px] font-semibold">Verified</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Ingestion Modal */}
      {feedbackModalTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">
                Submit Customer Outcome (Ground Truth)
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Record the real-world retention or churn outcome for customer <span className="font-mono font-bold text-blue-400">{feedbackModalTarget.customerId}</span> to close the continuous feedback retraining loop.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Verified Customer Outcome:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActualOutcome("Churn")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      actualOutcome === "Churn"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    Customer Churned
                  </button>
                  <button
                    type="button"
                    onClick={() => setActualOutcome("No Churn")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      actualOutcome === "No Churn"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    Customer Retained
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Verification Notes / Retention Reason:
                </label>
                <textarea
                  rows="3"
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  placeholder="e.g. Left for competitor fiber deal after 6 months..."
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setFeedbackModalTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleFeedbackSubmit}
                loading={isSubmittingFeedback}
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Ingest Ground Truth
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionCenterView;
