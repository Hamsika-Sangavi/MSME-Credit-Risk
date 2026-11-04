from agents.extractor_agent import extract_financial_data
from agents.risk_agent import assess_risk
from agents.critic_agent import critique_risk_assessment
from agents.explainer_agent import generate_explanation

def run_pipeline(raw_text: str) -> dict:
    extracted = extract_financial_data(raw_text)
    if "error" in extracted:
        return {"stage": "extraction", "error": extracted}

    risk = assess_risk(extracted)
    if "error" in risk:
        return {"stage": "risk_assessment", "error": risk}

    critique = critique_risk_assessment(extracted, risk)

    # Apply critic's corrections if issues were found
    if critique.get("issues_found"):
        risk["key_concerns"] = critique.get("corrected_key_concerns", risk.get("key_concerns"))
        risk["positive_factors"] = critique.get("corrected_positive_factors", risk.get("positive_factors"))

    explanation = generate_explanation(extracted, risk)

    return {
        "extracted": extracted,
        "risk_assessment": risk,
        "critic_review": critique,
        "explanation": explanation
    }