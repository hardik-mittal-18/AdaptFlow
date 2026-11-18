import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import {
  Shield,
  Lock,
  CheckCircle2,
  Users,
  Eye,
  Key,
  FileCheck,
  Scale,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const GovernancePage = () => {
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
              <span className="text-blue-400">Governance &amp; RLS</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/80 px-3.5 py-1.5 border border-indigo-800/60 text-xs font-semibold text-indigo-400 mb-6">
              <Shield className="h-3.5 w-3.5" />
              <span>Enterprise Row-Level Security &amp; Policy Isolation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
              AI Governance, Security &amp; RLS Isolation
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              Every inference, feedback event, model promotion, and threshold edit is cryptographically attributed and guarded by PostgreSQL Row-Level Security policies with zero cross-tenant bleeding.
            </p>
          </div>
        </section>

        {/* 4-Role Strict Isolation Matrix */}
        <section className="py-16 mx-auto max-w-7xl px-6 space-y-16">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-400" />
              <span>Strict 4-Role Access Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mb-8">
              Enforced at the client routing boundary, API gateway middleware, and Postgres database RLS policies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Consumer */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    ROLE: CONSUMER
                  </span>
                  <span className="text-xs font-mono text-slate-500">/dashboard</span>
                </div>
                <h3 className="text-base font-bold text-white">End-User Inference Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Can request real-time customer churn predictions and submit verified ground-truth outcomes for own inference records only.
                </p>
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>POST /predict</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>POST /feedback</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <Lock className="w-3.5 h-3.5" /> <span>Blocked from retraining &amp; drift</span>
                  </div>
                </div>
              </div>

              {/* Vendor */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    ROLE: VENDOR
                  </span>
                  <span className="text-xs font-mono text-slate-500">/vendor</span>
                </div>
                <h3 className="text-base font-bold text-white">External Data Supplier</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Allowed to upload bulk partner churn datasets; blocked from internal system metrics, telemetry, and administrative controls.
                </p>
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Dataset Uploads</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Pandera Ingestion Reports</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <Lock className="w-3.5 h-3.5" /> <span>Blocked from admin/consumer</span>
                  </div>
                </div>
              </div>

              {/* Staff */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    ROLE: STAFF
                  </span>
                  <span className="text-xs font-mono text-slate-500">/staff</span>
                </div>
                <h3 className="text-base font-bold text-white">ML Operations Engineer</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Monitors statistical feature drift, inspects Evidently AI reports, triggers DVC retraining jobs, and tracks candidate model metrics.
                </p>
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Drift Status &amp; Reports</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Trigger Retraining Job</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <Lock className="w-3.5 h-3.5" /> <span>Blocked from model promotion</span>
                  </div>
                </div>
              </div>

              {/* Admin */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    ROLE: ADMIN
                  </span>
                  <span className="text-xs font-mono text-slate-500">/admin</span>
                </div>
                <h3 className="text-base font-bold text-white">Super Administrator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full governance rights: promotes challenger to champion, manages user roles, alters retraining thresholds, and conducts audit audits.
                </p>
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Promote &amp; Rollback Models</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Update System Config</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Immutable Audit Log Vault</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row-Level Security (RLS) & Immutable Audit Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Supabase PostgreSQL RLS Policies</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Even if someone circumvents frontend guards or API tokens, the PostgreSQL database enforces strict tenant isolation at the row level:
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-500">-- Example RLS Policy on predictions table</div>
                <div>CREATE POLICY <span className="text-indigo-400">"Users can read own predictions"</span></div>
                <div>ON public.predictions FOR SELECT</div>
                <div>USING (auth.uid() = user_id OR EXISTS (</div>
                <div className="pl-4">SELECT 1 FROM public.profiles</div>
                <div className="pl-4">WHERE id = auth.uid() AND role = 'admin'</div>
                <div>));</div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Immutable Audit Trail</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every sensitive action is written synchronously to the <code className="text-emerald-300">audit_logs</code> table with actor identity, timestamp, IP, and justification.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-rose-400 font-bold">MODEL_PROMOTED</span>
                  <span className="text-slate-400">admin@adaptflow.ai &rarr; XGBoost v2.0.0</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-amber-400 font-bold">THRESHOLD_UPDATED</span>
                  <span className="text-slate-400">admin@adaptflow.ai &rarr; KS p-value 0.05</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-blue-400 font-bold">USER_ROLE_CHANGED</span>
                  <span className="text-slate-400">Super Admin &rarr; Promoted to Staff</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GovernancePage;
