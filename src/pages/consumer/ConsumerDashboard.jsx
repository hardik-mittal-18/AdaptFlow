import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { api } from '../../services/api';
import { SlideBoardCarousel } from '../../components/3d/SlideBoardCarousel';
import {
  Zap,
  TrendingDown,
  ShoppingBag,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Inbox
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton, EmptyState } from '../../components/ui/Table';

export const ConsumerDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        let ordersData = null;
        if (user?.id) {
          const { data, error: supaErr } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

          if (!supaErr && data && data.length > 0) {
            ordersData = data.map((d) => ({
              id: d.id,
              customerId: d.prediction_id || `CUST-${d.id.slice(0, 5)}`,
              features: {
                contract: d.risk_category || 'Month-to-month',
                monthlyCharges: Number(d.monthly_charges) || 85.5
              },
              churnProbability: Number(d.churn_probability) || 0.42,
              prediction: Number(d.churn_probability) > 0.5 ? 'Churn' : 'No Churn',
              riskLevel: d.risk_category || 'Medium',
              feedback: d.feedback_verified
                ? { actualOutcome: d.ground_truth_churn ? 'Churn' : 'No Churn' }
                : null
            }));
          }
        }

        if (!ordersData) {
          const res = await api.getPredictions();
          ordersData = res.predictions?.slice(0, 5) || [];
        }

        setRecentPredictions(ordersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 p-6 md:p-8 border border-blue-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Consumer Intelligence Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {profile?.full_name || 'Consumer User'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            Run automated customer churn risk assessments, inspect AI driver attributions, and submit verified feedback to train candidate models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/predictions')} variant="primary" size="lg" className="shadow-lg shadow-blue-600/25">
            <Zap className="h-4 w-4 mr-2" />
            <span>New Prediction</span>
          </Button>
        </div>
      </div>

      {/* Consumer Quick KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card glass className="p-4 border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Monthly Inferences</span>
          <div className="mt-2 text-2xl font-bold text-white">{recentPredictions.length} / 250</div>
          <span className="text-[11px] text-blue-400">Strict consumer RLS scope</span>
        </Card>
        <Card glass className="p-4 border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">High Risk Churners</span>
          <div className="mt-2 text-2xl font-bold text-rose-400">
            {recentPredictions.filter((p) => p.prediction === 'Churn').length} Cases
          </div>
          <span className="text-[11px] text-rose-400/80">Requires customer retention</span>
        </Card>
        <Card glass className="p-4 border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Feedback Submitted</span>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            {recentPredictions.filter((p) => p.feedback).length} Outcomes
          </div>
          <span className="text-[11px] text-emerald-400/80">Admitted to Retraining</span>
        </Card>
        <Card glass className="p-4 border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Model Status</span>
          <div className="mt-2 text-base font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>v1.0.0 Active</span>
          </div>
          <span className="text-[11px] text-slate-400">Calibrated IBM Telco</span>
        </Card>
      </div>

      {/* 3D Moving Slide Board Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Interactive 3D Analytics Carousel</h2>
            <p className="text-xs text-slate-400">Navigate boards to explore real-time MLOps telemetry and revenue exposure</p>
          </div>
        </div>
        <SlideBoardCarousel />
      </div>

      {/* Recent Predictions Table */}
      <Card glass className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Customer Inferences</h3>
            <p className="text-xs text-slate-400">Latest predictions processed by the active production model</p>
          </div>
          <Button onClick={() => navigate('/activity')} variant="ghost" size="sm">
            <span>View All Activity</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : recentPredictions.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No Inferences Yet"
            description="You have not run any customer churn predictions yet. Start your first prediction to see telemetry here."
            action={
              <Button onClick={() => navigate('/predictions')} variant="primary" size="sm">
                Run First Prediction
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 font-semibold tracking-wider">
                <tr>
                  <th className="p-3">Customer ID</th>
                  <th className="p-3">Contract</th>
                  <th className="p-3">Monthly Charges</th>
                  <th className="p-3">Churn Probability</th>
                  <th className="p-3">Risk Tier</th>
                  <th className="p-3">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentPredictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-white font-medium">{pred.customerId}</td>
                    <td className="p-3">{pred.features?.contract}</td>
                    <td className="p-3">${pred.features?.monthlyCharges?.toFixed(2)}</td>
                    <td className="p-3 font-semibold text-white">{(pred.churnProbability * 100).toFixed(1)}%</td>
                    <td className="p-3">
                      <Badge variant={pred.prediction === 'Churn' ? 'danger' : 'success'} size="sm">
                        {pred.riskLevel} Risk
                      </Badge>
                    </td>
                    <td className="p-3">
                      {pred.feedback ? (
                        <span className="text-emerald-400 font-medium">✓ Verified</span>
                      ) : (
                        <span className="text-slate-500">Unlabeled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ConsumerDashboard;
