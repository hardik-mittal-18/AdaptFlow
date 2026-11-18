# AdaptFlow: Self-Adaptive Enterprise MLOps Platform

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MLflow](https://img.shields.io/badge/MLflow-2.14-0194E2?logo=mlflow&logoColor=white)](https://mlflow.org/)
[![DVC](https://img.shields.io/badge/DVC-3.50-945DD6?logo=dvc&logoColor=white)](https://dvc.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20RLS-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**AdaptFlow** is a production-grade, continuous-learning MLOps system that prevents real-world model decay. It continuously serves high-throughput customer churn predictions, ingests verified ground-truth feedback, monitors statistical feature & concept drift (Kolmogorov-Smirnov & Population Stability Index), and executes automated retraining with versioned DVC datasets and zero-downtime Blue-Green rollouts.

---

## 🌐 Live Deployments

- **Frontend (Vercel)**: [https://adaptflow.vercel.app](https://adaptflow.vercel.app) *(or live Vercel URL)*
- **Backend Gateway (Railway)**: [https://adaptflow-production.up.railway.app](https://adaptflow-production.up.railway.app)
- **Health Check**: `GET /health` on the Railway backend URL
- **GitHub Repository**: [https://github.com/hardik-mittal-18/AdaptFlow.git](https://github.com/hardik-mittal-18/AdaptFlow.git)

---

## 🚀 Key Features

1. **Closed-Loop Feedback Architecture**:
   - Seamlessly ingests customer outcomes, correlates them with original inference records in PostgreSQL, and queues verified ground truth.
2. **Statistical Drift Detection Engine**:
   - Automated two-sample Kolmogorov-Smirnov (KS) tests for continuous features and Population Stability Index (PSI) / Chi-Square tests for categorical distributions.
3. **Experiment Tracking & Model Registry**:
   - Comprehensive MLflow tracking (Logistic Regression vs. Optuna-tuned XGBoost). Model version tagging with aliases (`champion`, `challenger`, `previous`).
4. **Data Version Control (DVC)**:
   - Automated pipeline stages (`ingest` ➔ `validate` ➔ `preprocess` ➔ `train` ➔ `evaluate` ➔ `register`) with Pandera schema enforcement.
5. **Deployment Gates & Automated Rollback**:
   - Shadow-mode scoring, canary routing (10% ➔ 50%), and 1-click blue-green rollback upon SLA violation.
6. **Strict 4-Role Isolation & RLS Security**:
   - Enforced by Supabase Row-Level Security across **Consumer**, **Vendor**, **Staff**, and **Admin** tiers with dedicated layouts and no cross-role bleeding.
7. **Modern Interactive UI & Dark/Light Theme**:
   - 10 tactile switch toggles for boolean features, dual range sliders with live badges, segmented contract cards, and a global Sun/Moon theme switcher.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Recharts, Three.js / R3F |
| **Backend Gateway** | Node.js, Express, Supabase JS Client, CORS proxy |
| **ML Serving** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2, SHAP TreeExplainer |
| **ML Pipeline** | Scikit-learn, XGBoost, Optuna, Pandera, DVC, MLflow |
| **Database & Auth** | Supabase PostgreSQL, Row Level Security (RLS), OAuth2 |
| **Observability** | Prometheus, Alertmanager, Grafana Dashboards |
| **CI/CD & Cloud** | GitHub Actions, Docker Multi-stage, Vercel (Frontend), Railway (Backend) |

---

## 📋 Environment Variables

Create a `.env` file in the root directory modeled after `.env.example`:

```env
# Application Ports & URLs
PORT=3000
NODE_ENV=production
VITE_APP_URL=http://localhost:3000
FRONTEND_URL=https://adaptflow.vercel.app
VITE_API_URL=https://your-backend.up.railway.app

# Supabase Credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Administrative Security
ADMIN_INVITE_CODE=ADAPTFLOW_SECRET_ADMIN_2026

# Python ML Microservice
ML_SERVICE_URL=http://127.0.0.1:8000
ML_SERVICE_PORT=8000

# Optional AI Copilot
GEMINI_API_KEY=your-gemini-api-key
```

---

## 🏃 Local Setup & Running

### 1. Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (for ML pipeline & FastAPI serving)
- Git

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/hardik-mittal-18/AdaptFlow.git
cd AdaptFlow

# Install JavaScript dependencies
npm install

# Install Python dependencies (optional for local ML development)
cd ml-service
pip install -r requirements.txt
cd ..
```

### 3. Running Locally
```bash
# Start the full application (Frontend + Express Gateway)
npm run dev

# Or build and run for production
npm run build
npm start
```

Visit `http://localhost:3000` to interact with the platform.

---

## 🛡️ Role Matrix & Navigation Isolation

- **Consumer** (`/dashboard`, `/predictions`): Submit churn feature parameters, inspect risk attributions, and provide verified ground truth.
- **Vendor** (`/vendor`): Upload batch datasets and inspect ingestion schema validation reports.
- **Staff** (`/staff`): Monitor statistical drift charts, trigger retraining jobs, and inspect DVC pipeline logs.
- **Admin** (`/admin`, `/admin/register`): Manage system thresholds, promote challenger models, approve Blue-Green rollouts, and view tamper-proof audit trails.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for details.
