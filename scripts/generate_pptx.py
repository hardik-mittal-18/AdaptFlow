import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Palette
    BG_DARK = RGBColor(11, 15, 25)          # #0B0F19
    CARD_BG = RGBColor(20, 28, 44)          # #141C2C
    CARD_BORDER = RGBColor(38, 50, 75)      # #26324B
    ACCENT_RED = RGBColor(185, 28, 28)       # #B91C1C
    ACCENT_ROSE = RGBColor(225, 29, 72)      # #E11D48
    ACCENT_BLUE = RGBColor(59, 130, 246)     # #3B82F6
    ACCENT_EMERALD = RGBColor(16, 185, 129)  # #10B981
    ACCENT_PURPLE = RGBColor(168, 85, 247)   # #A855F7
    ACCENT_AMBER = RGBColor(245, 158, 11)    # #F59E0B
    TEXT_WHITE = RGBColor(255, 255, 255)
    TEXT_MUTED = RGBColor(156, 163, 175)
    TEXT_SUBTLE = RGBColor(100, 116, 139)

    TOTAL_SLIDES = 18

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, title, category="MACHINE LEARNING OPERATIONS (24SDAD03) • PROJECT REVIEW #2"):
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.9))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p1 = tf.paragraphs[0]
        p1.text = category.upper()
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = ACCENT_ROSE
        
        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.size = Pt(22)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(3)

        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = CARD_BORDER
        line.line.fill.background()

    def add_footer(slide, current_slide):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.733), Inches(0.4))
        tf = footer_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"AdaptFlow: Self-Adaptive AI Systems with Closed Feedback Loop  |  Slide {current_slide} of {TOTAL_SLIDES}"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_SUBTLE

    def add_card(slide, left, top, width, height, title="", border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
        
        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), Inches(0.4))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.size = Pt(13)
            p.font.bold = True
            p.font.color.rgb = TEXT_WHITE
        return card

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)
    
    tag_box = s1.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.3), Inches(0.5))
    tf1 = tag_box.text_frame
    p_tag = tf1.paragraphs[0]
    p_tag.text = "MACHINE LEARNING OPERATIONS  •  COURSE CODE: 24SDAD03  •  PROJECT REVIEW #2"
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = ACCENT_ROSE

    title_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(1.8))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_t = tf_title.paragraphs[0]
    p_t.text = "AdaptFlow: Self-Adaptive AI System with Closed Feedback Loop"
    p_t.font.size = Pt(32)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE

    p_sub = tf_title.add_paragraph()
    p_sub.text = "Continuous Learning, MLflow Registry, Evidently AI Drift Monitoring, 4-Role RLS & Cloud Deployment"
    p_sub.font.size = Pt(15)
    p_sub.font.color.rgb = ACCENT_BLUE
    p_sub.space_before = Pt(8)

    meta_cards = [
        ("STUDENT NAMES & IDS", "Hardik Mittal (2400080002)\nDeva Sree Kumar Banka (2400080076)"),
        ("CLASS & DEPARTMENT", "Section S-1 / Batch-1\nDept. of AI & Data Science"),
        ("FACULTY GUIDE", "Venkata Daya Sagar Ketaraju\nCourse: MLOps (24SDAD03)"),
        ("LIVE VERIFIED PLATFORM", "Frontend: adapt-flow-brown.vercel.app\nBackend: Railway & Supabase")
    ]
    for i, (head, body) in enumerate(meta_cards):
        cx = Inches(1.0) + i * Inches(2.87)
        cy = Inches(3.8)
        add_card(s1, cx, cy, Inches(2.7), Inches(1.8))
        tb = s1.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.2), Inches(2.3), Inches(1.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = head
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = ACCENT_ROSE
        
        p2 = tf.add_paragraph()
        p2.text = body
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(8)

    add_footer(s1, 1)

    # ==========================================
    # SLIDE 2: Project Overview & The Core Problem
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "Project Overview: Problem & Closed-Loop Solution")

    add_card(s2, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.0), "The Problem: Production Model Decay", ACCENT_ROSE)
    tb_prob = s2.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_p = tb_prob.text_frame
    tf_p.word_wrap = True

    pts_p = [
        ("Static Deployment Trap:", "Traditional ML models are trained once on historical data snapshots. Once deployed, their accuracy degrades silently over time as real-world market tariffs and customer behavior change."),
        ("Concept & Feature Drift:", "Shifts in consumer behavior (e.g. competitors offering cheaper fiber plans) invalidate original decision boundaries without throwing runtime software exceptions."),
        ("Cost of Manual Intervention:", "Manual data collection, ad-hoc offline retraining, and manual script deployments cause significant revenue loss, high engineer overhead, and downtime.")
    ]
    for h, b in pts_p:
        p_h = tf_p.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(11)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_ROSE
        p_h.space_before = Pt(8)
        p_b = tf_p.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_card(s2, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.0), "The Solution: AdaptFlow Autonomous MLOps", ACCENT_EMERALD)
    tb_sol = s2.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_s = tb_sol.text_frame
    tf_s.word_wrap = True

    pts_s = [
        ("Sub-Millisecond Inference:", "FastAPI serves real-time churn predictions with local SHAP factor explainability in < 3.8ms P95 latency."),
        ("Closed-Loop Feedback:", "Collects verified ground-truth customer outcomes (churned or retained) and links them back to original inference request IDs without label contamination."),
        ("Statistical Drift Defense:", "Continuous Kolmogorov-Smirnov (KS) tests and Population Stability Index (PSI) alert on feature shifts automatically."),
        ("Safe Retraining & Rollback:", "DVC versioning + Optuna 5-fold CV retraining + 4-stage Canary & Blue-Green deployment with instantaneous 1-click rollback.")
    ]
    for h, b in pts_s:
        p_h = tf_s.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(11)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_EMERALD
        p_h.space_before = Pt(8)
        p_b = tf_s.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_footer(s2, 2)

    # ==========================================
    # SLIDE 3: Review 1 Commitments vs Review 2 Achievements
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Review #1 Commitments vs. Review #2 Deliverables")

    table_shape = s3.shapes.add_table(7, 3, Inches(0.8), Inches(1.6), Inches(11.733), Inches(4.9))
    tbl = table_shape.table
    tbl.columns[0].width = Inches(3.2)
    tbl.columns[1].width = Inches(2.8)
    tbl.columns[2].width = Inches(5.733)

    rows_data = [
        ("Review #1 Target Milestone", "Implementation Status", "Verification & Artifact Evidence"),
        ("FastAPI Model Serving", "100% Completed & Live", "Sub-1ms inference (0.09ms), Pydantic Telco schemas, TreeExplainer SHAP"),
        ("Continuous Feedback Loop", "100% Completed & Live", "Unique request_id correlation, verified outcome ingestion, DVC versioning"),
        ("Statistical Drift Engine", "100% Completed & Live", "Evidently AI: 2-Sample KS Test (p < 0.05) & Population Stability Index (PSI > 0.20)"),
        ("Automated Retraining & Registry", "100% Completed & Live", "DVC repro pipeline, Pandera validation gates, Optuna 5-fold CV, MLflow aliases"),
        ("Deployment & Rollback Gates", "100% Completed & Live", "Shadow Mode (0%) -> 10% Canary -> 50% Canary -> Blue-Green promotion (1-click rollback)"),
        ("Multi-Role RLS & Observability", "100% Completed & Live", "4-Role isolation (Consumer, Vendor, Staff, Admin) + Prometheus & 3 Grafana dashboards")
    ]
    for r_idx, r_val in enumerate(rows_data):
        for c_idx, text in enumerate(r_val):
            cell = tbl.cell(r_idx, c_idx)
            cell.text = text
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = cell.text_frame.paragraphs[0]
            if r_idx == 0:
                p.font.bold = True
                p.font.size = Pt(11)
                p.font.color.rgb = ACCENT_ROSE
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(28, 18, 30)
            else:
                p.font.size = Pt(10)
                cell.fill.solid()
                cell.fill.fore_color.rgb = CARD_BG
                if c_idx == 1:
                    p.font.bold = True
                    p.font.color.rgb = ACCENT_EMERALD
                elif c_idx == 0:
                    p.font.bold = True
                    p.font.color.rgb = TEXT_WHITE
                else:
                    p.font.color.rgb = TEXT_MUTED

    add_footer(s3, 3)

    # ==========================================
    # SLIDE 4: End-to-End System Architecture
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "System Architecture: Decoupled Multi-Tier Topology")

    arch_tiers = [
        ("Tier 1: Presentation (Vercel)", "React 19 & Vite 8 SPA", [
            "Role-based view isolation (Consumer, Vendor, Staff, Admin)",
            "10 tactile switch toggles for boolean customer features",
            "Dual interactive range sliders with live numeric badges",
            "Real-time prediction streaming & ground truth ingestion"
        ], ACCENT_BLUE),
        ("Tier 2: API Gateway (Railway)", "Node.js / Express Gateway", [
            "Supabase JWT validation and claim verification",
            "Role permission enforcement & route guarding",
            "CORS policy enforcement for allowed web origins",
            "High-concurrency reverse proxy to Python inference service"
        ], ACCENT_PURPLE),
        ("Tier 3: Serving (FastAPI)", "Python 3.11+ Uvicorn Engine", [
            "Sub-millisecond inference (0.09ms XGBoost scoring)",
            "Pydantic v2 schemas for Telco customer parameters",
            "SHAP TreeExplainer local risk factor attributions",
            "In-memory model caching with zero-downtime hot reload"
        ], ACCENT_EMERALD),
        ("Tier 4: Pipeline (MLflow/DVC)", "Autonomous Learning Engine", [
            "DVC data lineage tracking (data/feedback.dvc)",
            "Pandera schema validation gatekeeper",
            "Optuna 5-fold CV hyperparameter search",
            "MLflow Model Registry aliases (champion, challenger, previous)"
        ], ACCENT_ROSE)
    ]
    for i, (tier_title, tech, points, color) in enumerate(arch_tiers):
        cx = Inches(0.8) + i * Inches(2.98)
        cy = Inches(1.6)
        cw = Inches(2.8)
        ch = Inches(5.0)
        add_card(s4, cx, cy, cw, ch, border_color=color)

        tb = s4.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.2), cw - Inches(0.4), ch - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = tier_title.upper()
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = tech
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(4)

        for pt in points:
            p_pt = tf.add_paragraph()
            p_pt.text = "• " + pt
            p_pt.font.size = Pt(10)
            p_pt.font.color.rgb = TEXT_MUTED
            p_pt.space_before = Pt(8)

    add_footer(s4, 4)

    # ==========================================
    # SLIDE 5: MLflow Tracking & Model Registry in Detail
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "MLflow Experiment Tracking & Model Registry in Detail")

    # Left: Experiment Tracking Details
    add_card(s5, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.0), "Experiment Tracking & Artifacts", ACCENT_BLUE)
    tb_mle = s5.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_mle = tb_mle.text_frame
    tf_mle.word_wrap = True

    mle_pts = [
        ("Backend Storage Architecture:", "Backed by SQLite database (mlflow.db) and persistent artifacts store in mlruns/ directory."),
        ("Tracked Hyperparameters:", "max_depth, learning_rate, n_estimators, subsample, colsample_bytree, reg_alpha, reg_lambda."),
        ("Logged Performance Metrics:", "Accuracy, ROC-AUC, PR-AUC, Precision, Recall, F1-Score, and P95 latency recorded across every cross-validation fold."),
        ("Saved Artifacts:", "Serialized model (.bin), feature importance plot (.png), confusion matrix (.png), and SHAP summary plot.")
    ]
    for h, b in mle_pts:
        p_h = tf_mle.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_BLUE
        p_h.space_before = Pt(6)
        p_b = tf_mle.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    # Right: Model Registry & Aliases
    add_card(s5, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.0), "Model Registry & Lifecycle Aliases", ACCENT_PURPLE)
    tb_reg = s5.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_reg = tb_reg.text_frame
    tf_reg.word_wrap = True

    aliases_info = [
        ("alias: champion", "The active production model serving 100% of live customer inference traffic. Cached in memory and hot-reloaded automatically."),
        ("alias: challenger", "A newly retrained candidate model under Canary evaluation (10% -> 50% traffic slice) to verify real-world lift."),
        ("alias: previous", "The previous known good production model version. Used by the 1-click instant rollback engine in case of any degradation."),
        ("How to Launch MLflow UI:", "Run:  mlflow ui --backend-store-uri sqlite:///mlflow.db --port 5000\nOpens interactive web console at http://localhost:5000 to inspect experiments.")
    ]
    for h, b in aliases_info:
        p_h = tf_reg.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_PURPLE
        p_h.space_before = Pt(6)
        p_b = tf_reg.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_footer(s5, 5)

    # ==========================================
    # SLIDE 6: Continuous Feedback & DVC Versioning
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Continuous Feedback Loop & DVC Dataset Versioning")

    fb_cards = [
        ("1. Inference Logging", "Real-Time Tracking", "Every prediction is serialized with request_id, input vector, output probability, and model version into PostgreSQL.", ACCENT_BLUE),
        ("2. Ground Truth Arrival", "Delayed Feedback", "Actual churn outcomes (Day 30/60) arrive via POST /feedback and correlate directly with original prediction records.", ACCENT_PURPLE),
        ("3. Pandera Gatekeeper", "Schema Enforcement", "Validates types, checks ranges (tenure 0-100, monthly charges 10-200), and rejects corrupted vendor rows.", ACCENT_ROSE),
        ("4. DVC Dataset Merge", "Versioned Storage", "Appends verified feedback to data/feedback.dvc, hashes the updated dataset, and tracks lineage in Git without storing raw CSVs.", ACCENT_EMERALD)
    ]
    for i, (f_num, f_title, f_desc, color) in enumerate(fb_cards):
        cx = Inches(0.8) + i * Inches(2.98)
        cy = Inches(1.6)
        cw = Inches(2.8)
        ch = Inches(3.6)
        add_card(s6, cx, cy, cw, ch, border_color=color)

        tb = s6.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.2), cw - Inches(0.4), ch - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = f_num.upper()
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = f_title
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(4)

        p3 = tf.add_paragraph()
        p3.text = f_desc
        p3.font.size = Pt(9.5)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(8)

    add_card(s6, Inches(0.8), Inches(5.4), Inches(11.733), Inches(1.3), border_color=CARD_BORDER)
    tb_term = s6.shapes.add_textbox(Inches(1.0), Inches(5.5), Inches(11.3), Inches(1.1))
    tf_term = tb_term.text_frame
    tf_term.word_wrap = True
    p_t1 = tf_term.paragraphs[0]
    p_t1.text = "AUTOMATED DVC PIPELINE REPRODUCTION (dvc repro)"
    p_t1.font.size = Pt(9.5)
    p_t1.font.bold = True
    p_t1.font.color.rgb = ACCENT_EMERALD

    p_t2 = tf_term.add_paragraph()
    p_t2.text = "> Stage 'ingest' up to date  •  Stage 'validate' PASSED [Pandera schema: 100%]  •  Stage 'preprocess' completed\n> Stage 'train' [Optuna 5-fold CV: Trial 15/15 best_auc=0.852]  •  Stage 'register' [MLflow Registered challenger model]"
    p_t2.font.size = Pt(9)
    p_t2.font.color.rgb = TEXT_MUTED
    p_t2.space_before = Pt(3)

    add_footer(s6, 6)

    # ==========================================
    # SLIDE 7: Statistical Drift Engine (Evidently AI)
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Statistical Drift Detection Engine (Evidently AI)")

    add_card(s7, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.0), "2-Sample Kolmogorov-Smirnov (KS) Test", ACCENT_BLUE)
    tb_ks = s7.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_ks = tb_ks.text_frame
    tf_ks.word_wrap = True

    p_k1 = tf_ks.paragraphs[0]
    p_k1.text = "CONTINUOUS FEATURE MONITORING"
    p_k1.font.size = Pt(10)
    p_k1.font.bold = True
    p_k1.font.color.rgb = ACCENT_BLUE

    p_k2 = tf_ks.add_paragraph()
    p_k2.text = "• Applied to: tenure, monthlyCharges, totalCharges\n• Formula: D = sup |F_prod(x) - F_base(x)|\n• Null Hypothesis H₀: Production distribution = Baseline\n• Significance Level: α = 0.05"
    p_k2.font.size = Pt(10)
    p_k2.font.color.rgb = TEXT_MUTED
    p_k2.space_before = Pt(6)

    p_k3 = tf_ks.add_paragraph()
    p_k3.text = "DRIFT SIMULATION TEST EVIDENCE"
    p_k3.font.size = Pt(10)
    p_k3.font.bold = True
    p_k3.font.color.rgb = ACCENT_ROSE
    p_k3.space_before = Pt(12)

    p_k4 = tf_ks.add_paragraph()
    p_k4.text = "• Injected shift: tenure shifted from μ=32 to μ=4 months\n• KS Statistic: 0.741  |  p-value: 0.00001 (Threshold < 0.05)\n• Outcome: H₀ rejected -> Automated drift alert triggered"
    p_k4.font.size = Pt(10)
    p_k4.font.color.rgb = TEXT_MUTED
    p_k4.space_before = Pt(6)

    add_card(s7, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.0), "Population Stability Index (PSI)", ACCENT_PURPLE)
    tb_psi = s7.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_psi = tb_psi.text_frame
    tf_psi.word_wrap = True

    p_p1 = tf_psi.paragraphs[0]
    p_p1.text = "CATEGORICAL DISTRIBUTION SHIFT"
    p_p1.font.size = Pt(10)
    p_p1.font.bold = True
    p_p1.font.color.rgb = ACCENT_PURPLE

    p_p2 = tf_psi.add_paragraph()
    p_p2.text = "• Applied to: contract, internetService, paymentMethod\n• Formula: PSI = ∑ (Actual% - Expected%) × ln(Actual% / Expected%)\n• PSI < 0.10: Stable distribution (No action)\n• 0.10 ≤ PSI ≤ 0.25: Moderate shift (Log warning)\n• PSI > 0.25: Critical drift (Triggers retraining pipeline)"
    p_p2.font.size = Pt(10)
    p_p2.font.color.rgb = TEXT_MUTED
    p_p2.space_before = Pt(6)

    p_p3 = tf_psi.add_paragraph()
    p_p3.text = "EVIDENTLY AI REPORT ARTIFACTS"
    p_p3.font.size = Pt(10)
    p_p3.font.bold = True
    p_p3.font.color.rgb = ACCENT_EMERALD
    p_p3.space_before = Pt(12)

    p_p4 = tf_psi.add_paragraph()
    p_p4.text = "• Automated HTML report generated per audit cycle\n• Summary JSON exposed at GET /drift/status\n• Real-time webhook dispatches to Prometheus & Slack"
    p_p4.font.size = Pt(10)
    p_p4.font.color.rgb = TEXT_MUTED
    p_p4.space_before = Pt(6)

    add_footer(s7, 7)

    # ==========================================
    # SLIDE 8: Deployment Gates & 1-Click Rollback
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Release Gates & Zero-Downtime Blue-Green Deployment")

    gates = [
        ("STAGE 1: SHADOW MODE", "0% Customer Traffic", "Challenger scores all live requests in parallel. Outputs discarded; latency & throughput benchmarked against SLA.", ACCENT_BLUE),
        ("STAGE 2: CANARY 10%", "10% Traffic Routed", "Real customers routed to Challenger. Verifies zero HTTP 5xx errors and sub-5ms P95 latency bounds.", ACCENT_PURPLE),
        ("STAGE 3: CANARY 50%", "50% Traffic Split", "Balanced split assessing statistical performance lift and confidence intervals over 500+ inferences.", ACCENT_ROSE),
        ("STAGE 4: BLUE-GREEN", "100% Production Promotion", "Challenger promoted to 'champion'. Old model stored as 'previous' for instantaneous 1-click rollback.", ACCENT_EMERALD)
    ]
    for i, (g_stage, g_sub, g_desc, color) in enumerate(gates):
        cx = Inches(0.8) + i * Inches(2.98)
        cy = Inches(1.6)
        cw = Inches(2.8)
        ch = Inches(3.6)
        add_card(s8, cx, cy, cw, ch, border_color=color)

        tb = s8.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.2), cw - Inches(0.4), ch - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = g_stage
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = g_sub
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(4)

        p3 = tf.add_paragraph()
        p3.text = g_desc
        p3.font.size = Pt(9.5)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(8)

    add_card(s8, Inches(0.8), Inches(5.4), Inches(11.733), Inches(1.3), border_color=ACCENT_RED)
    tb_rb = s8.shapes.add_textbox(Inches(1.0), Inches(5.5), Inches(11.3), Inches(1.1))
    tf_rb = tb_rb.text_frame
    tf_rb.word_wrap = True
    p_r1 = tf_rb.paragraphs[0]
    p_r1.text = "OPERATIONAL DRILL: 1-CLICK INSTANT ROLLBACK (POST /deployment/rollback)"
    p_r1.font.size = Pt(9.5)
    p_r1.font.bold = True
    p_r1.font.color.rgb = ACCENT_RED

    p_r2 = tf_rb.add_paragraph()
    p_r2.text = "> Simulates sudden production degradation. Switches MLflow alias from 'champion' back to 'previous'.\n> Hot-reloads memory cache in 0.0 seconds with ZERO downtime and ZERO server restart."
    p_r2.font.size = Pt(9)
    p_r2.font.color.rgb = TEXT_MUTED
    p_r2.space_before = Pt(3)

    add_footer(s8, 8)

    # ==========================================
    # SLIDE 9: Role 1: Consumer Portal Walkthrough
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Role 1: Consumer Portal In-Depth Walkthrough")

    add_card(s9, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.0), "Inference & Feature Input Center", ACCENT_BLUE)
    tb_c1 = s9.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True

    c1_pts = [
        ("URL Route & Persona:", "Route: /predictions & /dashboard. Represents customer relationship agents or direct end-users."),
        ("10 Interactive Switch Toggles:", "One-click toggle switches for Tech Support, Online Security, Online Backup, Device Protection, Streaming TV/Movies, Senior Citizen, Partner, Dependents, and Paperless Billing."),
        ("Dual Real-Time Sliders:", "Tenure (0-72 months) and Monthly Charges ($18-$125) with live floating value badges."),
        ("One-Click Customer Presets:", "Pre-loads typical customer profiles (High Risk Churner, Loyal 2-Yr Family, Fiber Streamer, Budget User) for instant evaluation.")
    ]
    for h, b in c1_pts:
        p_h = tf_c1.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_BLUE
        p_h.space_before = Pt(6)
        p_b = tf_c1.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_card(s9, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.0), "SHAP Attributions & Feedback Ingestion", ACCENT_EMERALD)
    tb_c2 = s9.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True

    c2_pts = [
        ("Real-Time Calibrated Scoring:", "Returns calibrated Churn Probability (0-100%) and categorizes into Low, Moderate, High, or Critical risk tiers in < 3.8ms."),
        ("Local SHAP Attribution Factors:", "Renders top contributing factors (e.g. Month-to-Month Contract adds +18% risk; Tech Support subtracts -12% risk)."),
        ("Live Prediction Stream Table:", "Displays recently logged inferences with unique customer IDs, computed risk, and verified ground-truth status."),
        ("Submitting Verified Ground Truth:", "Click 'Submit Actual' to record whether the customer ultimately stayed or churned, feeding the continuous learning pipeline.")
    ]
    for h, b in c2_pts:
        p_h = tf_c2.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_EMERALD
        p_h.space_before = Pt(6)
        p_b = tf_c2.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_footer(s9, 9)

    # ==========================================
    # SLIDE 10: Role 2: Vendor Portal Walkthrough
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Role 2: Vendor Portal In-Depth Walkthrough")

    add_card(s10, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.0), "Batch Dataset Ingestion Portal", ACCENT_PURPLE)
    tb_v1 = s10.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_v1 = tb_v1.text_frame
    tf_v1.word_wrap = True

    v1_pts = [
        ("URL Route & Persona:", "Route: /vendor. Represents third-party telecom operators, data suppliers, and corporate partner data feeds."),
        ("Bulk Drag-and-Drop Ingestion:", "Supports direct upload of raw customer churn CSV files containing thousands of new records."),
        ("Automated Pre-Check Parsing:", "Instantly counts batch rows, column headers, encoding format, and missing values upon file drop."),
        ("Isolated Ingestion Staging:", "Data files are staged into secure Supabase storage buckets and cannot tamper with active production datasets.")
    ]
    for h, b in v1_pts:
        p_h = tf_v1.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_PURPLE
        p_h.space_before = Pt(6)
        p_b = tf_v1.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_card(s10, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.0), "Pandera Schema Gatekeeper & Reports", ACCENT_ROSE)
    tb_v2 = s10.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_v2 = tb_v2.text_frame
    tf_v2.word_wrap = True

    v2_pts = [
        ("Strict Schema Enforcement:", "Pandera verifies column types, null limits, and valid value sets (e.g. Contract must be 'Month-to-month', 'One year', 'Two year')."),
        ("Value Range Bounds Checking:", "Guarantees tenure is within [0, 100] and monthlyCharges within [$10.0, $200.0] to prevent data corruption."),
        ("Immediate Rejection Diagnostics:", "If corrupt rows exist, ingestion is rejected immediately with a line-by-line schema violation error report."),
        ("Role Boundaries (Zero Trust):", "Vendors cannot access prediction APIs, internal system configurations, telemetry, or user audit logs.")
    ]
    for h, b in v2_pts:
        p_h = tf_v2.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_ROSE
        p_h.space_before = Pt(6)
        p_b = tf_v2.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_footer(s10, 10)

    # ==========================================
    # SLIDE 11: Role 3: Staff Portal Walkthrough
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "Role 3: Staff Portal In-Depth Walkthrough")

    add_card(s11, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.0), "Real-Time Drift Monitoring Center", ACCENT_AMBER)
    tb_st1 = s11.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_st1 = tb_st1.text_frame
    tf_st1.word_wrap = True

    st1_pts = [
        ("URL Route & Persona:", "Route: /staff. Represents MLOps Engineers, Data Scientists, and Production Operations Teams."),
        ("Evidently AI Visual Dashboard:", "Displays live 2-sample Kolmogorov-Smirnov p-values and Population Stability Index (PSI) meters for every customer feature."),
        ("Interactive HTML Drift Reports:", "Renders comprehensive Evidently AI distribution comparison curves directly in the web UI."),
        ("Synthetic Drift Simulation Test:", "Staff can inject controlled distribution shifts (e.g. shifting tenure from 32mo to 4mo) to verify automated alerting.")
    ]
    for h, b in st1_pts:
        p_h = tf_st1.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_AMBER
        p_h.space_before = Pt(6)
        p_b = tf_st1.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_card(s11, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.0), "Retraining Pipeline Execution & Audit", ACCENT_BLUE)
    tb_st2 = s11.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_st2 = tb_st2.text_frame
    tf_st2.word_wrap = True

    st2_pts = [
        ("1-Click Automated Retraining Trigger:", "Staff triggers the DVC retraining pipeline whenever drift thresholds are breached or feedback volume reaches target."),
        ("Optuna Hyperparameter Tracking:", "Live logs show 5-fold cross-validation trials, best parameter selection, and validation accuracy improvement."),
        ("Candidate Model Registration:", "Automatically registers newly trained models in MLflow under the 'challenger' alias."),
        ("Role Restrictions:", "Staff can trigger training and monitor drift, but CANNOT promote models to live production (preventing unapproved releases).")
    ]
    for h, b in st2_pts:
        p_h = tf_st2.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_BLUE
        p_h.space_before = Pt(6)
        p_b = tf_st2.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_footer(s11, 11)

    # ==========================================
    # SLIDE 12: Role 4: Admin Portal Walkthrough
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, "Role 4: Admin Portal In-Depth Walkthrough")

    add_card(s12, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.0), "Deployment Center & Blue-Green Gates", ACCENT_EMERALD)
    tb_ad1 = s12.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_ad1 = tb_ad1.text_frame
    tf_ad1.word_wrap = True

    ad1_pts = [
        ("URL Route & Persona:", "Route: /admin & /admin/deployments. Represents Chief AI Officers, System Administrators, and Governance Leads."),
        ("Canary Traffic Slider:", "Admins configure exact traffic percentages routed to Challenger models (10%, 25%, 50%)."),
        ("Blue-Green Cutover Approval:", "Reviews candidate lift (e.g. +6.3% accuracy, +0.040 ROC-AUC) and promotes Challenger to 'champion' with zero downtime."),
        ("1-Click Rollback Action:", "Reverts live production traffic back to 'previous' model instantaneously in 0.0 seconds upon latency or SLA anomaly.")
    ]
    for h, b in ad1_pts:
        p_h = tf_ad1.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_EMERALD
        p_h.space_before = Pt(6)
        p_b = tf_ad1.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_card(s12, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.0), "Platform Governance & Audit Vault", ACCENT_ROSE)
    tb_ad2 = s12.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_ad2 = tb_ad2.text_frame
    tf_ad2.word_wrap = True

    ad2_pts = [
        ("Threshold Configuration:", "Admins tune KS significance level (alpha=0.05), PSI critical threshold (0.20), and minimum feedback sample count."),
        ("User & Role Management:", "Assigns and verifies user accounts across Consumer, Vendor, Staff, and Admin roles directly in Supabase profiles."),
        ("Tamper-Proof Audit Vault:", "Immutable log table recording every action (MODEL_PROMOTED, THRESHOLD_UPDATED, USER_REGISTERED) with actor email and timestamp."),
        ("Super Admin Self-Registration:", "Hidden portal at /admin/register protected by server-side invite code (ADAPTFLOW_SECRET_ADMIN_2026).")
    ]
    for h, b in ad2_pts:
        p_h = tf_ad2.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_ROSE
        p_h.space_before = Pt(6)
        p_b = tf_ad2.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_footer(s12, 12)

    # ==========================================
    # SLIDE 13: How to Execute the Website by All Roles
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13)
    add_header(s13, "How to Execute the Website: Multi-Role Demonstration")

    exec_roles = [
        ("1. Consumer Execution", "palakmittal@gmail.com", [
            "1. Open https://adapt-flow-brown.vercel.app/login",
            "2. Sign in or click 'Demo as Consumer' on home page",
            "3. Navigate to /predictions",
            "4. Toggle features (Tech Support, Fiber optic)",
            "5. Click 'Generate Churn Prediction' (< 3.8ms)",
            "6. Inspect SHAP risk drivers & submit feedback"
        ], ACCENT_BLUE),
        ("2. Vendor Execution", "vendor@adaptflow.ai", [
            "1. Sign in with vendor credentials",
            "2. Browser redirects strictly to /vendor",
            "3. Drop telco_churn.csv into upload dropzone",
            "4. Pandera runs schema checks in real time",
            "5. Green checkmarks confirm schema pass",
            "6. Data staged for next DVC retraining cycle"
        ], ACCENT_PURPLE),
        ("3. Staff Execution", "staff@adaptflow.ai", [
            "1. Sign in with staff credentials",
            "2. Browser redirects strictly to /staff",
            "3. Inspect KS-test (tenure) & PSI (contract)",
            "4. Click 'Simulate Drift' to verify alert threshold",
            "5. Click 'Trigger Retraining Job'",
            "6. Review Optuna 5-fold CV & challenger metrics"
        ], ACCENT_AMBER),
        ("4. Admin Execution", "hardikmittal2908@gmail.com", [
            "1. Sign in or use /admin/register with invite code",
            "2. Browser redirects strictly to /admin",
            "3. Open /admin/deployments & adjust Canary slider",
            "4. Click 'Promote Challenger to Production'",
            "5. Test '1-Click Rollback' resilience drill",
            "6. Inspect immutable logs in /admin/logs"
        ], ACCENT_EMERALD)
    ]
    for i, (r_head, r_cred, r_steps, color) in enumerate(exec_roles):
        cx = Inches(0.8) + i * Inches(2.98)
        cy = Inches(1.6)
        cw = Inches(2.8)
        ch = Inches(5.0)
        add_card(s13, cx, cy, cw, ch, border_color=color)

        tb = s13.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.2), cw - Inches(0.4), ch - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = r_head.upper()
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = r_cred
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(2)

        for st in r_steps:
            p_st = tf.add_paragraph()
            p_st.text = st
            p_st.font.size = Pt(9)
            p_st.font.color.rgb = TEXT_MUTED
            p_st.space_before = Pt(6)

    add_footer(s13, 13)

    # ==========================================
    # SLIDE 14: Real-Time Latency Budget & Load Test
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14)
    add_header(s14, "Real-Time Inference Serving & Sub-4ms Latency Budget")

    add_card(s14, Inches(0.8), Inches(1.6), Inches(6.0), Inches(5.0), "Inference Pipeline Latency Budget", ACCENT_EMERALD)
    tb_l = s14.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.6), Inches(4.2))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    stages = [
        ("1. Gateway Authentication & Role Check", "< 1.10 ms", "JWT token signature check and RBAC role validation"),
        ("2. Pydantic Schema Validation", "< 0.20 ms", "Telco feature type checking, null checks, range gates"),
        ("3. XGBoost Champion Model Scoring", "< 0.09 ms", "Calibrated tree probability scoring in C++ engine"),
        ("4. SHAP TreeExplainer Attributions", "< 2.40 ms", "Local Shapley values for top customer risk drivers")
    ]
    for s_name, s_lat, s_desc in stages:
        p_s = tf_l.add_paragraph()
        p_s.text = f"{s_name} — {s_lat}"
        p_s.font.size = Pt(11)
        p_s.font.bold = True
        p_s.font.color.rgb = TEXT_WHITE
        p_s.space_before = Pt(10)
        
        p_d = tf_l.add_paragraph()
        p_d.text = s_desc
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = TEXT_MUTED

    p_tot = tf_l.add_paragraph()
    p_tot.text = "Total End-to-End P95 Latency:  3.79 ms  (Target SLA: < 10.0 ms)"
    p_tot.font.size = Pt(11)
    p_tot.font.bold = True
    p_tot.font.color.rgb = ACCENT_EMERALD
    p_tot.space_before = Pt(16)

    add_card(s14, Inches(7.1), Inches(1.6), Inches(5.433), Inches(5.0), "Locust Load Test Benchmark Verification", ACCENT_BLUE)
    tb_r = s14.shapes.add_textbox(Inches(7.3), Inches(2.2), Inches(5.0), Inches(4.2))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    p_l1 = tf_r.paragraphs[0]
    p_l1.text = "LOCUST LOAD TEST BENCHMARK RESULTS"
    p_l1.font.size = Pt(10)
    p_l1.font.bold = True
    p_l1.font.color.rgb = ACCENT_BLUE

    p_l2 = tf_r.add_paragraph()
    p_l2.text = "• Concurrency: 50 concurrent simulated users\n• Throughput: 1,200 requests / minute\n• Failure Rate: 0.00% (0 errors across 10,000 queries)\n• Average Response Time: 3.2 ms | P95: 3.8 ms"
    p_l2.font.size = Pt(10)
    p_l2.font.color.rgb = TEXT_MUTED
    p_l2.space_before = Pt(6)

    p_s1 = tf_r.add_paragraph()
    p_s1.text = "EXPLAINABLE AI (XAI) TRANSPARENCY"
    p_s1.font.size = Pt(10)
    p_s1.font.bold = True
    p_s1.font.color.rgb = ACCENT_ROSE
    p_s1.space_before = Pt(14)

    p_s2 = tf_r.add_paragraph()
    p_s2.text = "• Local factor attribution calculated per customer\n• Identifies positive drivers (e.g. Month-to-month: +18% churn risk)\n• Identifies retention anchors (e.g. 2-Yr contract: -24% risk)\n• Displayed directly to consumer in interactive risk radar"
    p_s2.font.size = Pt(10)
    p_s2.font.color.rgb = TEXT_MUTED
    p_s2.space_before = Pt(6)

    add_footer(s14, 14)

    # ==========================================
    # SLIDE 15: Observability & Cloud Deployment
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_background(s15)
    add_header(s15, "Observability & Production Cloud Deployment")

    add_card(s15, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.0), "Prometheus & Grafana Observability", ACCENT_PURPLE)
    tb_ob = s15.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_ob = tb_ob.text_frame
    tf_ob.word_wrap = True

    ob_pts = [
        ("Dashboard 1: Serving Health", "Real-time throughput (RPS), error rates, active model version, and P50/P90/P95 latency percentiles (< 3.8ms)."),
        ("Dashboard 2: Drift & Quality", "Continuous Kolmogorov-Smirnov p-values, PSI meters, distribution histograms, and active alert counters."),
        ("Dashboard 3: Performance", "Verified accuracy tracking, confusion matrix trends, label arrival delay, and Challenger vs. Champion comparative lift."),
        ("Prometheus TSDB Scrapes", "Scrapes /api/metrics in standard Prometheus text format every 15 seconds.")
    ]
    for h, b in ob_pts:
        p_h = tf_ob.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_PURPLE
        p_h.space_before = Pt(6)
        p_b = tf_ob.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_card(s15, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.0), "Live Cloud Infrastructure", ACCENT_EMERALD)
    tb_cld = s15.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))
    tf_cld = tb_cld.text_frame
    tf_cld.word_wrap = True

    cld_pts = [
        ("Frontend Application (Vercel):", "https://adapt-flow-brown.vercel.app\n• /architecture • /drift-engine • /feedback-loop • /governance"),
        ("Backend Gateway (Railway):", "https://adaptflow-backend-production.up.railway.app\n• Healthcheck GET /health [HTTP 200 OK • status: healthy]"),
        ("PostgreSQL Database (Supabase):", "PostgreSQL 17 with Row-Level Security (RLS) policies protecting profiles, predictions, and audit logs."),
        ("GitHub Repository:", "https://github.com/hardik-mittal-18/AdaptFlow.git\n• Automated CI/CD via GitHub Actions on push to main.")
    ]
    for h, b in cld_pts:
        p_h = tf_cld.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(10.5)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_EMERALD
        p_h.space_before = Pt(6)
        p_b = tf_cld.add_paragraph()
        p_b.text = b
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED

    add_footer(s15, 15)

    # ==========================================
    # SLIDE 16: Summary & Achievements
    # ==========================================
    s16 = prs.slides.add_slide(blank_layout)
    set_slide_background(s16)
    add_header(s16, "Review #2 Achievements & Impact Summary")

    achieve_cards = [
        ("AUTONOMOUS CLOSED LOOP", [
            "Replaced static, brittle model deployment with continuous adaptation",
            "Automated feedback collection eliminates manual dataset preparation",
            "Drift triggers retraining only when statistically justified"
        ], ACCENT_BLUE),
        ("ENTERPRISE SLA COMPLIANCE", [
            "Sub-4ms P95 latency budget validated under 50-user concurrent load",
            "Zero downtime Blue-Green cutover & 1-click rollback drill verified",
            "Model accuracy increased from 78.4% (baseline) to 84.7% (champion)"
        ], ACCENT_EMERALD),
        ("SECURITY & GOVERNANCE", [
            "Strict 4-role isolation matrix enforced at PostgreSQL database engine",
            "Cryptographic audit log records every model promotion and parameter edit",
            "Pandera validation gates prevent label and schema poisoning"
        ], ACCENT_ROSE)
    ]
    for i, (a_title, a_pts, color) in enumerate(achieve_cards):
        cx = Inches(0.8) + i * Inches(3.98)
        cy = Inches(1.6)
        cw = Inches(3.8)
        ch = Inches(5.0)
        add_card(s16, cx, cy, cw, ch, border_color=color)

        tb = s16.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.2), cw - Inches(0.4), ch - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = a_title
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = color

        for pt in a_pts:
            p_pt = tf.add_paragraph()
            p_pt.text = "• " + pt
            p_pt.font.size = Pt(10)
            p_pt.font.color.rgb = TEXT_MUTED
            p_pt.space_before = Pt(12)

    add_footer(s16, 16)

    # ==========================================
    # SLIDE 17: Final Review Roadmap
    # ==========================================
    s17 = prs.slides.add_slide(blank_layout)
    set_slide_background(s17)
    add_header(s17, "Roadmap for Final Review (Review #3)")

    steps = [
        ("1. Multi-Armed Bandit Routing", "Replace static Canary percentages with contextual Thomson Sampling or UCB algorithms to optimize exploration vs. exploitation."),
        ("2. Automated Data Slicing", "Integrate slice-based evaluation to identify demographic subgroups with higher churn susceptibility or localized model bias."),
        ("3. Edge / Offline Caching", "Support local browser prediction caching with WebAssembly (ONNX Runtime Web) for zero-network consumer resilience."),
        ("4. Automated Model Card Generator", "Generate cryptographic PDF model governance cards adhering to EU AI Act compliance standards directly from MLflow metadata.")
    ]
    for i, (st_title, st_desc) in enumerate(steps):
        cy = Inches(1.6) + i * Inches(1.25)
        add_card(s17, Inches(0.8), cy, Inches(11.733), Inches(1.05), border_color=CARD_BORDER)

        tb = s17.shapes.add_textbox(Inches(1.0), cy + Inches(0.12), Inches(11.3), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = st_title
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = ACCENT_ROSE

        p2 = tf.add_paragraph()
        p2.text = st_desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(3)

    add_footer(s17, 17)

    # ==========================================
    # SLIDE 18: Q&A Slide
    # ==========================================
    s18 = prs.slides.add_slide(blank_layout)
    set_slide_background(s18)
    
    tb_qa = s18.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(4.5))
    tf_qa = tb_qa.text_frame
    tf_qa.word_wrap = True

    p_q0 = tf_qa.paragraphs[0]
    p_q0.text = "MACHINE LEARNING OPERATIONS  •  24SDAD03"
    p_q0.font.size = Pt(11)
    p_q0.font.bold = True
    p_q0.font.color.rgb = ACCENT_ROSE
    p_q0.alignment = PP_ALIGN.CENTER

    p_q1 = tf_qa.add_paragraph()
    p_q1.text = "Thank You!"
    p_q1.font.size = Pt(44)
    p_q1.font.bold = True
    p_q1.font.color.rgb = TEXT_WHITE
    p_q1.alignment = PP_ALIGN.CENTER
    p_q1.space_before = Pt(10)

    p_q2 = tf_qa.add_paragraph()
    p_q2.text = "Questions & Faculty Discussion"
    p_q2.font.size = Pt(16)
    p_q2.font.color.rgb = ACCENT_BLUE
    p_q2.alignment = PP_ALIGN.CENTER
    p_q2.space_before = Pt(8)

    p_q3 = tf_qa.add_paragraph()
    p_q3.text = "Frontend: https://adapt-flow-brown.vercel.app  •  Backend: https://adaptflow-backend-production.up.railway.app\nGitHub: https://github.com/hardik-mittal-18/AdaptFlow.git"
    p_q3.font.size = Pt(11)
    p_q3.font.color.rgb = TEXT_MUTED
    p_q3.alignment = PP_ALIGN.CENTER
    p_q3.space_before = Pt(28)

    add_footer(s18, 18)

    # Save
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(out_dir, "..", "AdaptFlow_Review2_Presentation.pptx")
    create_deck(out_file)
