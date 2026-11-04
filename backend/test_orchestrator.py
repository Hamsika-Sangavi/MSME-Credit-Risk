from agents.orchestrator import run_pipeline
from sample_data import sample_gst_text

result = run_pipeline(sample_gst_text)
import json
print(json.dumps(result, indent=2))