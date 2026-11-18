let currentUserRole = "super_admin";
export function setApiUserRole(role) {
  currentUserRole = role;
}
export function getApiUserRole() {
  return currentUserRole;
}

const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    "x-user-role": currentUserRole,
    ...options.headers
  };
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}
export const api = {
  // Auth
  async login(role) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ role })
    });
  },
  async getMe() {
    return request("/api/auth/me");
  },
  // Predictions
  async predict(features, customerId) {
    return request("/api/predict", {
      method: "POST",
      body: JSON.stringify({ features, customerId })
    });
  },
  async getPredictions(limit = 50) {
    return request(`/api/predictions?limit=${limit}`);
  },
  // Feedback
  async submitFeedback(predictionId, actualOutcome, comments) {
    return request("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ predictionId, actualOutcome, comments })
    });
  },
  async getFeedbackStatistics() {
    return request("/api/feedback/statistics");
  },
  // Models & MLflow
  async getModels() {
    return request("/api/models");
  },
  async getCurrentModels() {
    return request("/api/models/current");
  },
  async compareModels() {
    return request("/api/models/compare");
  },
  async getExperiments() {
    return request("/api/experiments");
  },
  // Datasets
  async getDatasets() {
    return request("/api/datasets");
  },
  async uploadDataset(data) {
    return request("/api/datasets/upload", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  // Monitoring & Drift
  async getMonitoringStatus() {
    return request("/api/monitoring/status");
  },
  async getDriftReport() {
    return request("/api/monitoring/drift");
  },
  async runMonitoringCheck() {
    return request("/api/monitoring/run", {
      method: "POST"
    });
  },
  // Retraining Engine
  async getRetrainingJobs() {
    return request("/api/retraining/jobs");
  },
  async triggerRetraining(triggerType, reason, algorithm = "XGBoost") {
    return request("/api/retraining/trigger", {
      method: "POST",
      body: JSON.stringify({ triggerType, reason, algorithm })
    });
  },
  // Deployment & Canary
  async deployModel(modelVersion, approvalNotes) {
    return request("/api/deployments/deploy", {
      method: "POST",
      body: JSON.stringify({ modelVersion, approvalNotes })
    });
  },
  async rollbackModel(reason) {
    return request("/api/deployments/rollback", {
      method: "POST",
      body: JSON.stringify({ reason })
    });
  },
  async getDeployments() {
    return request("/api/deployments/history");
  },
  async getDeploymentStatus() {
    return request("/api/deployment/status");
  },
  async updateCanarySplit(weight) {
    return request("/api/deployment/canary", {
      method: "POST",
      body: JSON.stringify({ weight })
    });
  },
  async promoteModel(version) {
    return request("/api/deployment/promote", {
      method: "POST",
      body: JSON.stringify({ version })
    });
  },
  async rollbackDeployment(reason) {
    return request("/api/deployment/rollback", {
      method: "POST",
      body: JSON.stringify({ reason })
    });
  },
  async getModelCard() {
    return request("/api/deployment/model-card");
  },
  // High-Precision Statistical Drift
  async getDriftStatus() {
    return request("/api/drift/status");
  },
  async simulateDrift(targetShift = "tenure_and_contract") {
    return request("/api/drift/simulate", {
      method: "POST",
      body: JSON.stringify({ targetShift })
    });
  },
  getDriftReportHtmlUrl() {
    return "/api/drift/report/html";
  },
  // AI Copilot
  async askCopilot(prompt) {
    return request("/api/copilot/chat", {
      method: "POST",
      body: JSON.stringify({ prompt })
    });
  },
  async getCopilotHistory() {
    return request("/api/copilot/history");
  },
  // System, Health & Audit
  async getHealth() {
    return request("/api/health");
  },
  async getMetrics() {
    return request("/api/metrics");
  },
  async getAuditLogs() {
    return request("/api/audit-logs");
  },
  async getConfig() {
    return request("/api/config");
  },
  async updateConfig(config) {
    return request("/api/config", {
      method: "POST",
      body: JSON.stringify(config)
    });
  }
};
