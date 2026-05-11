from api.core.settings import Settings


def test_settings_defaults(monkeypatch) -> None:
    for key in [
        "APP_ENV",
        "API_HOST",
        "API_PORT",
        "AUTH_PROVIDER",
        "STORAGE_PROVIDER",
        "DB_PROVIDER",
        "OCR_PROVIDER",
        "LLM_PROVIDER",
        "FF_ENABLE_OCR_FALLBACK",
    ]:
        monkeypatch.delenv(key, raising=False)

    settings = Settings.from_env()

    assert settings.app_env == "development"
    assert settings.api_port == 8000
    assert settings.feature_flags.enable_ocr_fallback is True


def test_settings_and_feature_flags_from_env(monkeypatch) -> None:
    monkeypatch.setenv("APP_ENV", "staging")
    monkeypatch.setenv("API_PORT", "9000")
    monkeypatch.setenv("AUTH_PROVIDER", "supabase")
    monkeypatch.setenv("FF_ENABLE_OCR_FALLBACK", "false")
    monkeypatch.setenv("FF_ENABLE_HISTORICAL_COMPARISON", "0")
    monkeypatch.setenv("FF_ENABLE_SCHEMA_VALIDATION", "true")

    settings = Settings.from_env()

    assert settings.app_env == "staging"
    assert settings.api_port == 9000
    assert settings.auth_provider == "supabase"
    assert settings.feature_flags.enable_ocr_fallback is False
    assert settings.feature_flags.enable_historical_comparison is False
    assert settings.feature_flags.enable_schema_validation is True
