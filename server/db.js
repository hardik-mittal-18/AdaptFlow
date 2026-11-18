import { MLEngine, BASELINE_WEIGHTS_V1 } from "./mlEngine.js";
class Database {
  users = [];
  datasets = [];
  models = [];
  predictions = [];
  feedbackList = [];
  driftReports = [];
  retrainingJobs = [];
  deployments = [];
  mlflowRuns = [];
  auditLogs = [];
  copilotMessages = [];
  // Monitoring & Metrics
  metrics = {
    totalPredictionRequests: 0,
    failedPredictions: 0,
    totalFeedbackSubmissions: 0,
    retrainingJobsTriggered: 0,
    activeAlerts: 1,
    avgInferenceLatencyMs: 3.8,
    systemUptimeSeconds: 34200
  };
  // Retraining & Monitoring configuration
  config = {
    driftThreshold: 0.15,
    // PSI or KS statistic threshold
    minFeedbackSamplesForRetrain: 25,
    minAccuracyRequirement: 0.8,
    minF1Requirement: 0.76,
    minRocAucRequirement: 0.82,
    autoRetrainOnDrift: true,
    requireAdminApprovalForDeploy: true,
    retrainingCooldownHours: 24
  };
  constructor() {
    this.seed();
  }
  seed() {
    this.users = [
      {
        id: "usr-admin-01",
        name: "Sarah Chen (Super Admin)",
        email: "admin@adaptflow.ai",
        role: "super_admin",
        createdAt: "2026-01-10T08:00:00Z"
      },
      {
        id: "usr-mle-02",
        name: "Marcus Vance (ML Engineer)",
        email: "mle@adaptflow.ai",
        role: "ml_engineer",
        createdAt: "2026-01-15T09:30:00Z"
      },
      {
        id: "usr-end-03",
        name: "Elena Rostova (Account Manager)",
        email: "user@adaptflow.ai",
        role: "end_user",
        createdAt: "2026-02-01T11:00:00Z"
      }
    ];
    this.datasets = [
      {
        id: "ds-v1-baseline",
        name: "IBM Telco Churn - Cleaned Baseline",
        version: "v1.0.0",
        dvcHash: "dvc-sha256-83a9f041e892c9085817a22830f0f5",
        recordsCount: 7043,
        sizeKb: 975,
        churnRate: 0.265,
        createdAt: "2026-01-10T12:00:00Z",
        createdBy: "mle@adaptflow.ai",
        type: "reference_baseline",
        features: [
          "gender",
          "seniorCitizen",
          "partner",
          "dependents",
          "tenure",
          "phoneService",
          "multipleLines",
          "internetService",
          "onlineSecurity",
          "onlineBackup",
          "deviceProtection",
          "techSupport",
          "streamingTV",
          "streamingMovies",
          "contract",
          "paperlessBilling",
          "paymentMethod",
          "monthlyCharges",
          "totalCharges",
          "churn"
        ],
        description: "Original IBM Telco customer churn dataset with standard preprocessing, one-hot encoding and 80/20 train/test split."
      },
      {
        id: "ds-v2-augmented",
        name: "IBM Telco Churn + Q1 Verified Feedback",
        version: "v1.1.0",
        dvcHash: "dvc-sha256-b42e71890abf3319082ac9710521e4",
        recordsCount: 7185,
        sizeKb: 994,
        churnRate: 0.271,
        createdAt: "2026-03-28T14:15:00Z",
        createdBy: "AdaptFlow Self-Adaptive Pipeline",
        type: "retraining_augmented",
        features: [
          "gender",
          "seniorCitizen",
          "partner",
          "dependents",
          "tenure",
          "phoneService",
          "multipleLines",
          "internetService",
          "onlineSecurity",
          "onlineBackup",
          "deviceProtection",
          "techSupport",
          "streamingTV",
          "streamingMovies",
          "contract",
          "paperlessBilling",
          "paymentMethod",
          "monthlyCharges",
          "totalCharges",
          "churn"
        ],
        description: "Baseline reference combined with 142 verified real-world customer outcomes reflecting recent streaming service & fiber optic price shifts."
      }
    ];
    this.models = [
      {
        id: "mod-v1-prod",
        version: "v1.0.0",
        name: "Telco Churn Random Forest Prod",
        algorithm: "Random Forest",
        status: "production",
        stage: "Production",
        metrics: {
          accuracy: 0.814,
          precision: 0.826,
          recall: 0.778,
          f1Score: 0.801,
          rocAuc: 0.862,
          confusionMatrix: {
            truePositive: 320,
            falsePositive: 67,
            trueNegative: 980,
            falseNegative: 91
          }
        },
        hyperparameters: {
          n_estimators: 250,
          max_depth: 12,
          min_samples_split: 5,
          min_samples_leaf: 2,
          class_weight: "balanced_subsample",
          random_state: 42
        },
        datasetVersion: "v1.0.0",
        dvcHash: "dvc-sha256-83a9f041e892c9085817a22830f0f5",
        mlflowRunId: "mlf-run-2983-rf-base",
        artifactPath: "s3://adaptflow-models/telco-churn/v1.0.0/model.joblib",
        artifactSizeMb: 14.8,
        createdAt: "2026-01-12T10:00:00Z",
        deployedAt: "2026-01-12T14:00:00Z",
        deployedBy: "admin@adaptflow.ai",
        description: "Initial production model trained on Telco Customer Churn reference dataset. High precision on long-tenure customers.",
        validationReport: {
          passed: true,
          schemaValidation: true,
          dataQualityCheck: true,
          thresholdChecksPassed: true,
          accuracyCheck: true,
          f1Check: true,
          rocAucCheck: true,
          details: [
            "Input schema passed 19 features type validation",
            "No null values detected in validation fold",
            "Accuracy 81.4% exceeds threshold 80.0%",
            "F1-score 0.801 exceeds threshold 0.760",
            "ROC-AUC 0.862 exceeds threshold 0.820"
          ]
        }
      },
      {
        id: "mod-v2-cand",
        version: "v1.1.0",
        name: "Telco Churn XGBoost Retrained",
        algorithm: "XGBoost",
        status: "candidate",
        stage: "Staging",
        metrics: {
          accuracy: 0.847,
          precision: 0.852,
          recall: 0.824,
          f1Score: 0.838,
          rocAuc: 0.894,
          confusionMatrix: {
            truePositive: 341,
            falsePositive: 59,
            trueNegative: 994,
            falseNegative: 73
          }
        },
        hyperparameters: {
          n_estimators: 300,
          learning_rate: 0.045,
          max_depth: 6,
          subsample: 0.85,
          colsample_bytree: 0.8,
          scale_pos_weight: 2.77,
          eval_metric: "aucpr"
        },
        datasetVersion: "v1.1.0",
        dvcHash: "dvc-sha256-b42e71890abf3319082ac9710521e4",
        mlflowRunId: "mlf-run-4102-xgb-retrained",
        artifactPath: "s3://adaptflow-models/telco-churn/v1.1.0/model.ubj",
        artifactSizeMb: 9.2,
        createdAt: "2026-03-28T16:00:00Z",
        description: "Candidate retrained via automated feedback loop on 142 verified ground truths. Demonstrates +3.3% accuracy and +3.7% F1 lift over production.",
        validationReport: {
          passed: true,
          schemaValidation: true,
          dataQualityCheck: true,
          thresholdChecksPassed: true,
          accuracyCheck: true,
          f1Check: true,
          rocAucCheck: true,
          details: [
            "Passed all 19 feature schema compatibility checks",
            "Zero inference latency regressions (<4.2ms avg)",
            "Accuracy +3.3% higher than production model V1",
            "F1-Score +0.037 lift on recent drifted fiber customers",
            "Ready for Super Admin 1-click Blue-Green deployment"
          ]
        }
      },
      {
        id: "mod-v0-arch",
        version: "v0.9.0",
        name: "Telco Churn Logistic Regression",
        algorithm: "Logistic Regression",
        status: "archived",
        stage: "Archived",
        metrics: {
          accuracy: 0.781,
          precision: 0.764,
          recall: 0.71,
          f1Score: 0.736,
          rocAuc: 0.829,
          confusionMatrix: {
            truePositive: 298,
            falsePositive: 92,
            trueNegative: 940,
            falseNegative: 121
          }
        },
        hyperparameters: {
          penalty: "l2",
          C: 1,
          solver: "lbfgs",
          max_iter: 1e3
        },
        datasetVersion: "v1.0.0",
        dvcHash: "dvc-sha256-83a9f041e892c9085817a22830f0f5",
        mlflowRunId: "mlf-run-1109-lr-legacy",
        artifactPath: "s3://adaptflow-models/telco-churn/v0.9.0/model.pkl",
        artifactSizeMb: 2.1,
        createdAt: "2025-12-01T09:00:00Z",
        deployedAt: "2025-12-05T10:00:00Z",
        description: "Legacy linear baseline model. Archived after Model V1 Random Forest deployment."
      }
    ];
    this.mlflowRuns = [
      {
        runId: "mlf-run-4102-xgb-retrained",
        runName: "retraining-cycle-q1-xgb",
        experimentName: "telco-churn-retraining",
        status: "FINISHED",
        artifactUri: "s3://mlflow-artifacts/adaptflow/4102",
        startTime: "2026-03-28T15:45:10Z",
        endTime: "2026-03-28T15:58:34Z",
        durationMs: 804e3,
        parameters: {
          model_type: "XGBoost",
          learning_rate: 0.045,
          max_depth: 6,
          n_estimators: 300,
          dvc_data_version: "v1.1.0",
          verified_feedback_count: 142
        },
        metrics: {
          val_accuracy: 0.847,
          val_f1: 0.838,
          val_recall: 0.824,
          val_precision: 0.852,
          val_roc_auc: 0.894
        },
        tags: {
          "trigger.reason": "drift_threshold_exceeded_monthly_charges",
          "deployed.status": "candidate_awaiting_approval",
          "git.commit": "7c89f21a"
        },
        modelVersion: "v1.1.0"
      },
      {
        runId: "mlf-run-2983-rf-base",
        runName: "baseline-rf-gridsearch-opt",
        experimentName: "telco-churn-baseline",
        status: "FINISHED",
        artifactUri: "s3://mlflow-artifacts/adaptflow/2983",
        startTime: "2026-01-12T09:20:00Z",
        endTime: "2026-01-12T09:44:12Z",
        durationMs: 1452e3,
        parameters: {
          model_type: "Random Forest",
          n_estimators: 250,
          max_depth: 12,
          class_weight: "balanced_subsample",
          dvc_data_version: "v1.0.0"
        },
        metrics: {
          val_accuracy: 0.814,
          val_f1: 0.801,
          val_recall: 0.778,
          val_precision: 0.826,
          val_roc_auc: 0.862
        },
        tags: {
          "deployed.status": "production",
          "git.commit": "3e41b089"
        },
        modelVersion: "v1.0.0"
      },
      {
        runId: "mlf-run-1109-lr-legacy",
        runName: "logistic-regression-prototype",
        experimentName: "telco-churn-baseline",
        status: "FINISHED",
        artifactUri: "s3://mlflow-artifacts/adaptflow/1109",
        startTime: "2025-12-01T08:15:00Z",
        endTime: "2025-12-01T08:22:15Z",
        durationMs: 435e3,
        parameters: {
          model_type: "Logistic Regression",
          penalty: "l2",
          C: 1
        },
        metrics: {
          val_accuracy: 0.781,
          val_f1: 0.736,
          val_recall: 0.71,
          val_precision: 0.764,
          val_roc_auc: 0.829
        },
        tags: {
          "deployed.status": "archived"
        },
        modelVersion: "v0.9.0"
      }
    ];
    const sampleCustomers = [
      {
        cid: "CUST-7821",
        features: {
          gender: "Female",
          seniorCitizen: 0,
          partner: "No",
          dependents: "No",
          tenure: 2,
          phoneService: "Yes",
          multipleLines: "No",
          internetService: "Fiber optic",
          onlineSecurity: "No",
          onlineBackup: "No",
          deviceProtection: "No",
          techSupport: "No",
          streamingTV: "Yes",
          streamingMovies: "Yes",
          contract: "Month-to-month",
          paperlessBilling: "Yes",
          paymentMethod: "Electronic check",
          monthlyCharges: 94.65,
          totalCharges: 189.3
        },
        actual: "Churn",
        date: "2026-03-27T10:14:22Z"
      },
      {
        cid: "CUST-3904",
        features: {
          gender: "Male",
          seniorCitizen: 0,
          partner: "Yes",
          dependents: "Yes",
          tenure: 58,
          phoneService: "Yes",
          multipleLines: "Yes",
          internetService: "DSL",
          onlineSecurity: "Yes",
          onlineBackup: "Yes",
          deviceProtection: "Yes",
          techSupport: "Yes",
          streamingTV: "No",
          streamingMovies: "No",
          contract: "Two year",
          paperlessBilling: "No",
          paymentMethod: "Credit card (automatic)",
          monthlyCharges: 64.2,
          totalCharges: 3723.6
        },
        actual: "No Churn",
        date: "2026-03-27T11:20:00Z"
      },
      {
        cid: "CUST-6119",
        features: {
          gender: "Female",
          seniorCitizen: 1,
          partner: "No",
          dependents: "No",
          tenure: 8,
          phoneService: "Yes",
          multipleLines: "Yes",
          internetService: "Fiber optic",
          onlineSecurity: "No",
          onlineBackup: "No",
          deviceProtection: "Yes",
          techSupport: "No",
          streamingTV: "Yes",
          streamingMovies: "Yes",
          contract: "Month-to-month",
          paperlessBilling: "Yes",
          paymentMethod: "Electronic check",
          monthlyCharges: 102.8,
          totalCharges: 822.4
        },
        actual: "Churn",
        date: "2026-03-27T13:45:10Z"
      },
      {
        cid: "CUST-4412",
        features: {
          gender: "Male",
          seniorCitizen: 0,
          partner: "Yes",
          dependents: "No",
          tenure: 36,
          phoneService: "Yes",
          multipleLines: "No",
          internetService: "Fiber optic",
          onlineSecurity: "Yes",
          onlineBackup: "No",
          deviceProtection: "Yes",
          techSupport: "Yes",
          streamingTV: "No",
          streamingMovies: "Yes",
          contract: "One year",
          paperlessBilling: "Yes",
          paymentMethod: "Bank transfer (automatic)",
          monthlyCharges: 88.4,
          totalCharges: 3182.4
        },
        actual: "No Churn",
        date: "2026-03-27T15:10:05Z"
      },
      {
        cid: "CUST-9012",
        features: {
          gender: "Female",
          seniorCitizen: 0,
          partner: "No",
          dependents: "No",
          tenure: 1,
          phoneService: "No",
          multipleLines: "No phone service",
          internetService: "DSL",
          onlineSecurity: "No",
          onlineBackup: "No",
          deviceProtection: "No",
          techSupport: "No",
          streamingTV: "No",
          streamingMovies: "No",
          contract: "Month-to-month",
          paperlessBilling: "Yes",
          paymentMethod: "Mailed check",
          monthlyCharges: 29.85,
          totalCharges: 29.85
        },
        actual: "Churn",
        date: "2026-03-28T09:05:30Z"
      },
      {
        cid: "CUST-1598",
        features: {
          gender: "Male",
          seniorCitizen: 0,
          partner: "Yes",
          dependents: "Yes",
          tenure: 72,
          phoneService: "Yes",
          multipleLines: "Yes",
          internetService: "Fiber optic",
          onlineSecurity: "Yes",
          onlineBackup: "Yes",
          deviceProtection: "Yes",
          techSupport: "Yes",
          streamingTV: "Yes",
          streamingMovies: "Yes",
          contract: "Two year",
          paperlessBilling: "Yes",
          paymentMethod: "Credit card (automatic)",
          monthlyCharges: 115.65,
          totalCharges: 8326.8
        },
        actual: "No Churn",
        date: "2026-03-28T10:30:15Z"
      },
      {
        cid: "CUST-8301",
        features: {
          gender: "Female",
          seniorCitizen: 1,
          partner: "Yes",
          dependents: "No",
          tenure: 14,
          phoneService: "Yes",
          multipleLines: "No",
          internetService: "Fiber optic",
          onlineSecurity: "No",
          onlineBackup: "Yes",
          deviceProtection: "No",
          techSupport: "No",
          streamingTV: "Yes",
          streamingMovies: "No",
          contract: "Month-to-month",
          paperlessBilling: "Yes",
          paymentMethod: "Electronic check",
          monthlyCharges: 85.9,
          totalCharges: 1202.6
        },
        actual: "Churn",
        date: "2026-03-28T12:12:00Z"
      },
      {
        cid: "CUST-2204",
        features: {
          gender: "Male",
          seniorCitizen: 0,
          partner: "No",
          dependents: "No",
          tenure: 24,
          phoneService: "Yes",
          multipleLines: "Yes",
          internetService: "DSL",
          onlineSecurity: "Yes",
          onlineBackup: "Yes",
          deviceProtection: "No",
          techSupport: "Yes",
          streamingTV: "No",
          streamingMovies: "No",
          contract: "One year",
          paperlessBilling: "No",
          paymentMethod: "Bank transfer (automatic)",
          monthlyCharges: 61.2,
          totalCharges: 1468.8
        },
        actual: "No Churn",
        date: "2026-03-28T14:40:22Z"
      }
    ];
    for (let i = 0; i < 40; i++) {
      const isChurn = i % 3 === 0;
      const tenure = isChurn ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 50) + 15;
      const monthlyCharges = isChurn ? 85 + Math.random() * 30 : 35 + Math.random() * 50;
      const sampleFeat = {
        gender: i % 2 === 0 ? "Female" : "Male",
        seniorCitizen: i % 5 === 0 ? 1 : 0,
        partner: i % 3 === 0 ? "Yes" : "No",
        dependents: i % 4 === 0 ? "Yes" : "No",
        tenure,
        phoneService: "Yes",
        multipleLines: i % 2 === 0 ? "Yes" : "No",
        internetService: isChurn ? "Fiber optic" : i % 2 === 0 ? "DSL" : "No",
        onlineSecurity: isChurn ? "No" : "Yes",
        onlineBackup: isChurn ? "No" : "Yes",
        deviceProtection: isChurn ? "No" : "Yes",
        techSupport: isChurn ? "No" : "Yes",
        streamingTV: isChurn ? "Yes" : "No",
        streamingMovies: isChurn ? "Yes" : "No",
        contract: isChurn ? "Month-to-month" : i % 2 === 0 ? "One year" : "Two year",
        paperlessBilling: isChurn ? "Yes" : "No",
        paymentMethod: isChurn ? "Electronic check" : "Credit card (automatic)",
        monthlyCharges: Math.round(monthlyCharges * 100) / 100,
        totalCharges: Math.round(tenure * monthlyCharges * 100) / 100
      };
      sampleCustomers.push({
        cid: `CUST-${5e3 + i}`,
        features: sampleFeat,
        actual: isChurn ? "Churn" : "No Churn",
        date: new Date(Date.now() - (40 - i) * 18 * 3600 * 1e3).toISOString()
      });
    }
    for (const sc of sampleCustomers) {
      const pred = MLEngine.predict(sc.features, BASELINE_WEIGHTS_V1);
      const pid = `pred-${Math.random().toString(36).substring(2, 9)}`;
      const predRecord = {
        id: pid,
        customerId: sc.cid,
        features: sc.features,
        prediction: pred.prediction,
        churnProbability: pred.churnProbability,
        riskLevel: pred.riskLevel,
        modelVersion: "v1.0.0",
        algorithm: "Random Forest",
        inferenceDurationMs: pred.inferenceDurationMs,
        timestamp: sc.date,
        userId: "usr-end-03",
        userName: "Elena Rostova",
        featureImportances: pred.featureImportances
      };
      if (Math.random() > 0.15) {
        const feedbackRecord = {
          id: `fb-${Math.random().toString(36).substring(2, 9)}`,
          predictionId: pid,
          customerId: sc.cid,
          predictedOutcome: pred.prediction,
          actualOutcome: sc.actual,
          isCorrect: pred.prediction === sc.actual,
          predictedProbability: pred.churnProbability,
          modelVersion: "v1.0.0",
          feedbackTimestamp: new Date(new Date(sc.date).getTime() + 7 * 864e5).toISOString(),
          submittedBy: "Elena Rostova",
          userRole: "end_user",
          comments: pred.prediction === sc.actual ? "Outcome confirmed by customer account status" : "Customer retained via retention discount promo",
          verified: true
        };
        predRecord.feedback = feedbackRecord;
        this.feedbackList.push(feedbackRecord);
      }
      this.predictions.push(predRecord);
    }
    this.metrics.totalPredictionRequests = this.predictions.length;
    this.metrics.totalFeedbackSubmissions = this.feedbackList.length;
    const baselineFeatures = sampleCustomers.slice(0, 20).map((s) => s.features);
    const currentFeatures = sampleCustomers.slice(20).map((s) => s.features);
    const driftResults = MLEngine.calculateDataDrift(baselineFeatures, currentFeatures);
    const driftedFeatures = driftResults.filter((r) => r.driftDetected);
    this.driftReports = [
      {
        id: "drift-rep-2026-03-28-01",
        timestamp: "2026-03-28T14:30:00Z",
        referenceDatasetVersion: "v1.0.0",
        currentDatasetVersion: "v1.1.0 (Live Batch)",
        referenceSampleCount: 7043,
        currentSampleCount: currentFeatures.length,
        datasetDriftDetected: driftedFeatures.length >= 2,
        driftShare: Math.round(driftedFeatures.length / driftResults.length * 100),
        driftedFeaturesCount: driftedFeatures.length,
        totalFeaturesCount: driftResults.length,
        status: driftedFeatures.length >= 2 ? "warning" : "healthy",
        featureDriftResults: driftResults,
        summary: `Evidently AI statistical test detected distribution shift in ${driftedFeatures.map((f) => f.feature).join(", ")}. Kolmogorov-Smirnov p-value on monthly charges shifted due to fiber customer influx.`,
        triggeredRetrainingJobId: "retrain-job-8841"
      },
      {
        id: "drift-rep-2026-02-15-01",
        timestamp: "2026-02-15T10:00:00Z",
        referenceDatasetVersion: "v1.0.0",
        currentDatasetVersion: "v1.0.0-w6",
        referenceSampleCount: 7043,
        currentSampleCount: 420,
        datasetDriftDetected: false,
        driftShare: 0,
        driftedFeaturesCount: 0,
        totalFeaturesCount: driftResults.length,
        status: "healthy",
        featureDriftResults: driftResults.map((r) => ({ ...r, driftDetected: false, driftScore: 0.04, pValue: 0.42 })),
        summary: "All feature distributions within normal Kolmogorov-Smirnov and PSI bounds. No drift detected."
      }
    ];
    this.retrainingJobs = [
      {
        id: "retrain-job-8841",
        triggerType: "drift_threshold_exceeded",
        triggerReason: "Data drift detected in Monthly Charges (p=0.012) & Contract distribution. Drift share 28.5% exceeds threshold 15.0%.",
        status: "awaiting_approval",
        currentStep: 6,
        totalSteps: 7,
        steps: [
          {
            stepIndex: 1,
            name: "Drift & Performance Trigger Detection",
            description: "Triggered by Evidently AI drift monitor. Verified feedback volume: 142 samples.",
            status: "completed",
            durationMs: 420
          },
          {
            stepIndex: 2,
            name: "Feedback Data Ingestion & Label Validation",
            description: "Audited 142 verified ground truth feedback pairs. Missing label rate: 0.0%.",
            status: "completed",
            durationMs: 1850
          },
          {
            stepIndex: 3,
            name: "Dataset Versioning & DVC Commit",
            description: "Created dataset version v1.1.0 with hash dvc-sha256-b42e71890abf. 7,185 total records.",
            status: "completed",
            durationMs: 3100
          },
          {
            stepIndex: 4,
            name: "Model Training & MLflow Tracking",
            description: "Trained XGBoost Classifier (300 estimators, max_depth=6). Logged run mlf-run-4102-xgb-retrained.",
            status: "completed",
            durationMs: 14200
          },
          {
            stepIndex: 5,
            name: "Evaluation & Cross-Validation",
            description: "Candidate metrics: Accuracy 84.7%, F1 0.838, ROC-AUC 0.894.",
            status: "completed",
            durationMs: 2400
          },
          {
            stepIndex: 6,
            name: "Validation Against Acceptance Criteria",
            description: "Passed all criteria: Accuracy lift +3.3%, F1 lift +0.037. Candidate model v1.1.0 ready for deployment.",
            status: "completed",
            durationMs: 850
          },
          {
            stepIndex: 7,
            name: "Super Admin Approval & Blue-Green Deploy",
            description: "Awaiting Super Admin 1-click approval in Deployment Center.",
            status: "pending"
          }
        ],
        baselineModelVersion: "v1.0.0",
        candidateModelVersion: "v1.1.0",
        candidateMetrics: {
          accuracy: 0.847,
          precision: 0.852,
          recall: 0.824,
          f1Score: 0.838,
          rocAuc: 0.894,
          confusionMatrix: {
            truePositive: 341,
            falsePositive: 59,
            trueNegative: 994,
            falseNegative: 73
          }
        },
        baselineMetrics: {
          accuracy: 0.814,
          precision: 0.826,
          recall: 0.778,
          f1Score: 0.801,
          rocAuc: 0.862,
          confusionMatrix: {
            truePositive: 320,
            falsePositive: 67,
            trueNegative: 980,
            falseNegative: 91
          }
        },
        metricsDiff: {
          accuracyDiff: 0.033,
          f1ScoreDiff: 0.037,
          recallDiff: 0.046,
          rocAucDiff: 0.032
        },
        verifiedFeedbackSamplesUsed: 142,
        dvcNewDatasetVersion: "v1.1.0",
        dvcHash: "dvc-sha256-b42e71890abf3319082ac9710521e4",
        mlflowRunId: "mlf-run-4102-xgb-retrained",
        validationPassed: true,
        validationDetails: [
          "Accuracy lift: +3.3% (Threshold: >=0%)",
          "F1 Score lift: +3.7% (Threshold: >=0%)",
          "Recall lift: +4.6% on churning customers",
          "Inference latency verified: 3.4ms",
          "Zero schema regressions across 19 inputs"
        ],
        createdAt: "2026-03-28T14:45:00Z",
        initiatedBy: "Self-Adaptive Retraining Engine",
        logs: [
          "[14:45:00] Trigger registered: Data drift in Monthly Charges (KS-stat: 0.22, p=0.012).",
          "[14:45:02] Ingesting verified feedback records. Filtered 142 ground-truth verified outcomes.",
          "[14:45:05] Checking label integrity. Zero corrupted labels found.",
          "[14:45:08] DVC commit initiated. Version v1.1.0 tagged with DVC hash b42e7189.",
          "[14:45:11] Hyperparameter tuning started with XGBoost objective=binary:logistic.",
          "[14:45:25] MLflow run mlf-run-4102 logged with parameters and model artifacts.",
          "[14:45:28] Evaluation finished. Candidate Model V2 outperforms Production Model V1 across all 4 key metrics.",
          "[14:45:29] Model validation passed. Gatekeeper transitioned job to AWAITING_APPROVAL."
        ]
      }
    ];
    this.deployments = [
      {
        id: "dep-001",
        modelVersion: "v1.0.0",
        previousModelVersion: "v0.9.0",
        action: "deploy",
        deployedBy: "admin@adaptflow.ai",
        timestamp: "2026-01-12T14:00:00Z",
        status: "active",
        reason: "Initial production promotion of Random Forest model V1. Passed baseline validation checks.",
        approvalNotes: "Approved by Lead Architect Sarah Chen."
      }
    ];
    this.auditLogs = [
      {
        id: "audit-001",
        timestamp: "2026-03-28T14:45:00Z",
        userId: "system",
        userName: "Self-Adaptive Retraining Engine",
        userRole: "super_admin",
        action: "RETRAINING_JOB_TRIGGERED",
        entityType: "retraining",
        entityId: "retrain-job-8841",
        details: "Automated retraining job triggered due to drift in monthlyCharges and contract.",
        ipAddress: "127.0.0.1"
      },
      {
        id: "audit-002",
        timestamp: "2026-03-28T14:30:00Z",
        userId: "system",
        userName: "Evidently AI Monitor",
        userRole: "ml_engineer",
        action: "DRIFT_REPORT_GENERATED",
        entityType: "monitoring",
        entityId: "drift-rep-2026-03-28-01",
        details: "Drift report generated. 2 of 7 monitored features breached statistical thresholds.",
        ipAddress: "127.0.0.1"
      },
      {
        id: "audit-003",
        timestamp: "2026-03-27T10:15:00Z",
        userId: "usr-end-03",
        userName: "Elena Rostova",
        userRole: "end_user",
        action: "PREDICTION_REQUESTED",
        entityType: "prediction",
        entityId: "pred-7821",
        details: "Generated churn prediction for customer CUST-7821 (Risk: Critical, Prob: 84.2%).",
        ipAddress: "192.168.1.45"
      },
      {
        id: "audit-004",
        timestamp: "2026-01-12T14:00:00Z",
        userId: "usr-admin-01",
        userName: "Sarah Chen",
        userRole: "super_admin",
        action: "MODEL_PROMOTED_TO_PRODUCTION",
        entityType: "model",
        entityId: "mod-v1-prod",
        details: "Promoted Model v1.0.0 (Random Forest) to Production status.",
        ipAddress: "192.168.1.10"
      }
    ];
    this.copilotMessages = [
      {
        id: "copilot-msg-01",
        role: "assistant",
        content: `\u{1F44B} Hello! I am the **AdaptFlow AI MLOps Copilot**, powered by Google Gemini.

I have direct access to your live **Evidently AI drift reports**, **MLflow experiment tracking**, **Model Registry**, and **Retraining pipeline**.

Current System Highlights:
\u2022 **Production Model:** \`v1.0.0\` (Random Forest, Accuracy: 81.4%, F1: 0.801)
\u2022 **Data Drift Alert:** Drift detected on \`monthlyCharges\` ($94+ fiber segment shift)
\u2022 **Candidate Model:** \`v1.1.0\` (XGBoost) trained on 142 verified feedback samples with +3.3% accuracy lift, currently **Awaiting Approval** in the Deployment Center.

How can I assist your MLOps workflow today?`,
        timestamp: "2026-03-28T14:50:00Z",
        suggestedActions: [
          "Explain the latest data drift report",
          "Compare Model V1 and Model V2",
          "Should I deploy the candidate model?",
          "What are the main risks of deploying candidate V2?"
        ]
      }
    ];
  }
  // Helper Methods
  getCurrentProductionModel() {
    return this.models.find((m) => m.status === "production");
  }
  getCandidateModel() {
    return this.models.find((m) => m.status === "candidate");
  }
  logAudit(action, entityType, details, user, entityId) {
    const entry = {
      id: `audit-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: "127.0.0.1"
    };
    this.auditLogs.unshift(entry);

    const sbUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const sbKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (sbUrl && sbKey) {
      fetch(`${sbUrl}/rest/v1/audit_logs`, {
        method: "POST",
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          action,
          category: entityType || "system",
          details,
          user_email: user.email || user.name || "admin@adaptflow.ai",
          user_role: user.role || "admin"
        })
      }).catch(() => {});
    }
  }
}
export const db = new Database();
