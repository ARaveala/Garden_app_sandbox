# Garden Sandbox

A multi-container data pipeline for collecting and storing plant growth data from external sources.
The long term goal is a location aware plant predictive modeling for plant growth/care, this pipeline is the data foundation for that.
Built with Docker, Node.js, and C++.

This is an active prototype — Phase 1 is complete and working. See [ROADMAP.md](./ROADMAP.md) for planned development.

---

## Architecture

```
[ Harvester ]  ──→  [ MariaDB ]  ──→  [ User / Display ]
  Node.js              raw data           C++ client
  USDA API             persistent
                       volume
```

Three containers communicate over a private bridge network (`mycelium_network`). Data persists through a named volume mapped to the host.

**Harvester** (Node.js)
- Fetches plant data from the USDA Plants Database via its public API
- Stores raw JSON responses in MariaDB
- Base/subclass harvester pattern for adding new sources

**Database** (MariaDB)
- Stores raw harvested data as JSON in a flexible schema
- Unique constraint prevents duplicate entries per source/plant/type
- Initialised via `init.sql` on first run

**User / Display** (C++)
- Connects to MariaDB and retrieves the most recent harvest entry
- Placeholder implementation — will be replaced by a data cleaner and calculator in Phase 3

---

## Technologies

- Docker & Docker Compose
- Node.js (ESM) with async/await
- Pino structured logging (configurable pretty/JSON output)
- MariaDB with JSON column storage
- C++ with MariaDB connector

---

## Setup

**1. Clone the repo**
```bash
git clone <repo_url>
cd garden_sandbox
```

**2. Configure environment**
```bash
cp project/srcs/.env.example project/srcs/.env
```
Fill in your values — see `.env.example` for all required variables and descriptions.
Note: trefle account required https://trefle.io

**3. Build and start**
```bash
make build
make up
```

**4. View output**
```bash
make logs
```

For all available make targets run `make help`.

---

## Project Status

**Phase 1 complete** — single source harvest pipeline working end to end:
- USDA Plants Database harvested via API
- Raw data stored in MariaDB
- C++ client retrieves and displays latest record
- Structured logging with per-module log files

Active development continues in Phase 2. See [ROADMAP.md](./ROADMAP.md).

---

## License

MIT