import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, setApiUserRole } from "../services/api";
const AppContext = createContext(void 0);
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: "usr-admin-01",
    name: "Sarah Chen",
    email: "admin@adaptflow.ai",
    role: "super_admin",
    createdAt: "2026-01-10T08:00:00Z"
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [productionModel, setProductionModel] = useState(null);
  const [candidateModel, setCandidateModel] = useState(null);
  const [driftReport, setDriftReport] = useState(null);
  const [driftStatus, setDriftStatus] = useState("healthy");
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [platformMetrics, setPlatformMetrics] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [activeRetrainingJob, setActiveRetrainingJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => prev?.message === message ? null : prev);
    }, 4500);
  }, []);
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [modelsRes, driftRes, fbStatsRes, metricsRes, predsRes, jobsRes] = await Promise.all([
        api.getCurrentModels().catch(() => ({ current: null, candidate: void 0 })),
        api.getDriftReport().catch(() => null),
        api.getFeedbackStatistics().catch(() => null),
        api.getMetrics().catch(() => null),
        api.getPredictions(20).catch(() => ({ predictions: [] })),
        api.getRetrainingJobs().catch(() => ({ jobs: [] }))
      ]);
      if (modelsRes.current) setProductionModel(modelsRes.current);
      if (modelsRes.candidate) setCandidateModel(modelsRes.candidate);
      if (driftRes) {
        setDriftReport(driftRes);
        setDriftStatus(driftRes.status);
      }
      if (fbStatsRes) setFeedbackStats(fbStatsRes);
      if (metricsRes) setPlatformMetrics(metricsRes);
      if (predsRes.predictions) setRecentPredictions(predsRes.predictions);
      if (jobsRes.jobs.length > 0) setActiveRetrainingJob(jobsRes.jobs[0]);
      setError(null);
    } catch (err) {
      console.error("Error refreshing platform data:", err);
      setError(err.message || "Failed to sync with server");
    } finally {
      setIsLoading(false);
    }
  }, []);
  const switchRole = useCallback((role) => {
    setApiUserRole(role);
    let name = "Sarah Chen";
    let email = "admin@adaptflow.ai";
    if (role === "ml_engineer") {
      name = "Marcus Vance";
      email = "mle@adaptflow.ai";
    } else if (role === "end_user") {
      name = "Elena Rostova";
      email = "user@adaptflow.ai";
      setActiveTab("predictions");
    }
    setCurrentUser({
      id: `usr-${role}`,
      name,
      email,
      role,
      createdAt: "2026-01-10T08:00:00Z"
    });
    showToast(`Switched active profile to ${name} (${role.replace("_", " ").toUpperCase()})`, "info");
    refreshData();
  }, [showToast, refreshData]);
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  return <AppContext.Provider
    value={{
      currentUser,
      switchRole,
      activeTab,
      setActiveTab,
      productionModel,
      candidateModel,
      driftReport,
      driftStatus,
      feedbackStats,
      platformMetrics,
      recentPredictions,
      activeRetrainingJob,
      isLoading,
      error,
      toast,
      showToast,
      refreshData
    }}
  >
      {children}
    </AppContext.Provider>;
};
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
