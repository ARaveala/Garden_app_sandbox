# Next Steps


# Roadmap

## Phase 1 — Proof of Concept ✅

- Three-container architecture (harvester, database, display)
- USDA Plants Database harvested via API
- Raw data stored in MariaDB with JSON column schema
- C++ client retrieves and displays latest record
- Structured logging with configurable output (Pino)
- Base/subclass harvester pattern for source extensibility

---

## Phase 2 — Multi-Source Harvesting 🔄 In Progress

- Refactor harvester for concurrent multi-source collection
- Add second data source (GBIF occurrence data planned)
- Deduplication logic for overlapping plant records
- Source abstraction layer — each source as a self-contained harvester class
- Resolve restart policy causing data duplication on container restart
- Harvest limit is intentional during development — full dataset collection deferred until the calculation pipeline (Phase 3) is ready to process it

---

## Phase 3 — Data Processing Pipeline

**Container 4: Data Cleaner (C++)**
- Normalise disparate source formats into a unified schema
- Data validation and quality checks
- Flag records for review rather than silent discard

**Container 5: Calculator (C++)**
- Convert qualitative light requirements ("full sun", "partial shade") to quantitative metrics (DLI — Daily Light Integral)
- Adapt recommendations to geographic location and season
- Output suitability scores per plant per location

---

## Phase 4 — Production Features

- Task queue for scalable and resumable harvesting
- Automated scheduling
- API layer for data access
- Monitoring and alerting
- Archiving strategy for raw data (SQLite or file-based) to allow schema changes without re-harvesting

---

## Known Limitations (Current)

- Single data source (USDA only)
- No deduplication across runs
- C++ display container is a placeholder — not a real user interface
- USDA provides qualitative light data only; quantitative values require cross-referencing research sources
- No test coverage yet

---

## Design Notes

**Why Playwright for scraping?**
USDA and many plant databases render content client-side with JavaScript. Playwright handles this where simple HTTP requests return empty pages.

**Why C++ for the processing layer?**
Legitimate performance advantage for large-scale calculation workloads (DLI calculations across millions of plant/location combinations). Also demonstrates polyglot architecture.

**Why separate containers per concern?**
Independent scaling, language-specific optimisation per task, and easier isolated testing. Each container does one thing.
