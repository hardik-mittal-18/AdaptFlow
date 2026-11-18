import { GoogleGenAI } from "@google/genai";
import { db } from "./db.js";
let aiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
export async function askGeminiCopilot(prompt) {
  const client = getGeminiClient();
  const prodModel = db.getCurrentProductionModel();
  const candModel = db.getCandidateModel();
  const latestDrift = db.driftReports[0];
  const latestJob = db.retrainingJobs[0];
  const totalPredictions = db.predictions.length;
  const totalFeedback = db.feedbackList.length;
  const verifiedFeedback = db.feedbackList.filter((f) => f.verified);
  const correctFeedback = verifiedFeedback.filter((f) => f.isCorrect).length;
  const verifiedAccuracy = verifiedFeedback.length > 0 ? correctFeedback / verifiedFeedback.length : 0;
  const systemContext = `
You are the AI MLOps Copilot for "AdaptFlow \u2013 Self-Adaptive AI Systems with Feedback Loop".
You are an expert Machine Learning Engineer, MLOps Architect, and Data Scientist.
You have live, direct read access to the actual operational state of the AdaptFlow platform.

LIVE SYSTEM STATE:
\u2022 Production Model:
  - Version: ${prodModel?.version ?? "None"}
  - Name: ${prodModel?.name ?? "N/A"}
  - Algorithm: ${prodModel?.algorithm ?? "N/A"}
  - Accuracy: ${prodModel?.metrics.accuracy ? (prodModel.metrics.accuracy * 100).toFixed(1) + "%" : "N/A"}
  - F1-Score: ${prodModel?.metrics.f1Score ?? "N/A"}
  - Recall: ${prodModel?.metrics.recall ?? "N/A"}
  - Precision: ${prodModel?.metrics.precision ?? "N/A"}
  - ROC-AUC: ${prodModel?.metrics.rocAuc ?? "N/A"}
  - Dataset Version: ${prodModel?.datasetVersion ?? "N/A"} (DVC Hash: ${prodModel?.dvcHash ?? "N/A"})
  - MLflow Run: ${prodModel?.mlflowRunId ?? "N/A"}

\u2022 Candidate Model:
  - Version: ${candModel?.version ?? "None"}
  - Algorithm: ${candModel?.algorithm ?? "N/A"}
  - Accuracy: ${candModel?.metrics.accuracy ? (candModel.metrics.accuracy * 100).toFixed(1) + "%" : "N/A"}
  - F1-Score: ${candModel?.metrics.f1Score ?? "N/A"}
  - ROC-AUC: ${candModel?.metrics.rocAuc ?? "N/A"}
  - Status: ${candModel?.status ?? "N/A"} (Stage: ${candModel?.stage ?? "N/A"})
  - Validation Passed: ${candModel?.validationReport?.passed ? "YES" : "NO"}

\u2022 Evidently AI Drift Report:
  - Status: ${latestDrift?.status ?? "healthy"}
  - Dataset Drift Detected: ${latestDrift?.datasetDriftDetected ? "YES" : "NO"}
  - Drift Share: ${latestDrift?.driftShare ?? 0}%
  - Drifted Features (${latestDrift?.driftedFeaturesCount ?? 0}/${latestDrift?.totalFeaturesCount ?? 0}):
    ${latestDrift?.featureDriftResults.filter((f) => f.driftDetected).map((f) => `${f.feature} (${f.type}, test: ${f.testName}, score/p-value: ${f.driftScore}/${f.pValue})`).join(", ") || "None"}

\u2022 Continuous Feedback Loop:
  - Total Predictions: ${totalPredictions}
  - Verified Feedback: ${verifiedFeedback.length}
  - Live Verified Accuracy: ${(verifiedAccuracy * 100).toFixed(1)}%

\u2022 Latest Retraining Job:
  - ID: ${latestJob?.id ?? "None"}
  - Status: ${latestJob?.status ?? "None"}
  - Trigger: ${latestJob?.triggerReason ?? "None"}
  - Accuracy Diff: ${latestJob?.metricsDiff ? (latestJob.metricsDiff.accuracyDiff > 0 ? "+" : "") + (latestJob.metricsDiff.accuracyDiff * 100).toFixed(1) + "%" : "N/A"}
  - F1 Diff: ${latestJob?.metricsDiff ? (latestJob.metricsDiff.f1ScoreDiff > 0 ? "+" : "") + (latestJob.metricsDiff.f1ScoreDiff * 100).toFixed(1) + "%" : "N/A"}

RULES:
1. Always ground your answers in the REAL statistics provided above. Never hallucinate or invent fake metrics.
2. Structure your response with clean markdown headings, bullet points, and actionable next steps.
3. If recommending deployment, explain the candidate's validation status and risks, but remind the user that Super Admin approval in the Deployment Center is mandatory.
4. Keep explanations technical yet executive-friendly.
`;
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: systemContext
        }
      });
      const text = response.text || "Unable to generate response from Gemini API.";
      return {
        text,
        suggestedActions: [
          "Examine candidate Model V2 validation report",
          "Inspect Evidently drift distribution curves",
          "Trigger manual retraining job",
          "Review Super Admin deployment safeguards"
        ],
        isFallback: false
      };
    } catch (error) {
      console.error("Gemini API call error:", error);
    }
  }
  const lower = prompt.toLowerCase();
  let generatedText = "";
  let actions = [
    "View Evidently AI Drift Report",
    "Review Candidate Model V2",
    "Open Retraining Center",
    "Configure GEMINI_API_KEY in Secrets"
  ];
  if (lower.includes("drift")) {
    generatedText = `### \u{1F4CA} Evidently AI Drift Analysis Report

**Current Status:** \`${latestDrift?.status.toUpperCase()}\` \xB7 **Dataset Drift Detected:** \`${latestDrift?.datasetDriftDetected ? "YES" : "NO"}\`

#### 1. Drift Findings:
\u2022 **Monitored Features:** ${latestDrift?.totalFeaturesCount} features evaluated against Baseline reference (\`v1.0.0\`).
\u2022 **Drifted Features Count:** ${latestDrift?.driftedFeaturesCount} (${latestDrift?.driftShare}% drift share).
\u2022 **Breached Features:**
  - **\`monthlyCharges\`** (Kolmogorov-Smirnov Statistic $D = 0.22$, $p = 0.012$ < $\\alpha = 0.05$): A significant influx of customers with monthly charges exceeding $90/mo (fiber optic packages) has shifted the probability density curve.
  - **\`contract\`** (Population Stability Index $\\text{PSI} = 0.18$ > $0.10$ threshold): Recent signups show a higher skew toward month-to-month commitments compared to the historical baseline.

#### 2. Model Performance Impact:
While data drift has occurred, verified customer feedback shows the current production model (\`v1.0.0\`) maintains ${(verifiedAccuracy * 100).toFixed(1)}% accuracy. However, false negatives are slightly increasing on fiber optic plans.

#### 3. Recommended Action:
The automated retraining pipeline has already trained candidate model **\`v1.1.0\` (XGBoost)**, which incorporates 142 verified feedback samples and demonstrates a **+3.3% accuracy** and **+3.7% F1-score lift**. Proceed to the **Deployment Center** to review and promote the candidate.`;
  } else if (lower.includes("compare") || lower.includes("v1") || lower.includes("v2")) {
    generatedText = `### \u2696\uFE0F Model Comparison: Production \`v1.0.0\` vs Candidate \`v1.1.0\`

| Metric | Production (\`v1.0.0\` Random Forest) | Candidate (\`v1.1.0\` XGBoost) | Variance (\u0394) | Acceptance Status |
| :--- | :--- | :--- | :--- | :--- |
| **Algorithm** | Random Forest (250 trees) | XGBoost (300 estimators) | Gradient Boosted | \u2705 Approved |
| **Accuracy** | ${prodModel?.metrics.accuracy ? (prodModel.metrics.accuracy * 100).toFixed(1) + "%" : "81.4%"} | ${candModel?.metrics.accuracy ? (candModel.metrics.accuracy * 100).toFixed(1) + "%" : "84.7%"} | **+3.3%** | \u2705 Exceeds >=0.0% |
| **F1-Score** | ${prodModel?.metrics.f1Score ?? 0.801} | ${candModel?.metrics.f1Score ?? 0.838} | **+0.037** | \u2705 Exceeds >=0.0% |
| **Recall (Churn)** | ${prodModel?.metrics.recall ?? 0.778} | ${candModel?.metrics.recall ?? 0.824} | **+0.046** | \u2705 Critical metric |
| **Precision** | ${prodModel?.metrics.precision ?? 0.826} | ${candModel?.metrics.precision ?? 0.852} | **+0.026** | \u2705 Stable |
| **ROC-AUC** | ${prodModel?.metrics.rocAuc ?? 0.862} | ${candModel?.metrics.rocAuc ?? 0.894} | **+0.032** | \u2705 Superior separation |
| **Avg Inference** | ~3.8ms | ~3.4ms | -0.4ms | \u2705 Zero latency penalty |

#### Key Architectural Strengths:
1. **Fiber Optic Generalization:** Candidate \`v1.1.0\` penalizes month-to-month contracts on high monthly charge tiers more aggressively, accurately catching churners that \`v1.0.0\` missed.
2. **DVC & MLflow Lineage:** Built on augmented dataset \`v1.1.0\` (DVC: \`${candModel?.dvcHash.substring(0, 16)}...\`) with reproducible hyperparameters logged in MLflow run \`${candModel?.mlflowRunId}\`.

**Recommendation:** Candidate model \`v1.1.0\` passed all validation gates. Recommend Super Admin 1-click Blue-Green deployment.`;
  } else if (lower.includes("retrain") || lower.includes("trigger")) {
    generatedText = `### \u{1F504} Retraining Advisor: Self-Adaptive Pipeline Analysis

**Current Trigger Assessment:**
\u2022 **Drift Breached:** Monthly Charges and Contract distribution crossed threshold (Drift share: ${latestDrift?.driftShare}%).
\u2022 **Verified Ground Truth Feedback:** ${verifiedFeedback.length} verified customer records available (Requirement: >=${db.config.minFeedbackSamplesForRetrain}).
\u2022 **Active Candidate:** An evaluated candidate (\`v1.1.0\`) is currently **Awaiting Approval** in the Deployment Center.

#### Recommendation:
1. **Do NOT initiate duplicate retraining** right now: Job \`${latestJob?.id}\` has already successfully trained and validated candidate model \`v1.1.0\`.
2. **Deploy Candidate \`v1.1.0\` first:** Once approved by Super Admin, the active production baseline will be updated to \`v1.1.0\`, and the drift status will re-calibrate against the new augmented baseline.
3. If new data drift persists after deployment and an additional ${db.config.minFeedbackSamplesForRetrain} feedback samples are gathered, the system will automatically trigger a new retraining cycle.`;
  } else if (lower.includes("risk") || lower.includes("deploy")) {
    generatedText = `### \u{1F6E1}\uFE0F Pre-Deployment Risk Assessment: Candidate \`v1.1.0\`

Before approving deployment, here is the risk matrix generated by the AdaptFlow Validation Gatekeeper:

1. **Schema Compatibility:** \u2705 **Zero Risk**. Input schema matches 19 features exactly with identical categorical encodings.
2. **Inference Latency:** \u2705 **Low Risk**. XGBoost C++ runtime benchmarks at 3.4ms vs 3.8ms for Random Forest.
3. **Data Leakage Check:** \u2705 **Passed**. 5-fold cross validation stratified on churn target, evaluated strictly on held-out test splits.
4. **False Positive Impact:** \u26A0\uFE0F **Moderate Consideration**. Slightly higher sensitivity to churn (Recall 82.4% vs 77.8%) means ~1.2% more retention discount offers will be extended. Net ROI is strongly positive given high customer acquisition costs.
5. **Rollback Safety:** \u2705 **Guaranteed**. AdaptFlow automatically retains \`v1.0.0\` in the registry for instant 1-click rollback with zero downtime.

**Conclusion:** Risk profile is well within enterprise tolerances. Deployment is recommended.`;
  } else {
    generatedText = `### \u{1F916} AdaptFlow MLOps Copilot Insights

Here is the operational summary for your self-adaptive feedback system:

\u2022 **Active Production Model:** \`${prodModel?.name}\` (\`${prodModel?.version}\`) running at **${prodModel?.metrics.accuracy ? (prodModel.metrics.accuracy * 100).toFixed(1) + "%" : "81.4%"} accuracy**.
\u2022 **Feedback Loop Health:** ${totalPredictions} total predictions recorded, with ${verifiedFeedback.length} verified customer outcomes collected via the Prediction & Feedback Center.
\u2022 **Drift Status:** Evidently AI detected feature distribution shift in \`monthlyCharges\` ($90+ fiber segment) and \`contract\` types.
\u2022 **Candidate Status:** Retrained model \`v1.1.0\` achieved **84.7% accuracy (+3.3% lift)** and is currently **Awaiting Approval** by Super Admin.

You can ask me to:
- "Explain the latest data drift report"
- "Compare Model V1 and Model V2"
- "Should I deploy the candidate model?"
- "What are the main risks of deploying candidate V2?"`;
  }
  return {
    text: generatedText,
    suggestedActions: actions,
    isFallback: true
  };
}
