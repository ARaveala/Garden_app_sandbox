# Legal & Data Licensing

## Current Status

This project is a prototype and is not intended for commercial use.

---

## Data Sources

### USDA Plants Database

Plant data is sourced from the USDA Plants Database, which is explicitly free for any use:

> "Our plant information, including the distribution maps, lists, and text, is not copyrighted and is free for any use."
> — [USDA PLANTS Help Document](https://plants.sc.egov.usda.gov/DocumentLibrary/Pdf/PLANTS_Help_Document_2022.pdf)

**Citation (required):**
> USDA, NRCS. The PLANTS Database (http://plants.usda.gov). National Plant Data Team, Greensboro, NC USA.


### Trefle

This project retrieves plant data from the Trefle API.  
The Trefle API software is licensed under the **GNU Affero General Public License v3 (AGPL‑3.0)**.  
This project does **not** use or redistribute any portion of the Trefle API source code; it only consumes publicly available API data.  
The AGPL‑3.0 license applies to the Trefle software itself and does **not** restrict the use or redistribution of the plant data returned by the API.

**Citation (required):**  
> Trefle API. Open plant data API. https://github.com/treflehq/trefle-api.

**Note:**  
Trefle aggregates plant information from multiple open data sources.  
Users should refer to Trefle’s documentation for details on upstream data licensing.


---

## Future Data Sources

Additional sources are planned for later phases (see [ROADMAP.md](./ROADMAP.md)). Each new source will be audited for licensing before integration. Sources requiring commercial licenses will either be replaced with open alternatives or licensed appropriately before any commercial use.

---

## Project License

The code in this repository is licensed under the MIT License — see [LICENSE](./LICENSE) for details.
Data collected and stored by this pipeline remains subject to the terms of its original source.