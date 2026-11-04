import ollama
from agents.utils import clean_and_parse_json

def generate_explanation(extracted_data: dict, risk_assessment: dict) -> dict:
    prompt = f"""
You are a loan officer assistant. Write a clear, plain-language summary for a human loan officer based on this data.

Business financial data:
{extracted_data}

Risk assessment:
{risk_assessment}

Return ONLY valid JSON with these fields:
- summary (2-3 sentence plain-English overview of this business's credit risk, no jargon)
- recommendation (one of: "Approve", "Approve with conditions", "Refer for manual review", "Decline")
- suggested_conditions (array of short strings, max 3 — practical conditions to attach if approving, e.g. "Require post-dated cheques as additional security". Empty array if recommendation is "Approve" or "Decline")
- officer_notes (1-2 sentence note flagging anything the officer should personally verify before finalizing)

Write in plain, professional language a non-technical loan officer would understand — no reference to "agents", "AI", or "models".

Return ONLY valid JSON, no markdown, no explanation outside the JSON.
"""

    response = ollama.chat(
        model="llama3.1",
        messages=[{"role": "user", "content": prompt}],
        options={"temperature": 0}
    )

    content = response["message"]["content"]
    return clean_and_parse_json(content)