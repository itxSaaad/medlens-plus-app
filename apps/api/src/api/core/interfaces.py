from __future__ import annotations

from typing import Protocol

from api.domain.models import DocumentRecord, ExtractedObservation


class AuthProvider(Protocol):
    def validate_user_token(self, token: str) -> str: ...


class FileStorageProvider(Protocol):
    def get_bytes(self, path: str) -> bytes: ...

    def put_bytes(self, path: str, content: bytes, content_type: str) -> None: ...


class DocumentRepository(Protocol):
    def create_document_record(self, user_id: str, file_path: str) -> DocumentRecord: ...

    def get_document(self, document_id: str) -> DocumentRecord | None: ...

    def store_observations(
        self,
        document_id: str,
        observations: list[ExtractedObservation],
    ) -> None: ...

    def get_historical_observations(
        self,
        user_id: str,
        report_type: str,
    ) -> list[ExtractedObservation]: ...

    def mark_review_status(self, document_id: str, status: str) -> None: ...


class OCRProvider(Protocol):
    def extract_text(self, file_bytes: bytes, mime_type: str | None = None) -> str: ...


class LLMProvider(Protocol):
    def classify_report_type(self, text: str) -> str: ...

    def extract_structured_values(
        self,
        text: str,
        report_type: str,
    ) -> list[ExtractedObservation]: ...

    def generate_safe_summary(
        self,
        report_type: str,
        observations: list[ExtractedObservation],
        historical_context: list[ExtractedObservation],
    ) -> str: ...
