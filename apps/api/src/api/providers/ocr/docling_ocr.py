from __future__ import annotations


class DoclingOCRProvider:
    def extract_text(self, file_bytes: bytes, mime_type: str | None = None) -> str:
        _ = (file_bytes, mime_type)
        return "extracted report text"
