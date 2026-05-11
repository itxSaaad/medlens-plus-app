# Data Model (v1)

## Entities

- User
- PatientProfile
- ReportDocument
- LabObservation
- ReferenceRange
- ObservationTrend
- SummarySnapshot
- DoctorQuestionSet

## Key Design Notes

- Keep original extracted snippets for traceability
- Store normalized and raw values
- Track parser version and model version for reproducibility
- Add confidence score per extracted observation
