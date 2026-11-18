import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ShoppingBag, ShieldAlert } from 'lucide-react';

export const OrdersPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPredictions()
      .then((res) => setPredictions(res.predictions || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Inference Transactions & Orders</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of all incoming API inference requests, customer billing data, and ground-truth verification status.
          </p>
        </div>
      </div>

      <Card glass className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[10px] text-slate-400 font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Prediction ID</th>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Contract</th>
                <th className="p-4">Charges</th>
                <th className="p-4">Risk Probability</th>
                <th className="p-4">Outcome</th>
                <th className="p-4">Verified Ground Truth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {predictions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-slate-500">{p.id.slice(0, 10)}...</td>
                  <td className="p-4 font-mono font-bold text-white">{p.customerId}</td>
                  <td className="p-4">{p.features?.contract}</td>
                  <td className="p-4 font-semibold text-white">${p.features?.monthlyCharges?.toFixed(2)}</td>
                  <td className="p-4 font-bold text-white">{(p.churnProbability * 100).toFixed(1)}%</td>
                  <td className="p-4">
                    <Badge variant={p.prediction === 'Churn' ? 'danger' : 'success'} size="sm">
                      {p.prediction}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {p.feedback ? (
                      <span className="text-emerald-400 font-medium">✓ {p.feedback.actualOutcome}</span>
                    ) : (
                      <span className="text-slate-500">Unlabeled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OrdersPage;
