import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SlideBoardCarousel } from '../../components/3d/SlideBoardCarousel';
import { Hero3DScene } from '../../components/3d/Hero3DScene';
import {
  ShieldCheck,
  Cpu,
  GitBranch,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Admin Executive Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-blue-950/60 p-6 md:p-8 border border-indigo-500/30 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/40 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>Super Admin Governance Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Enterprise MLOps Command Center
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Live oversight of feedback loop ingestion, statistical Kolmogorov-Smirnov drift breaches, DVC versioning commits, and zero-downtime Blue-Green model promotions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/admin/deployments')} variant="primary" size="lg" className="shadow-lg shadow-indigo-600/30 bg-indigo-600 hover:bg-indigo-500">
            <GitBranch className="h-4 w-4 mr-2" />
            <span>Blue-Green Gate</span>
          </Button>
          <Button onClick={() => navigate('/admin/analytics')} variant="secondary" size="lg">
            <Cpu className="h-4 w-4 mr-2" />
            <span>Drift Report</span>
          </Button>
        </div>
      </div>

      {/* Hero 3D Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 space-y-4">
          <SlideBoardCarousel />
        </div>
        <div className="lg:col-span-4 min-h-[380px]">
          <Hero3DScene className="h-full w-full" />
        </div>
      </div>

      {/* Quick Governance Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass hover className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-400 border border-indigo-500/30">
              <Users className="h-5 w-5" />
            </div>
            <Badge variant="primary" size="sm">RBAC</Badge>
          </div>
          <h3 className="text-base font-bold text-white">User Management</h3>
          <p className="text-xs text-slate-400">
            Control authenticated consumer vs admin role allocations, review activity logs, and configure RLS permissions.
          </p>
          <Button onClick={() => navigate('/admin/users')} variant="ghost" size="sm" className="p-0 text-blue-400 hover:text-blue-300">
            <span>Manage Users</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>

        <Card glass hover className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <Badge variant="warning" size="sm">2 Breaches</Badge>
          </div>
          <h3 className="text-base font-bold text-white">Evidently AI Drift Engine</h3>
          <p className="text-xs text-slate-400">
            Kolmogorov-Smirnov statistical tests detected density shift on `monthlyCharges` (p=0.012). Retraining candidate generated.
          </p>
          <Button onClick={() => navigate('/admin/analytics')} variant="ghost" size="sm" className="p-0 text-amber-400 hover:text-amber-300">
            <span>Inspect KS Curves</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>

        <Card glass hover className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <Badge variant="success" size="sm">+3.3% Lift</Badge>
          </div>
          <h3 className="text-base font-bold text-white">Candidate Model Gate</h3>
          <p className="text-xs text-slate-400">
            XGBoost v1.1.0 cleared all acceptance benchmarks with zero latency penalty. Instant 1-click blue-green promotion ready.
          </p>
          <Button onClick={() => navigate('/admin/deployments')} variant="ghost" size="sm" className="p-0 text-emerald-400 hover:text-emerald-300">
            <span>Promote Model</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
