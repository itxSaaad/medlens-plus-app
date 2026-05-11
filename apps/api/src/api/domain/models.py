from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class DocumentRecord:
    id: str
    user_id: str
    file_path: str
    lab_name: str | None = None
    report_type: str | None = None


@dataclass(slots=True)
class ExtractedObservation:
    biomarker: str
    value: float | str
    unit: str | None
    reference_range: str | None
    source_snippet: str | None = None


@dataclass(slots=True)
class WorkflowState:
    document_id: str
    user_id: str
    text_content: str | None = None
    report_type: str | None = None
    observations: list[ExtractedObservation] = field(default_factory=list)
    validation_errors: list[str] = field(default_factory=list)
    historical_summary: dict[str, Any] = field(default_factory=dict)
    safe_summary: str | None = None
    review_status: str = "pending_review"
