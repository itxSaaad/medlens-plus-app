from __future__ import annotations

import os
from dataclasses import dataclass


def _as_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    normalized = value.strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    return default


@dataclass(frozen=True)
class FeatureFlags:
    enable_ocr_fallback: bool
    enable_schema_validation: bool
    enable_historical_comparison: bool
    enable_doctor_packet_export: bool
    require_manual_review_on_validation_errors: bool

    @classmethod
    def from_env(cls) -> FeatureFlags:
        return cls(
            enable_ocr_fallback=_as_bool(os.getenv("FF_ENABLE_OCR_FALLBACK"), True),
            enable_schema_validation=_as_bool(os.getenv("FF_ENABLE_SCHEMA_VALIDATION"), True),
            enable_historical_comparison=_as_bool(
                os.getenv("FF_ENABLE_HISTORICAL_COMPARISON"),
                True,
            ),
            enable_doctor_packet_export=_as_bool(
                os.getenv("FF_ENABLE_DOCTOR_PACKET_EXPORT"),
                True,
            ),
            require_manual_review_on_validation_errors=_as_bool(
                os.getenv("FF_REQUIRE_MANUAL_REVIEW_ON_VALIDATION_ERRORS"),
                True,
            ),
        )


@dataclass(frozen=True)
class Settings:
    app_env: str
    api_host: str
    api_port: int
    auth_provider: str
    storage_provider: str
    db_provider: str
    ocr_provider: str
    llm_provider: str
    database_url: str
    redis_url: str
    feature_flags: FeatureFlags

    @classmethod
    def from_env(cls) -> Settings:
        return cls(
            app_env=os.getenv("APP_ENV", "development"),
            api_host=os.getenv("API_HOST", "0.0.0.0"),
            api_port=int(os.getenv("API_PORT", "8000")),
            auth_provider=os.getenv("AUTH_PROVIDER", "supabase"),
            storage_provider=os.getenv("STORAGE_PROVIDER", "supabase"),
            db_provider=os.getenv("DB_PROVIDER", "supabase_postgres"),
            ocr_provider=os.getenv("OCR_PROVIDER", "docling"),
            llm_provider=os.getenv("LLM_PROVIDER", "openai"),
            database_url=os.getenv(
                "DATABASE_URL",
                "postgresql://medlens:medlens@localhost:5432/medlens",
            ),
            redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
            feature_flags=FeatureFlags.from_env(),
        )
