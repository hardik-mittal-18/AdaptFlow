import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import {
  GitMerge,
  CheckCircle2,
  Database,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const FeedbackLoopPage = () => {
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
              <span className="text-blue-400">Feedback Loop</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 px-3.5 py-1.5 border border-emerald-800/60 text-xs font-semibold text-emerald-400 mb-6">
              <GitMerge className="h-3.5 w-3.5 animate-pulse" />
              <span>Closed-Loop Continuous Learning Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
              Continuous Feedback Loop &amp; Dataset Versioning
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              Models decay because production environments change. AdaptFlow closes the loop between live predictions and verified customer outcomes, versioning every feedback row through DVC and retraining champion models autonomously.
            </p>
          </div>
        </section>

        {/* 5-Stage Feedback Pipeline */}
        <section className="py-16 mx-auto max-w-7xl px-6 space-y-16">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-emerald-400" />
              <span>The 5-Stage Closed Retraining Lifecycle</span>
            </h2>
            <p className="text-xs text-slate-400 mb-8">
              From real-time inference logging to ground-truth reconciliation and candidate champion promotion.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Stage 1 */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h3 className="text-sm font-bold text-white">Prediction Logging</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every inference (features, probability, SHAP factors, model version) is stored in Supabase with a unique <code className="text-blue-300">request_id</code>.
                </p>
              </div>

              {/* Stage 2 */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                  02
                </div>
                <h3 className="text-sm font-bold text-white">Ground Truth Arrival</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Actual customer outcomes (<code className="text-indigo-300">Churn</code> / <code className="text-indigo-300">Retained</code>) arrive via API or staff submission and are linked to historical predictions.
                </p>
              </div>

              {/* Stage 3 */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
                  03
                </div>
                <h3 className="text-sm font-bold text-white">Pandera Validation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict schema gate rejects corrupt, missing, or out-of-bounds rows before appending to <code className="text-purple-300">data/feedback.dvc</code>.
                </p>
              </div>

              {/* Stage 4 */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                  04
                </div>
                <h3 className="text-sm font-bold text-white">DVC Dataset Merge</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Baseline training dataset (7,043 samples) is merged with new verified feedback, generating a cryptographic data hash.
                </p>
              </div>

              {/* Stage 5 */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                  05
                </div>
                <h3 className="text-sm font-bold text-white">Optuna Retraining</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  5-fold CV hyperparameter search trains challenger XGBoost model. If ROC-AUC &gt; champion by 0.5%, candidate is queued for canary rollout.
                </p>
              </div>
            </div>
          </div>

          {/* DVC & Pandera Schema Enforcement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Data Version Control (DVC) Lineage</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Large datasets never touch Git. Instead, AdaptFlow stores data pointers in <code className="text-emerald-300">data/raw.dvc</code> and <code className="text-emerald-300">data/feedback.dvc</code>, pushing raw chunks to remote cloud storage.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1">
                <div className="text-slate-500"># Run DVC pipeline reproduction</div>
                <div className="text-emerald-400">$ dvc repro</div>
                <div className="text-slate-400">&gt; Stage 'ingest' up to date</div>
                <div className="text-slate-400">&gt; Running stage 'validate' [Pandera: PASSED]</div>
                <div className="text-slate-400">&gt; Running stage 'train' [Optuna: 5 Folds, 15 Trials]</div>
                <div className="text-slate-400">&gt; Running stage 'register' [MLflow Alias: challenger]</div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Pandera Schema Gatekeeper</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Any malformed vendor file or corrupt feedback input triggers immediate rejection with line-by-line validation diagnostics.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1">
                <div className="text-slate-500"># Validated Column Constraints</div>
                <div>tenure: <span className="text-blue-300">int, in_range(0, 100)</span></div>
                <div>monthlyCharges: <span className="text-blue-300">float, in_range(10.0, 200.0)</span></div>
                <div>contract: <span className="text-blue-300">isin(["Month-to-month", "One year", "Two year"])</span></div>
                <div>churn: <span className="text-blue-300">isin(["Yes", "No", "1", "0"])</span></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FeedbackLoopPage;
