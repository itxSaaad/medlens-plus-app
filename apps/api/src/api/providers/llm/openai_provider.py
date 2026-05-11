from __future__ import annotations

from api.domain.models import ExtractedObservation


class OpenAIProvider:
    def classify_report_type(self, text: str) -> str:
        _ = text
        return "CBC"

    def extract_structured_values(self, text: str, report_type: str) -> list[ExtractedObservation]:
        _ = (text, report_type)
        return [
            ExtractedObservation(
                biomarker="Hemoglobin",
                value=11.8,
                unit="g/dL",
                reference_range="13.0-17.0",
            )
        ]

    def generate_safe_summary(
        self,
        report_type: str,
        observations: list[ExtractedObservation],
        historical_context: list[ExtractedObservation],
    ) -> str:
        _ = (report_type, observations, historical_context)
        return "This value is outside the reference range shown in your uploaded report."
