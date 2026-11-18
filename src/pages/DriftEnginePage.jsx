import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  BarChart2,
  Sliders,
  Play,
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DriftEnginePage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      <PublicNavbar />

      <main className="flex-1 pb-24">
        {/* Breadcrumb & Header Hero */}
        <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/40 to-slate-950">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4">
              <Link to="/" className="hover:text-blue-400">Home</Link>
              <span>/</span>
              <span className="text-blue-400">Drift Engine</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-rose-950/80 px-3.5 py-1.5 border border-rose-800/60 text-xs font-semibold text-rose-400 mb-6">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span>Real-Time Statistical Monitoring &amp; Drift Detection</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
              Evidently AI Statistical Drift Engine
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              Detect feature decay and distribution divergence before model accuracy degrades. AdaptFlow pairs two-sample non-parametric hypothesis testing with population stability indexes across rolling production windows.
            </p>
          </div>
        </section>

        {/* Statistical Test Framework Cards */}
        <section className="py-16 mx-auto max-w-7xl px-6 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* KS Test Card */}
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  CONTINUOUS FEATURES
                </span>
                <span className="text-xs font-mono text-slate-500">Threshold: p &lt; 0.05</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Two-Sample Kolmogorov-Smirnov (KS) Test</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Non-parametric test comparing the empirical cumulative distribution functions (eCDF) of baseline training data and current production inferences.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-500 font-bold uppercase text-[10px]">Mathematical Hypothesis:</div>
                <div>H₀: F_prod(x) = F_base(x) &nbsp;(Distributions are identical)</div>
                <div>H₁: F_prod(x) ≠ F_base(x) &nbsp;(Statistically significant drift)</div>
                <div className="text-emerald-400 pt-1">Reject H₀ if p-value &lt; 0.05 &rarr; Trigger Drift Alert</div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Monitored Continuous Metrics:</span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li><span className="font-semibold text-slate-200">tenure:</span> Customer tenure in months (0–72)</li>
                  <li><span className="font-semibold text-slate-200">monthlyCharges:</span> Monthly billing rate ($18–$125)</li>
                  <li><span className="font-semibold text-slate-200">totalCharges:</span> Cumulative customer payments</li>
                </ul>
              </div>
            </div>

            {/* PSI Test Card */}
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  CATEGORICAL FEATURES
                </span>
                <span className="text-xs font-mono text-slate-500">Threshold: PSI &gt; 0.20</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Population Stability Index (PSI)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Measures the quantitative divergence between bucketed categorical probabilities in reference vs. current inference streams.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-500 font-bold uppercase text-[10px]">PSI Formula:</div>
                <div className="text-purple-300">PSI = ∑ (Actual% - Expected%) × ln(Actual% / Expected%)</div>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[10px]">
                  <div className="p-1.5 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-300">PSI &lt; 0.10: Stable</div>
                  <div className="p-1.5 rounded bg-amber-950/40 border border-amber-800/50 text-amber-300">0.10–0.25: Moderate</div>
                  <div className="p-1.5 rounded bg-rose-950/40 border border-rose-800/50 text-rose-300">&gt; 0.25: Critical Drift</div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Monitored Categorical Features:</span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li><span className="font-semibold text-slate-200">contract:</span> Month-to-month, One year, Two year</li>
                  <li><span className="font-semibold text-slate-200">internetService:</span> Fiber optic, DSL, None</li>
                  <li><span className="font-semibold text-slate-200">paymentMethod:</span> Electronic check, Credit card, etc.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Drift Simulation & Automated Trigger Workflow */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Closed-Loop Drift Detection to Retraining Workflow</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                How AdaptFlow autonomically responds when statistical drift thresholds are breached in production.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
                <div className="text-xs font-bold text-blue-400 font-mono">01. Window Aggregation</div>
                <h4 className="text-sm font-bold text-white mt-2">Rolling Inference Window</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Pulls the last 100+ live predictions from PostgreSQL to build the current empirical distribution.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
                <div className="text-xs font-bold text-purple-400 font-mono">02. Hypothesis Testing</div>
                <h4 className="text-sm font-bold text-white mt-2">Automated KS &amp; PSI Tests</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Runs SciPy stats and Evidently metrics. If &gt; 3 features drift or target drift &gt; 15%, alerts fire.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
                <div className="text-xs font-bold text-amber-400 font-mono">03. Alert Notification</div>
                <h4 className="text-sm font-bold text-white mt-2">Slack &amp; Prometheus</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Dispatches webhook payload, logs audit entry, and renders interactive HTML report.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
                <div className="text-xs font-bold text-emerald-400 font-mono">04. Retrain Trigger</div>
                <h4 className="text-sm font-bold text-white mt-2">DVC Pipeline Execution</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Staff approves retraining or automated cron triggers Optuna XGBoost pipeline with merged ground truth.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DriftEnginePage;
