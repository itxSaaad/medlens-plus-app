from __future__ import annotations


class SupabaseStorageProvider:
    def get_bytes(self, path: str) -> bytes:
        _ = path
        return b""

    def put_bytes(self, path: str, content: bytes, content_type: str) -> None:
        _ = (path, content, content_type)
