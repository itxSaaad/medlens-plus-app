from fastapi import FastAPI

from api.core.factories import (
    get_db_repository,
    get_llm_provider,
    get_ocr_provider,
    get_storage_provider,
)
from api.core.settings import Settings
from api.domain.models import WorkflowState
from api.workflows.report_processing import ReportProcessingWorkflow

settings = Settings.from_env()
app = FastAPI(title="MedLens+ API", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "env": settings.app_env}


@app.post("/documents/{document_id}/process")
def process_document(document_id: str) -> dict[str, str]:
    workflow = ReportProcessingWorkflow(
        storage=get_storage_provider(settings),
        repository=get_db_repository(settings),
        ocr=get_ocr_provider(settings),
        llm=get_llm_provider(settings),
        feature_flags=settings.feature_flags,
    )
    result = workflow.run(WorkflowState(document_id=document_id, user_id="user-1"))
    return {
        "status": result.review_status,
        "report_type": result.report_type or "unknown",
        "summary": result.safe_summary or "",
    }
