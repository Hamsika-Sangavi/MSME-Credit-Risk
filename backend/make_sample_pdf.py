from fpdf import FPDF

sample_text = """Business Name: Verma Hardware Store
GST Registration: Active since 2020
Monthly Turnover (avg last 6 months): Rs 3,80,000
Filing Status: Regular, no defaults in last 12 months
Sector: Hardware & Building Materials Retail

Bank Statement Summary:
Average Monthly Credit: Rs 3,60,000
Average Monthly Debit: Rs 3,20,000
Existing Loan EMI: Rs 18,000/month
Bounced Cheques (last 6 months): 0
Bank Balance Trend: Stable, slight upward
"""

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)
for line in sample_text.split("\n"):
    pdf.cell(0, 10, txt=line, ln=True)
pdf.output("sample_business.pdf")

print("Created sample_business.pdf")