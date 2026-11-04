from agents.extractor_agent import extract_financial_data
from agents.risk_agent import assess_risk
from sample_data import sample_gst_text

extracted = extract_financial_data(sample_gst_text)
print("Extracted:", extracted)

risk = assess_risk(extracted)
print("Risk Assessment:", risk)