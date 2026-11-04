import ollama
from agents.utils import clean_and_parse_json

def critique_risk_assessment(extracted_data: dict, risk_assessment: dict) -> dict:
    prompt = f"""
You are a strict quality-control reviewer checking a credit risk assessment for factual accuracy before it reaches a loan officer.

Original extracted data (source of truth):
{extracted_data}

Risk assessment to review:
{risk_assessment}

Check EVERY claim in "key_concerns" and "positive_factors" against the original data. Flag any claim that:
- Overstates the data (e.g. calling a single occurrence "repeated" or "frequent")
- States something not present in the original data
- Uses vague language where the original data has a specific number

Return ONLY valid JSON with these fields:
- issues_found (array of short strings describing each inaccuracy found, empty array if none)
- corrected_key_concerns (array — the key_concerns list, rewritten to be strictly accurate to the original data)
- corrected_positive_factors (array — the positive_factors list, rewritten to be strictly accurate)
- verified (boolean — true only if issues_found is empty)

Return ONLY valid JSON, no markdown, no explanation outside the JSON.
"""

    response = ollama.chat(
        model="llama3.1",
        messages=[{"role": "user", "content": prompt}],
        options={"temperature": 0}
    )


    content = response["message"]["content"]
    return clean_and_parse_json(content)