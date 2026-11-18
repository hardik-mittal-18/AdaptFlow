import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hero3DScene } from '../components/3d/Hero3DScene';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import {
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  GitBranch,
  Activity,
  Shield,
  GitMerge
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getRoleRedirect } from '../config/roles';

export const LandingPage = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (user && role) {
      navigate(getRoleRedirect(role), { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      {/* Universal Public Navbar */}
      <PublicNavbar />

      {/* Hero Section with 3D Scene */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 px-3.5 py-1.5 border border-blue-800/60 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Next-Gen MLOps with Google Gemini 3.8 Flash</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Self-Adaptive AI with <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Closed Feedback Loops</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Eliminate model decay in production. AdaptFlow continuously tracks customer churn predictions, ingests verified ground-truth outcomes, detects feature drift with statistical tests, and executes automated retraining with DVC dataset versioning and instant Blue-Green rollback.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button onClick={handleDashboardClick} variant="primary" size="lg" className="px-8 shadow-xl shadow-blue-600/30">
                <span>{user ? 'Open My Dashboard' : 'Get Started Now'}</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              {!user && (
                <Button onClick={() => navigate('/login')} variant="secondary" size="lg">
                  <span>Sign In</span>
                </Button>
              )}
            </div>

            {/* Platform Credibility Badges */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-bold text-white">84.7%</div>
                <div className="text-xs text-slate-400">Retrained Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">&lt; 3.8ms</div>
                <div className="text-xs text-slate-400">P95 Inference Latency</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">0% Downtime</div>
                <div className="text-xs text-slate-400">Blue-Green Promotion</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Canvas Scene */}
          <div className="lg:col-span-5 h-[440px] sm:h-[500px] w-full">
            <Hero3DScene className="h-full w-full" />
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section id="features" className="py-20 bg-slate-900/40 border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">Enterprise Architecture Pillars</h2>
            <p className="mt-3 text-sm text-slate-400">
              Engineered from the ground up for high-stakes financial, telecommunications, and SaaS customer churn intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Architecture Card */}
            <Card glass hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">System Architecture</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Decoupled microservices with Vite frontend, Express gateway, FastAPI serving, and sub-4ms P95 latency budgets.
                </p>
              </div>
              <Link
                to="/architecture"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 pt-3 border-t border-slate-800/80 group"
              >
                <span>Explore Architecture</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>

            {/* Drift Engine Card */}
            <Card glass hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-rose-600/20 flex items-center justify-center text-rose-400 border border-rose-500/30">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Drift Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evidently AI 2-sample Kolmogorov-Smirnov continuous tests and Population Stability Index (PSI) distribution tests.
                </p>
              </div>
              <Link
                to="/drift-engine"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 pt-3 border-t border-slate-800/80 group"
              >
                <span>Explore Drift Engine</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>

            {/* Feedback Loop Card */}
            <Card glass hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <GitMerge className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Feedback Loop</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Closed-loop ground-truth ingestion, Pandera schema gates, DVC dataset versioning, and Optuna 5-fold CV retraining.
                </p>
              </div>
              <Link
                to="/feedback-loop"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-3 border-t border-slate-800/80 group"
              >
                <span>Explore Feedback Loop</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>

            {/* Governance & RLS Card */}
            <Card glass hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Governance &amp; RLS</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict 4-role isolation matrix, Supabase Row-Level Security policies, and immutable audit trails.
                </p>
              </div>
              <Link
                to="/governance"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-3 border-t border-slate-800/80 group"
              >
                <span>Explore Governance</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-slate-400">AdaptFlow MLOps</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-slate-300">Sign In</Link>
            <Link to="/register" className="hover:text-slate-300">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
