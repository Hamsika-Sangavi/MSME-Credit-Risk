import json
import ollama
from agents.utils import clean_and_parse_json
from agents.rag_store import retrieve_relevant_guidelines

def assess_risk(extracted_data: dict) -> dict:
    # Build a query from the extracted data to find relevant guidelines
    query = f"""
    Cash flow: credit {extracted_data.get('avg_monthly_credit')} vs debit {extracted_data.get('avg_monthly_debit')}.
    EMI: {extracted_data.get('existing_emi')} against turnover {extracted_data.get('monthly_turnover')}.
    Bounced cheques: {extracted_data.get('bounced_cheques_count')}.
    GST filing: {extracted_data.get('gst_filing_status')}.
    """
    relevant_guidelines = retrieve_relevant_guidelines(query, top_k=3)
    guidelines_text = "\n".join(f"- {g}" for g in relevant_guidelines)

    prompt = f"""
You are a credit risk analyst for MSME (small business) loans in India.

Given this extracted financial data:
{json.dumps(extracted_data, indent=2)}

Relevant RBI/CGTMSE lending guidelines retrieved for this case:
{guidelines_text}

Assess the credit risk using these guidelines as your grounding. Return ONLY valid JSON with these fields:
- risk_score (number from 0-100, where 0 = very low risk, 100 = very high risk)
- risk_level (one of: "Low", "Medium", "High")
- key_concerns (array of short strings, max 4 — each should reference the specific guideline it's based on where applicable)
- positive_factors (array of short strings, max 4)
- guideline_citations (array of the exact guideline texts you used from above, max 3)

Return ONLY valid JSON, no markdown, no explanation outside the JSON.
"""

    response = ollama.chat(
    model="llama3.1",
    messages=[{"role": "user", "content": prompt}],
    options={"temperature": 0}
)

    content = response["message"]["content"]
    return clean_and_parse_json(content)