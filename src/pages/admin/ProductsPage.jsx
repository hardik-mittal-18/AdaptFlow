import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, Box, CheckCircle2, GitBranch, ArrowUpRight } from 'lucide-react';

const INITIAL_MODELS = [
  {
    id: 'prod-1',
    name: 'IBM Telco Churn Baseline',
    version: 'v1.0.0',
    algorithm: 'Random Forest (250 estimators)',
    status: 'active',
    accuracy: 0.814,
    f1_score: 0.801,
    latency: '3.8ms',
    pricing_tier: 'production'
  },
  {
    id: 'prod-2',
    name: 'AdaptFlow Self-Adaptive Candidate',
    version: 'v1.1.0',
    algorithm: 'XGBoost (300 estimators, 5-fold CV)',
    status: 'candidate',
    accuracy: 0.847,
    f1_score: 0.838,
    latency: '3.4ms',
    pricing_tier: 'staging'
  },
  {
    id: 'prod-3',
    name: 'Churn Logistic Baseline',
    version: 'v0.9.2',
    algorithm: 'Logistic Regression L2',
    status: 'deprecated',
    accuracy: 0.772,
    f1_score: 0.751,
    latency: '1.2ms',
    pricing_tier: 'archived'
  }
];

export const ProductsPage = () => {
  const [models, setModels] = useState(INITIAL_MODELS);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Machine Learning Models & Products Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage deployed inference endpoints, model versions, baseline weights, and staging environments.
          </p>
        </div>
        <Button variant="primary" size="md">
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Register New Model</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map((m) => (
          <Card key={m.id} glass className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                {m.version}
              </span>
              <Badge variant={m.status === 'active' ? 'success' : m.status === 'candidate' ? 'primary' : 'neutral'} size="sm">
                {m.status.toUpperCase()}
              </Badge>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{m.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{m.algorithm}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-500">Accuracy</span>
                <div className="font-bold text-white">{(m.accuracy * 100).toFixed(1)}%</div>
              </div>
              <div>
                <span className="text-slate-500">F1-Score</span>
                <div className="font-bold text-white">{m.f1_score}</div>
              </div>
              <div>
                <span className="text-slate-500">Inference Latency</span>
                <div className="font-bold text-emerald-400">{m.latency}</div>
              </div>
              <div>
                <span className="text-slate-500">Target Stage</span>
                <div className="font-bold text-slate-300 capitalize">{m.pricing_tier}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
