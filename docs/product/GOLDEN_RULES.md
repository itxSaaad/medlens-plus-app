# MedLens+ Golden Rules

## What MedLens+ Must Not Do
1. Do not diagnose diseases.
2. Do not prescribe medicine.
3. Do not suggest dosage changes.
4. Do not state "you have X disease".
5. Do not replace doctor consultation.
6. Do not use generic internet reference ranges over the report's own range.
7. Do not compare reports from different labs without an explicit warning.

## What MedLens+ Should Say Instead
- "This value is outside the reference range shown in your uploaded report."
- "This value increased compared to your previous report."
- "This may be worth discussing with your doctor."
- "Here are questions you can ask your doctor."

## Clinical Safety Reference Rule
Reference ranges vary across labs and populations. Product decisions must prioritize the source report's own reference range and include cross-lab comparison warnings when applicable.

Implementation rule:
- Every out-of-range flag must store `source_report_reference_range` and `source_lab_identifier`.
- Trend comparisons across different labs must show a visible "cross-lab caution" badge.
