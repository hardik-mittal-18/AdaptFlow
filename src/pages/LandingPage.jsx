import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hero3DScene } from '../components/3d/Hero3DScene';
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
  Activity
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
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">AdaptFlow</span>
              <span className="ml-2 rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-mono text-blue-400 font-bold">
                ENTERPRISE
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Architecture</a>
            <a href="#drift" className="hover:text-white transition-colors">Drift Engine</a>
            <a href="#feedback" className="hover:text-white transition-colors">Feedback Loop</a>
            <a href="#security" className="hover:text-white transition-colors">Governance & RLS</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={handleDashboardClick} variant="primary" size="md">
                <span>Go to My Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} variant="ghost" size="md">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/register')} variant="primary" size="md">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card glass hover className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Continuous Feedback Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captures verified real-world customer churn outcomes. Prevents label contamination by gating ingestion through supervised verification before triggering model retraining.
              </p>
            </Card>

            <Card glass hover className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Evidently AI Statistical Drift</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Two-sample Kolmogorov-Smirnov test for continuous distributions and Population Stability Index (PSI) for categorical features to catch shifting consumer behavior in real time.
              </p>
            </Card>

            <Card glass hover className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <GitBranch className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Blue-Green Promotion & RLS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Validate candidate models across zero latency penalty and positive performance lift gates with instantaneous 1-click promotion and rollback secured by Supabase RLS policies.
              </p>
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
