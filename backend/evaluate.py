from agents.extractor_agent import extract_financial_data
from agents.risk_agent import assess_risk
from agents.critic_agent import critique_risk_assessment
from knowledge_base.test_cases import test_cases

results = []

for case in test_cases:
    print(f"\n--- Running {case['id']} ---")
    extracted = extract_financial_data(case["text"])
    risk = assess_risk(extracted)
    critique = critique_risk_assessment(extracted, risk)

    had_issues = len(critique.get("issues_found", [])) > 0

    results.append({
        "case_id": case["id"],
        "risk_score": risk.get("risk_score"),
        "issues_found": critique.get("issues_found", []),
        "had_issues": had_issues,
        "verified": critique.get("verified")
    })

    print(f"Risk score: {risk.get('risk_score')}")
    print(f"Issues found by critic: {critique.get('issues_found', [])}")

# Summary
total_cases = len(results)
cases_with_issues = sum(1 for r in results if r["had_issues"])

print("\n=== EVALUATION SUMMARY ===")
print(f"Total cases tested: {total_cases}")
print(f"Cases where critic caught an inaccuracy: {cases_with_issues}")
print(f"Critic catch rate: {round((cases_with_issues/total_cases)*100, 1)}%")