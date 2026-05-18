# System Architecture

## Core MVP Flow

1. User interacts with Next.js web app
2. Authentication via managed auth provider
3. Report upload to object storage provider
4. Document record creation in relational DB
5. FastAPI processing request triggers workflow orchestration
6. User review and doctor-ready packet generation
7. Export and sharing flows

## Agentic Workflow Topology (LangGraph-Oriented)

State flows node-by-node with explicit transitions and failure handling.
Every node can fail fast and return partial user-safe output instead of silent failure.

### Node 1: Intake and OCR
- Validate input type (PDF/image/JSON)
- Extract raw text
- Confidence threshold gate

### Node 2: Medical Parser
- Classify report type
- Extract structured entities
- Map to standard identifiers (target: LOINC/ICD-10)
- Flag critical anomalies

### Node 3: Explainer
- Generate patient-safe explanation
- Enforce non-diagnosis, non-prescription policy
- Apply factual grounding pipeline

### Node 4: Timeline
- Merge with historical observations
- Compute trend velocities and deltas
- Persist immutable health events

### Node 5: Alert and Care
- Trigger only with explicit consent and critical thresholds
- Scoped caregiver access controls

## Port-and-Adapter Rule

All external dependencies must go through interfaces and factories:
- auth
- storage
- db repository
- OCR
- LLM

This keeps swap cost low and supports fallback providers when one service is degraded.
