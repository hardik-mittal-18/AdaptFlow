import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import {
  Cpu,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  GitBranch,
  Database,
  Server,
  Zap,
  CheckCircle2,
  Clock,
  RefreshCw,
  HardDrive,
  BarChart3
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ArchitecturePage = () => {
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
              <span className="text-blue-400">Architecture</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 px-3.5 py-1.5 border border-blue-800/60 text-xs font-semibold text-blue-400 mb-6">
              <Cpu className="h-3.5 w-3.5" />
              <span>Multi-Tier High-Throughput MLOps Infrastructure</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
              System Architecture &amp; Service Topology
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              AdaptFlow decouples client presentation, policy governance, real-time machine learning inference, and experiment tracking into specialized microservices optimized for sub-millisecond execution and zero-downtime hot reloading.
            </p>
          </div>
        </section>

        {/* Core Architecture Topology Grid */}
        <section className="py-16 mx-auto max-w-7xl px-6 space-y-16">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-400" />
              <span>End-to-End Microservices Architecture</span>
            </h2>
            <p className="text-xs text-slate-400 mb-8">
              Decoupled, event-driven topology with distributed tracking, telemetry, and automated feedback loops.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Layer 1: Frontend SPA */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">Tier 1</span>
                  <h3 className="text-base font-bold text-white mt-1">React 19 / Vite Frontend</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High-performance Single Page Application with dynamic role-based view isolation, interactive toggle controls, and live prediction streaming.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800">React 19</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">Vite 8</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">Tailwind CSS v4</span>
                </div>
              </div>

              {/* Layer 2: Express Gateway */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Tier 2</span>
                  <h3 className="text-base font-bold text-white mt-1">Node/Express Gateway</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authenticates Supabase JWT tokens, enforces RBAC policies across the 4 roles, and reverse-proxies inference calls to the ML engine.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800">Express</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">CORS Engine</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">JWT Verifier</span>
                </div>
              </div>

              {/* Layer 3: FastAPI ML Serving */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Tier 3</span>
                  <h3 className="text-base font-bold text-white mt-1">FastAPI Inference Service</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sub-millisecond model scoring with Pydantic validation, SHAP TreeExplainer attributions, and dynamic alias hot-reloading.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800">FastAPI</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">Uvicorn</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">SHAP Explainer</span>
                </div>
              </div>

              {/* Layer 4: Registry & Pipeline */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Tier 4</span>
                  <h3 className="text-base font-bold text-white mt-1">MLflow &amp; DVC Pipeline</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Artifact versioning, Optuna 5-fold CV hyperparameter tuning, model registry with aliases, and DVC data lineage tracking.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800">MLflow 2.14</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">DVC 3.50</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">Optuna</span>
                </div>
              </div>
            </div>
          </div>

          {/* Latency Budget Breakdown Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span>Sub-4ms Inference Latency Budget</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Benchmarked under high concurrency with Locust (50 virtual users, 0% failure rate).
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                P95 Total: 3.8ms
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] font-mono uppercase text-slate-400">Gateway Authentication</div>
                <div className="text-xl font-bold font-mono text-white mt-1">&lt; 1.1 ms</div>
                <p className="text-[11px] text-slate-500 mt-1">JWT claims validation &amp; role matching</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] font-mono uppercase text-slate-400">Pydantic Validation</div>
                <div className="text-xl font-bold font-mono text-white mt-1">&lt; 0.2 ms</div>
                <p className="text-[11px] text-slate-500 mt-1">Telco schema sanitization</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] font-mono uppercase text-slate-400">XGBoost Inference</div>
                <div className="text-xl font-bold font-mono text-white mt-1">&lt; 0.09 ms</div>
                <p className="text-[11px] text-slate-500 mt-1">Calibrated tree probability scoring</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] font-mono uppercase text-slate-400">SHAP Factor Attribution</div>
                <div className="text-xl font-bold font-mono text-white mt-1">&lt; 2.4 ms</div>
                <p className="text-[11px] text-slate-500 mt-1">TreeExplainer local feature contributions</p>
              </div>
            </div>
          </div>

          {/* Blue-Green & Canary Rollout Strategy */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-400" />
              <span>Zero-Downtime Blue-Green &amp; Canary Gates</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              New challenger models undergo a 4-phase promotion lifecycle before serving 100% of live traffic:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 font-bold">STAGE 1</span>
                <h4 className="text-sm font-bold text-white mt-2">Shadow Mode</h4>
                <p className="text-xs text-slate-400 mt-1">Scores incoming requests asynchronously alongside champion; outputs discarded, metrics recorded.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-400 font-bold">STAGE 2</span>
                <h4 className="text-sm font-bold text-white mt-2">10% Canary</h4>
                <p className="text-xs text-slate-400 mt-1">10% of live customer requests routed to challenger. SLA latency &amp; error rates audited.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-400 font-bold">STAGE 3</span>
                <h4 className="text-sm font-bold text-white mt-2">50% Canary</h4>
                <p className="text-xs text-slate-400 mt-1">Even traffic split to benchmark confidence interval and statistical stability.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">STAGE 4</span>
                <h4 className="text-sm font-bold text-white mt-2">Blue-Green Promotion</h4>
                <p className="text-xs text-slate-400 mt-1">Alias switched to <code className="text-emerald-300">champion</code>. Previous model stored for 1-click rollback.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArchitecturePage;
