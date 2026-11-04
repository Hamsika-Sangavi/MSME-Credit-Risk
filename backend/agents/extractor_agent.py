import ollama
from agents.utils import clean_and_parse_json

def extract_financial_data(raw_text: str) -> dict:
    prompt = f"""
You are a financial document extractor. Read the text below and extract these fields as valid JSON only, no extra text:

- business_name
- sector
- monthly_turnover (number, in INR)
- gst_filing_status
- years_active
- avg_monthly_credit (number, in INR)
- avg_monthly_debit (number, in INR)
- existing_emi (number, in INR)
- bounced_cheques_count (number)
- bank_balance_trend

Text:
{raw_text}

Return ONLY valid JSON, no markdown, no explanation.
"""

    response = ollama.chat(
        model="llama3.1",
        messages=[{"role": "user", "content": prompt}],
        options={"temperature": 0}
    )


    content = response["message"]["content"]
    return clean_and_parse_json(content)