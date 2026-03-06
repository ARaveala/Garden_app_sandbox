# Roadmap

## Phase 1 — Proof of Concept ✅

- Three-container architecture (harvester, database, display)
- USDA Plants Database harvested via API
- Raw data stored in MariaDB with JSON column schema
- C++ client retrieves and displays latest record
- Structured logging with configurable output (Pino)
- Base/subclass harvester pattern for source extensibility

---

## Phase 1.1 — Dev/Production Environment Switch 🔄 In Progress

Currently there is no formal distinction between development and production runs.
`NODE_ENV` and `PLANT_LIMIT` are already read from the environment, so the
mechanism exists — this phase formalises it.

- Provide a `.env.dev` and `.env.prod` alongside the existing `.env.example`
- `PLANT_LIMIT` controls harvest size: small fixed number in dev, full dataset in production
- `LOG_LEVEL` and `LOG_PRETTY` already differ per environment — document the expected values for each
- Add a `make dev` and `make prod` target to the Makefile that selects the correct env file
- Harvest limit remains intentionally low during all phases until the data processing
  pipeline (Phase 3) is ready to handle a full dataset

> **Note:** The full plant list will not be harvested until Phase 3 is stable.
> Increasing `PLANT_LIMIT` is the only change required at that point.

---

## Phase 2 — Multi-Source Harvesting 🔄 In Progress

Raw data collection from multiple sources. The goal of this phase is to collect
and store raw data reliably — not to clean, reconcile, or deduplicate it.
Contradictions between sources are expected and are intentionally left for Phase 3.

### Phase 2a — API-Based Sources

- Refactor harvester for concurrent multi-source collection
- Add GBIF (occurrence data — where plants actually grow, GPS coordinates)
- Add Kew POWO (authoritative taxonomy, native ranges, synonyms)
- Source abstraction layer — each source as a self-contained harvester class
- Resolve restart policy causing data duplication on container restart
- Document each source in `docs/sources/<source>.md`:
  fields harvested, field meanings, known limitations, and why the source is included

### Phase 2b — Research Paper Pipeline

Harvesting from research papers is fundamentally different from API harvesting.
It requires identifying specific papers for specific plants, extracting structured
values from unstructured text, and recording provenance carefully. This sub-phase
depends on Phase 2a sources being stable enough to know which plants to prioritise.

- Targeted search via PubMed Central and Europe PMC APIs
- Extract quantitative plant light data (DLI, PPFD, photoperiod thresholds)
  for a prioritised list of common garden plants
- Each extraction may be per-plant rather than a bulk list operation
- Store extracted values with full paper provenance (DOI, authors, publication date)
- This data feeds directly into Phase 3 calculations — it is not general harvesting

> **Deferred:** Automated full-text NLP extraction. Initial extraction will use
> abstract-level keyword matching. Deeper extraction can be added later.

---

## Phase 3 — Data Processing Pipeline

**Container 4: Data Cleaner (C++)**
- Normalise disparate source formats into a unified schema
- Data validation and quality checks
- Flag records for review rather than silent discard

**Container 5: Calculator (C++)**

First calculation target: **minimum, maximum, and ideal daily light hours per plant,
adapted to user location and season.**

- Convert qualitative light requirements ("full sun", "partial shade") to
  quantitative metrics (DLI — Daily Light Integral, mol/m²/day)
- Integrate NASA POWER API for location-specific solar radiation data
  (global coverage, free, includes DLI and UV data)
- Adapt plant light requirements to geographic location, season, and day length
- Output: hours of direct sun needed per day for a given plant at a given location and month

This forms the foundation for further calculations, including:

- Plant stress level indicators based on deviation from optimal light intake
- Photoperiod sensitivity flags (e.g. bolting risk with long days)
- UV stress thresholds where data permits

**Predictive modelling (target, later in phase):**

- Integrate historical weather data and week-ahead forecast data
- Model expected light accumulation over a coming week
- Output early stress warnings or suitability forecasts per plant

> **User profile:** A hardcoded test profile (`location`, `timezone`) will be used
> for all Phase 3 calculations. A real user profile system is not in scope until
> it is required by a calculation that cannot work without it.


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

## Deferred Decisions

These are known future concerns that are deliberately not being designed yet.
Each is deferred because the information needed to design them well does not
exist at the current stage.

**Source trustworthiness scoring**
Each source has different reliability characteristics, and relevance may vary
by user geography (e.g. USDA data is North America-centric; a Finnish user
needs European context). A trust scoring system will require multiple sources
to be integrated before the scoring variables are understood. For now, every
`raw_harvest` record stores `source`, `harvested_at`, and endpoint metadata,
which is sufficient to support scoring when the time comes.

**Deduplication across sources**
Cannot be designed until the unified schema from Phase 3 exists. Raw data
intentionally preserves all records including contradictions.

**Full dataset harvesting**
Deferred until Phase 3 is stable. Controlled by `PLANT_LIMIT` in the environment.

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

**Why defer full harvesting?**
Storing tens of thousands of raw records before having a processing pipeline
creates noise without value. Harvest size scales with pipeline readiness.
