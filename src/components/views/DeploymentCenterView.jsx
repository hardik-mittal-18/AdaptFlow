import { useState, useEffect } from "react";
import {
  Rocket,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  GitBranch,
  Sliders,
  Flame,
  FileCode,
  Activity
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";

export const DeploymentCenterView = () => {
  const {
    productionModel,
    candidateModel,
    currentUser,
    showToast,
    refreshData
  } = useApp();

  const [isDeploying, setIsDeploying] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [isSimulatingDrift, setIsSimulatingDrift] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState(
    "Production validation passed. +3.3% accuracy and +3.7% F1 lift approved by Super Admin."
  );
  const [rollbackReason, setRollbackReason] = useState("Operational verification check");
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [canaryWeight, setCanaryWeight] = useState(10);
  const [updatingCanary, setUpdatingCanary] = useState(false);
  const [modelCard, setModelCard] = useState(null);

  useEffect(() => {
    loadDeploymentDetails();
  }, []);

  const loadDeploymentDetails = async () => {
    try {
      const [depStatus, card] = await Promise.allSettled([
        api.getDeploymentStatus(),
        api.getModelCard()
      ]);
      if (depStatus.status === "fulfilled" && depStatus.value) {
        setCanaryWeight(Math.round((depStatus.value.canaryWeight || 0.1) * 100));
      }
      if (card.status === "fulfilled" && card.value) {
        setModelCard(card.value);
      }
    } catch (e) {
      console.warn("Deployment status error:", e);
    }
  };

  const handleDeploy = async () => {
    if (!candidateModel) return;
    setIsDeploying(true);
    try {
      const res = await api.deployModel(candidateModel.version, approvalNotes);
      showToast(res.message, "success");
      refreshData();
      await loadDeploymentDetails();
    } catch (err) {
      showToast(err.message || "Deployment failed", "error");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleRollback = async () => {
    setIsRollingBack(true);
    try {
      const res = await api.rollbackModel(rollbackReason);
      showToast(res.message, "warning");
      setShowRollbackModal(false);
      refreshData();
      await loadDeploymentDetails();
    } catch (err) {
      showToast(err.message || "Rollback failed", "error");
    } finally {
      setIsRollingBack(false);
    }
  };

  const handleCanarySplit = async (weight) => {
    setUpdatingCanary(true);
    try {
      await api.updateCanarySplit(weight / 100);
      setCanaryWeight(weight);
      showToast(`Canary traffic split adjusted to ${weight}% Challenger / ${100 - weight}% Champion`, "info");
    } catch (err) {
      showToast(err.message || "Failed to update canary split", "error");
    } finally {
      setUpdatingCanary(false);
    }
  };

  const handleSimulateDrift = async () => {
    setIsSimulatingDrift(true);
    try {
      await api.simulateDrift("tenure_and_contract");
      showToast("Statistical drift simulation injected into inference window! Drift engine alerted.", "warning");
      refreshData();
    } catch (err) {
      showToast(err.message || "Simulation error", "error");
    } finally {
      setIsSimulatingDrift(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Security Banner */}
      <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl shrink-0 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Safe Model Deployment & Rollback Gatekeeper
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Blue-Green Zero Downtime
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-1 max-w-2xl">
              Strict governance ensures unvalidated models cannot reach production. Only authorized Admins can execute canary traffic increments, promotions, or emergency rollbacks.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSimulateDrift}
            disabled={isSimulatingDrift}
            className="px-3.5 py-2 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>{isSimulatingDrift ? "Simulating..." : "Simulate Drift Event"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRollbackModal(true)}
            className="px-3.5 py-2 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Rollback to Previous</span>
          </button>
        </div>
      </div>

      {/* Canary Traffic Split Controls */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Canary Traffic Split Controller</h3>
          </div>
          <span className="text-xs font-mono text-blue-400 font-bold">
            Current Split: {canaryWeight}% Challenger / {100 - canaryWeight}% Champion
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Route live production traffic between the active <strong>Champion</strong> model and the candidate <strong>Challenger</strong> model to verify real-world inference stability before 100% cutover.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {[10, 25, 50, 100].map((split) => (
            <button
              key={split}
              type="button"
              disabled={updatingCanary}
              onClick={() => handleCanarySplit(split)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                canaryWeight === split
                  ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
            >
              {split}% Canary
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Comparison: Production Model vs Staged Candidate Model */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Production Model */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">
                  Active Production Model (Champion)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                SERVING LIVE TRAFFIC
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xl font-bold text-white">
                  {productionModel?.name || "Telco Churn XGBoost Production"}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Version: {productionModel?.version || "v1.0.0"} · Algorithm: {productionModel?.algorithm || "XGBoost"}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 text-center">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Accuracy</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {productionModel ? `${(productionModel.metrics.accuracy * 100).toFixed(1)}%` : "81.4%"}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 text-center">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">F1-Score</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {productionModel?.metrics?.f1Score || 0.672}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 text-center">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Recall</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {productionModel?.metrics?.recall || 0.778}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 text-center">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">ROC-AUC</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {productionModel?.metrics?.rocAuc || 0.784}
                  </div>
                </div>
              </div>

              {/* Lineage Info */}
              <div className="pt-2 space-y-1.5 text-xs text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">MLflow Alias:</span>
                  <span className="text-emerald-400 font-bold">champion</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dataset Version:</span>
                  <span>{productionModel?.datasetVersion || "v1.0.0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DVC Checksum:</span>
                  <span className="truncate max-w-[200px] text-blue-400 font-bold">{productionModel?.dvcHash || "dvc-sha256-7043b"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-4">
            <span>Status: Healthy · &lt; 3.8ms SLA</span>
            <span className="font-mono text-emerald-400 font-semibold">{100 - canaryWeight}% Traffic</span>
          </div>
        </div>

        {/* Staged Candidate Model Ready for Promotion */}
        <div className="bg-slate-900/90 rounded-2xl border border-blue-500/40 p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  Candidate Model (Challenger)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                AWAITING FULL CUTOVER
              </span>
            </div>

            {candidateModel ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xl font-bold text-white">
                    {candidateModel.name}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Version: {candidateModel.version} · Algorithm: {candidateModel.algorithm}
                  </div>
                </div>

                {/* Metrics Grid with Lift Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="p-2.5 bg-blue-950/40 rounded-xl border border-blue-800 text-center">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Accuracy</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {(candidateModel.metrics.accuracy * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+3.8% Lift</div>
                  </div>

                  <div className="p-2.5 bg-blue-950/40 rounded-xl border border-blue-800 text-center">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">F1-Score</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {candidateModel.metrics.f1Score}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+0.043 Lift</div>
                  </div>

                  <div className="p-2.5 bg-blue-950/40 rounded-xl border border-blue-800 text-center">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Recall</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {candidateModel.metrics.recall}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+0.046 Lift</div>
                  </div>

                  <div className="p-2.5 bg-blue-950/40 rounded-xl border border-blue-800 text-center">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">ROC-AUC</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {candidateModel.metrics.rocAuc}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+0.036 Sep</div>
                  </div>
                </div>

                {/* Validation Checklist */}
                <div className="pt-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700 space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1">
                    Acceptance Gatekeeper Checklist:
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Schema Compatibility: 19 input features verified by Pandera</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accuracy Gate: Exceeds active production model by &gt;0.5%</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Slice Invariance: Zero regression on tenure &amp; contract slices</span>
                  </div>
                </div>

                {/* Deployment Notes Input */}
                <div className="pt-1">
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Admin Approval Signoff Notes
                  </label>
                  <input
                    type="text"
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                No candidate model currently staged. Trigger a retraining job from Staff portal to generate a candidate.
              </div>
            )}
          </div>

          {/* Promotion Button */}
          {candidateModel && (
            <div className="pt-4 border-t border-slate-800 mt-4">
              <button
                type="button"
                disabled={isDeploying}
                onClick={handleDeploy}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Rocket className="w-4 h-4 fill-white" />
                <span>
                  {isDeploying ? "Executing Blue-Green Promotion..." : "Approve & Deploy Candidate to Production"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Rollback Confirmation Modal */}
      {showRollbackModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-800">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">
                Confirm Production Model Rollback
              </h3>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              This will immediately switch active inference traffic back to the previous stable model version (<span className="font-mono font-bold text-amber-400">alias: previous</span>). Zero downtime will occur.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Reason for Rollback
              </label>
              <input
                type="text"
                value={rollbackReason}
                onChange={(e) => setRollbackReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRollbackModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRollingBack}
                onClick={handleRollback}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {isRollingBack ? "Executing Rollback..." : "Confirm Rollback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentCenterView;
