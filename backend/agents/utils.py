import json
import re

def clean_and_parse_json(content: str) -> dict:
    # Remove markdown code fences, with or without "json" tag
    content = re.sub(r"^```(json)?", "", content.strip())
    content = re.sub(r"```$", "", content.strip())
    content = content.strip()

    # Remove // style comments some models add (invalid in JSON)
    content = re.sub(r"//.*", "", content)

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
        return {"error": "Could not parse JSON", "raw_output": content}