from api.core.factories import (
    get_db_repository,
    get_llm_provider,
    get_ocr_provider,
    get_storage_provider,
)
from api.core.settings import FeatureFlags, Settings
from api.domain.models import WorkflowState
from api.workflows.report_processing import ReportProcessingWorkflow


def test_workflow_runs_with_default_factories() -> None:
    settings = Settings.from_env()
    workflow = ReportProcessingWorkflow(
        storage=get_storage_provider(settings),
        repository=get_db_repository(settings),
        ocr=get_ocr_provider(settings),
        llm=get_llm_provider(settings),
        feature_flags=settings.feature_flags,
    )

    result = workflow.run(WorkflowState(document_id="doc-1", user_id="user-1"))

    assert result.review_status in {"ready_for_user_review", "needs_review"}
    assert result.report_type is not None


def test_workflow_without_manual_review_flag_sets_ready_for_review() -> None:
    settings = Settings.from_env()
    flags = FeatureFlags(
        enable_ocr_fallback=True,
        enable_schema_validation=True,
        enable_historical_comparison=True,
        enable_doctor_packet_export=True,
        require_manual_review_on_validation_errors=False,
    )

    workflow = ReportProcessingWorkflow(
        storage=get_storage_provider(settings),
        repository=get_db_repository(settings),
        ocr=get_ocr_provider(settings),
        llm=get_llm_provider(settings),
        feature_flags=flags,
    )

    result = workflow.run(WorkflowState(document_id="doc-1", user_id="user-1"))

    assert result.review_status == "ready_for_user_review"
