import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Search, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const ActivityPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPred, setSelectedPred] = useState(null);
  const [actualOutcome, setActualOutcome] = useState('Churn');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      const res = await api.getPredictions();
      setPredictions(res.predictions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedPred) return;
    setSubmitting(true);
    try {
      await api.submitFeedback({
        predictionId: selectedPred.id,
        customerId: selectedPred.customerId,
        actualOutcome,
        comments
      });
      setSelectedPred(null);
      await loadPredictions();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = predictions.filter((p) =>
    p.customerId.toLowerCase().includes(search.toLowerCase()) ||
    p.features?.contract?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Inference History & Telemetry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past model outputs, verify actual real-world customer outcomes, and contribute to supervised retraining.
          </p>
        </div>
        <div className="w-72">
          <Input
            icon={Search}
            placeholder="Search customer ID or contract..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card glass className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[10px] text-slate-400 font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Contract</th>
                <th className="p-4">Monthly Bill</th>
                <th className="p-4">Probability</th>
                <th className="p-4">Risk Tier</th>
                <th className="p-4">Verified Ground Truth</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading inference history and verified outcomes...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <AlertCircle className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-300">No inference records found</p>
                    <p className="text-[11px] text-slate-500 mt-1">Run a churn risk prediction in the Prediction Center to view live telemetry.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">{p.customerId}</td>
                  <td className="p-4 text-slate-400">{new Date(p.timestamp).toLocaleString()}</td>
                  <td className="p-4">{p.features?.contract}</td>
                  <td className="p-4 font-semibold text-white">${p.features?.monthlyCharges?.toFixed(2)}</td>
                  <td className="p-4 font-bold text-white">{(p.churnProbability * 100).toFixed(1)}%</td>
                  <td className="p-4">
                    <Badge variant={p.prediction === 'Churn' ? 'danger' : 'success'} size="sm">
                      {p.riskLevel}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {p.feedback ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {p.feedback.actualOutcome}
                      </span>
                    ) : (
                      <span className="text-slate-500">Pending verification</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {!p.feedback ? (
                      <Button onClick={() => setSelectedPred(p)} variant="outline" size="sm">
                        Verify Outcome
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Admitted</span>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Verification Modal */}
      <Modal
        isOpen={Boolean(selectedPred)}
        onClose={() => setSelectedPred(null)}
        title="Submit Verified Ground Truth"
        subtitle={`Confirm outcome for customer ${selectedPred?.customerId}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Did this customer actually churn?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActualOutcome('Churn')}
                className={`p-3 rounded-xl border text-center font-bold ${
                  actualOutcome === 'Churn' ? 'border-rose-500 bg-rose-950/40 text-rose-300' : 'border-slate-800 text-slate-400'
                }`}
              >
                Yes, Churned
              </button>
              <button
                type="button"
                onClick={() => setActualOutcome('No Churn')}
                className={`p-3 rounded-xl border text-center font-bold ${
                  actualOutcome === 'No Churn' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 text-slate-400'
                }`}
              >
                No, Retained
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Telemetry Notes / Feedback Context</label>
            <textarea
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="e.g. Switched to fiber package; competitor offered price match..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setSelectedPred(null)} variant="ghost" size="md">Cancel</Button>
            <Button onClick={handleFeedbackSubmit} loading={submitting} variant="primary" size="md">
              Confirm & Admit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActivityPage;
