from __future__ import annotations

from api.core.interfaces import DocumentRepository, FileStorageProvider, LLMProvider, OCRProvider
from api.core.settings import FeatureFlags
from api.domain.models import WorkflowState


class ReportProcessingWorkflow:
    """MVP orchestration mirroring future LangGraph node boundaries."""

    def __init__(
        self,
        storage: FileStorageProvider,
        repository: DocumentRepository,
        ocr: OCRProvider,
        llm: LLMProvider,
        feature_flags: FeatureFlags,
    ) -> None:
        self.storage = storage
        self.repository = repository
        self.ocr = ocr
        self.llm = llm
        self.feature_flags = feature_flags

    def run(self, state: WorkflowState) -> WorkflowState:
        document = self.repository.get_document(state.document_id)
        if document is None:
            state.validation_errors.append("Document not found")
            state.review_status = "failed"
            return state

        file_bytes = self.storage.get_bytes(document.file_path)

        # 1-3. Load document + extract text + OCR fallback
        state.text_content = self.ocr.extract_text(file_bytes)
        if self.feature_flags.enable_ocr_fallback and not state.text_content.strip():
            state.text_content = self.ocr.extract_text(file_bytes, mime_type="image/*")

        # 4. Classify report type
        state.report_type = self.llm.classify_report_type(state.text_content)

        # 5-6. Extract structured values + validate schema
        state.observations = self.llm.extract_structured_values(
            state.text_content,
            state.report_type,
        )
        if self.feature_flags.enable_schema_validation and not state.observations:
            state.validation_errors.append("No observations extracted")

        # 7. Store extracted observations
        self.repository.store_observations(state.document_id, state.observations)

        # 8. Compare with historical values
        historical = []
        if self.feature_flags.enable_historical_comparison:
            historical = self.repository.get_historical_observations(
                state.user_id,
                state.report_type,
            )

        # 9. Generate safe summary
        state.safe_summary = self.llm.generate_safe_summary(
            state.report_type,
            state.observations,
            historical,
        )

        # 10. Mark review status
        if (
            self.feature_flags.require_manual_review_on_validation_errors
            and state.validation_errors
        ):
            state.review_status = "needs_review"
        else:
            state.review_status = "ready_for_user_review"
        self.repository.mark_review_status(state.document_id, state.review_status)
        return state
