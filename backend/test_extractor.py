from agents.extractor_agent import extract_financial_data
from sample_data import sample_gst_text

result = extract_financial_data(sample_gst_text)
print(result)