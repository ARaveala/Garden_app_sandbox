# Garden sandbox

Plant Growth Data Harvester
A distributed data collection and processing system for gathering plant growth information from multiple sources to enable accurate, location-specific growing predictions.
Current Status: Phase 1 Complete ✓
Successfully implemented basic data pipeline: scrape → store → display
Architecture
Container 1: Harvester (Node.js + Playwright)

Web scraping from sources without public APIs
Currently targeting USDA Plants Database
Designed for extensibility to additional sources

Container 2: Database (MariaDB)

Raw data storage with JSON flexibility
Persistent volume management
Initialization scripts for schema setup

Container 3: User Display (C++)

Data retrieval and presentation
Demonstrates multi-language integration
Temporary implementation (will be refactored in Phase 3)

Roadmap
Phase 1: Proof of Concept ✅

 Three-container architecture
 Single plant data scraping (USDA)
 Database storage
 Data display via C++ container

Phase 2: Multi-Source Harvesting 🔄 (In Progress)

 Code refactoring and modular structure
 Multiple source scrapers for single plant
 Concurrent data collection
 Source abstraction layer

Phase 3: Data Processing Pipeline

 Container 4: Data Cleaner/Normalizer (C++)

Maps disparate source formats to unified schema
Handles data quality and validation


 Container 5: Calculator (C++)

Performs DLI (Daily Light Integral) calculations
Converts qualitative requirements (e.g., "full sun") to quantitative metrics
Adapts recommendations to geographic locations



Phase 4: Production Features

 Task queue system for scalable harvesting
 API layer for data access
 Automated scheduling and retry logic
 Monitoring and logging

Technical Decisions
Why Playwright for scraping?
USDA and many plant databases don't provide public APIs and render content client-side with JavaScript. Playwright handles this where simple HTTP requests cannot.
Why C++ for processing?

Demonstrates polyglot architecture skills
Legitimately faster for computational workloads (millions of calculations)
Shows systems programming capability
Employment market differentiation (Finnish context)

Why separate containers?

Separation of concerns (scraping vs processing vs display)
Independent scaling of components
Language-specific optimization per task
Easier testing and development

Project Goals

Technical: Build a production-ready data pipeline demonstrating:

Distributed systems architecture
Multi-language integration
Concurrent processing
Data normalization from heterogeneous sources


Domain: Solve the problem of vague plant care instructions:

"Full sun" means different things in Ecuador vs Finland
Convert qualitative requirements to measurable hours/intensity
Provide location-specific, actionable growing advice



Setup
bashmake build  # Build all containers
make up     # Start services
make logs   # View output
Current Limitations

Single plant scraping only
No deduplication logic
Manual data inspection required
Restart policies cause data duplication (being addressed in Phase 2)