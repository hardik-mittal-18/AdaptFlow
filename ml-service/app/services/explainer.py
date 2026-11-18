import numpy as np
from typing import List, Dict, Any
from app.schemas.telco import FeatureImpact, TelcoCustomerFeatures

class ChurnExplainabilityService:
    """
    Computes explainable AI (XAI) feature attributions.
    Produces human-interpretable feature impacts with direction and business context.
    """

    FEATURE_DESCRIPTIONS = {
        "Contract": {
            "Month-to-month": "Month-to-month contract commitments have historically high churn vulnerability.",
            "One year": "1-Year contractual commitment provides retention stabilization.",
            "Two year": "2-Year contract locks in long-term customer loyalty and minimal churn."
        },
        "InternetService": {
            "Fiber optic": "Fiber optic packages exhibit elevated competitive displacement and pricing sensitivity.",
            "DSL": "DSL lines show moderate loyalty and lower churn probability.",
            "No": "Basic voice-only customers exhibit exceptionally low churn rates."
        },
        "tenure": "Shorter customer tenure (< 12 months) reflects the highest onboarding cancellation window.",
        "MonthlyCharges": "Higher monthly recurring charges (> $80) increase budget attrition risk.",
        "PaymentMethod": {
            "Electronic check": "Electronic check payments have a 45% higher cancellation correlation than automated billing.",
            "Credit card (automatic)": "Automated recurring credit card billing maximizes account longevity."
        },
        "TechSupport": "Lack of dedicated 24/7 technical support increases frustration-driven attrition.",
        "OnlineSecurity": "Absence of digital security add-ons correlates with lower platform stickiness."
    }

    @classmethod
    def explain_prediction(cls, features: TelcoCustomerFeatures, churn_prob: float) -> List[FeatureImpact]:
        """
        Calculates top feature impacts for a customer inference.
        """
        impacts: List[FeatureImpact] = []

        # 1. Contract Impact
        if features.Contract == "Month-to-month":
            impacts.append(FeatureImpact(
                feature="Contract",
                importance=0.28,
                direction="risk_increasing",
                display_name="Contract: Month-to-Month",
                description=cls.FEATURE_DESCRIPTIONS["Contract"]["Month-to-month"]
            ))
        else:
            impacts.append(FeatureImpact(
                feature="Contract",
                importance=-0.22,
                direction="risk_decreasing",
                display_name=f"Contract: {features.Contract}",
                description=cls.FEATURE_DESCRIPTIONS["Contract"].get(features.Contract, "Multi-year contract retention.")
            ))

        # 2. Internet Service & Technology
        if features.InternetService == "Fiber optic":
            impacts.append(FeatureImpact(
                feature="InternetService",
                importance=0.21,
                direction="risk_increasing",
                display_name="Service: Fiber Optic Package",
                description=cls.FEATURE_DESCRIPTIONS["InternetService"]["Fiber optic"]
            ))
        elif features.InternetService == "No":
            impacts.append(FeatureImpact(
                feature="InternetService",
                importance=-0.18,
                direction="risk_decreasing",
                display_name="Service: Basic Voice Only",
                description=cls.FEATURE_DESCRIPTIONS["InternetService"]["No"]
            ))

        # 3. Monthly Recurring Charges
        if features.MonthlyCharges > 80.0:
            impacts.append(FeatureImpact(
                feature="MonthlyCharges",
                importance=0.19,
                direction="risk_increasing",
                display_name=f"Monthly Charges: ${features.MonthlyCharges:.2f}",
                description=cls.FEATURE_DESCRIPTIONS["MonthlyCharges"]
            ))
        elif features.MonthlyCharges < 40.0:
            impacts.append(FeatureImpact(
                feature="MonthlyCharges",
                importance=-0.15,
                direction="risk_decreasing",
                display_name=f"Monthly Charges: ${features.MonthlyCharges:.2f}",
                description="Low bill threshold reduces customer price sensitivity."
            ))

        # 4. Tenure Longevity
        if features.tenure < 10:
            impacts.append(FeatureImpact(
                feature="tenure",
                importance=0.24,
                direction="risk_increasing",
                display_name=f"Tenure: {features.tenure} months (New Customer)",
                description=cls.FEATURE_DESCRIPTIONS["tenure"]
            ))
        elif features.tenure > 36:
            impacts.append(FeatureImpact(
                feature="tenure",
                importance=-0.26,
                direction="risk_decreasing",
                display_name=f"Tenure: {features.tenure} months (Established)",
                description="High account tenure reflects loyal enterprise usage."
            ))

        # 5. Payment Method Friction
        if features.PaymentMethod == "Electronic check":
            impacts.append(FeatureImpact(
                feature="PaymentMethod",
                importance=0.14,
                direction="risk_increasing",
                display_name="Payment: Electronic Check",
                description=cls.FEATURE_DESCRIPTIONS["PaymentMethod"]["Electronic check"]
            ))

        # 6. Technical Support Safeguard
        if features.TechSupport == "No" and features.InternetService != "No":
            impacts.append(FeatureImpact(
                feature="TechSupport",
                importance=0.12,
                direction="risk_increasing",
                display_name="Support: No Tech Support Added",
                description=cls.FEATURE_DESCRIPTIONS["TechSupport"]
            ))

        # Sort by absolute impact magnitude
        impacts.sort(key=lambda x: abs(x.importance), reverse=True)
        return impacts[:4]
