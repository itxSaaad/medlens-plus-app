from __future__ import annotations

from api.domain.models import DocumentRecord, ExtractedObservation


class SupabasePostgresRepository:
    def create_document_record(self, user_id: str, file_path: str) -> DocumentRecord:
        return DocumentRecord(id="doc-1", user_id=user_id, file_path=file_path)

    def get_document(self, document_id: str) -> DocumentRecord | None:
        _ = document_id
        return DocumentRecord(id="doc-1", user_id="user-1", file_path="reports/sample.pdf")

    def store_observations(
        self,
        document_id: str,
        observations: list[ExtractedObservation],
    ) -> None:
        _ = (document_id, observations)

    def get_historical_observations(
        self,
        user_id: str,
        report_type: str,
    ) -> list[ExtractedObservation]:
        _ = (user_id, report_type)
        return []

    def mark_review_status(self, document_id: str, status: str) -> None:
        _ = (document_id, status)
