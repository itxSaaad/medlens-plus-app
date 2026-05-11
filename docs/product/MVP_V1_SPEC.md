# MVP v1 Spec: Lab Timeline Intelligence

## Primary Users
- Patients with recurring lab reports
- Caregivers managing family health reports
- People monitoring diabetes, thyroid, cholesterol, liver/kidney markers
- Overseas family members helping parents interpret reports

## Later User Segments
- Small clinics
- Diagnostic labs
- Family physicians
- Telemedicine providers
- Insurance pre-check teams
- Corporate health screening teams

## Supported Report Types (MVP v1)
- CBC
- LFT
- KFT/RFT
- Lipid Profile
- HbA1c
- Thyroid Profile
- Vitamin D
- Vitamin B12

## MVP Features
1. Upload PDF/image report
2. OCR/document parsing
3. Report type detection
4. Structured value extraction
5. Store values with units and report-specific ranges
6. Compare current report with prior reports
7. Timeline and trend charts
8. Plain-language summary generation
9. "Questions to ask your doctor" generation
10. Doctor-ready PDF summary export

## Example Flow
1. User uploads CBC report.
2. System extracts Hb, WBC, Platelets, RBC, MCV, etc.
3. System validates extracted fields.
4. System compares with previous CBC report.
5. System highlights changes and status.
6. System generates summary, risk/doubt flags, doctor questions, and export packet.
