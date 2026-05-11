from __future__ import annotations

from api.core.interfaces import (
    AuthProvider,
    DocumentRepository,
    FileStorageProvider,
    LLMProvider,
    OCRProvider,
)
from api.core.settings import Settings
from api.providers.auth.supabase_auth import SupabaseAuthProvider
from api.providers.db.supabase_postgres import SupabasePostgresRepository
from api.providers.llm.openai_provider import OpenAIProvider
from api.providers.ocr.docling_ocr import DoclingOCRProvider
from api.providers.storage.supabase_storage import SupabaseStorageProvider


def get_auth_provider(settings: Settings) -> AuthProvider:
    if settings.auth_provider == "supabase":
        return SupabaseAuthProvider()
    raise ValueError(f"Unsupported auth provider: {settings.auth_provider}")


def get_storage_provider(settings: Settings) -> FileStorageProvider:
    if settings.storage_provider == "supabase":
        return SupabaseStorageProvider()
    raise ValueError(f"Unsupported storage provider: {settings.storage_provider}")


def get_db_repository(settings: Settings) -> DocumentRepository:
    if settings.db_provider == "supabase_postgres":
        return SupabasePostgresRepository()
    raise ValueError(f"Unsupported DB provider: {settings.db_provider}")


def get_ocr_provider(settings: Settings) -> OCRProvider:
    if settings.ocr_provider == "docling":
        return DoclingOCRProvider()
    raise ValueError(f"Unsupported OCR provider: {settings.ocr_provider}")


def get_llm_provider(settings: Settings) -> LLMProvider:
    if settings.llm_provider == "openai":
        return OpenAIProvider()
    raise ValueError(f"Unsupported LLM provider: {settings.llm_provider}")
