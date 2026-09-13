# FEATURE PARITY MATRIX
**Version 01 vs Version 02 vs Master Production Platform**

---

| Subsystem / Feature | Version 01 Baseline | Version 02 Requirement | Master Platform Implementation | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Lesson Viewer & Curriculum** | 6 complete structured lessons, cases, examples | Generic syllabus | Retained full rich V1 educational content + linked glossary | **UPGRADED** |
| **Accounting Simulation** | T-Account simulator, visual debit/credit balance | Static tables | Retained interactive V1 T-Account simulator | **PRESERVED** |
| **Journal Reasoning Engine (JRE)** | 20-mark interactive argument builder | 20-mark academic rubric | Unified 5 criteria × 4 marks across UI, backend, tests | **UNIFIED** |
| **Assessment Registry** | In-memory question bank | Centralized registry with hashes and metadata | Full `VerifiedAssessmentRegistry` with SHA-256 hashes | **IMPLEMENTED** |
| **Source Snapshots** | Implicit syllabus references | Immutable versioned snapshots with hashes | `SourceSnapshotRegistry` with cryptographic verification | **IMPLEMENTED** |
| **Grading Authority** | Hybrid client/server | Strictly server-authoritative | `AuthoritativeGradingEngine` handling all 7 grading modes | **SECURED** |
| **Answer-Key Protection** | Basic UI hiding | Strict student-safe response sanitization | Complete serialization filtering across all public routes | **SECURED** |
| **Learner Reachability** | Accessible in UI | Formal reachability & zero-orphan policy | Automated zero-orphan audit (0 orphan items) | **VERIFIED** |
| **Mastery Engine** | Evidence-based calculation | Evidence-based with `INSUFFICIENT_DATA` | Server-driven mastery engine rejecting fabricated scores | **UNIFIED** |
| **Adaptive Remediation** | Dynamic remedial suggestions | Recommendation pipeline from verified results | Integrated with authoritative attempt outcomes | **UPGRADED** |
| **Teacher & Student Dashboards** | Role-based modals with analytics | Role-based access control | Full dashboards + content quality & psychometric reports | **PRESERVED** |
| **Persistence Engine** | Atomic disk file with backups | Persistent database | Robust transactional atomic disk database with backups | **PRESERVED** |
| **Accounting Glossary** | Not present in basic v1 | Core conceptual reference | 14 comprehensive terms with interactive links in lessons | **ADDED** |
