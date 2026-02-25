Government Plant Databases (Global)
Europe
1. Plants of the World Online (Kew Gardens, UK)

URL: https://powo.science.kew.org/
Coverage: 1.3 million plant species worldwide
Data: Taxonomy, distribution, descriptions
API: Yes! https://powo.science.kew.org/about-powo/developers
License: Open data
Quality: Very high - gold standard for taxonomy

2. Euro+Med PlantBase

URL: https://europlusmed.org/
Coverage: Europe + Mediterranean
Data: Taxonomy, distribution, status
API: No official API, but data downloadable
License: Free for non-commercial

3. Flora Europaea

Coverage: All European plants
Data: Descriptions, habitats
Access: Some digitized, scattered


Australia
4. Australia's Virtual Herbarium (AVH)

URL: https://avh.chah.org.au/
Coverage: Australian flora
Data: 9+ million specimen records
API: Yes
License: CC-BY


Canada
5. VASCAN (Database of Vascular Plants of Canada)

URL: http://data.canadensys.net/vascan/
Coverage: Canadian flora
Data: Taxonomy, distribution by province
API: Yes
License: CC0 (public domain)


Multi-National
6. GBIF (Global Biodiversity Information Facility)

URL: https://www.gbif.org/
Coverage: 2+ billion occurrence records globally
Data: Where plants actually grow (GPS coordinates)
API: Excellent, free
License: CC0 (public domain)
Use case: Species distribution modeling

7. POWO (covered above) - also multi-national

Research Paper Sources
1. Google Scholar

URL: https://scholar.google.com/
Coverage: All academic papers
API: Unofficial scraping (use carefully)
Best for: Finding specific plant research
Search tips:

  "Lactuca sativa" AND ("optimal PPFD" OR "light saturation")
  "Solanum lycopersicum" AND "photoperiod" AND "bolting"
2. PubMed Central (PMC)

URL: https://www.ncbi.nlm.nih.gov/pmc/
Coverage: Life sciences (includes horticulture)
API: Yes! Free
License: Many papers are open access
Best for: Physiological plant research

API Example:
https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?
db=pmc&term=lettuce+photoperiod&retmode=json
3. CORE (Open Access Research)

URL: https://core.ac.uk/
Coverage: 200+ million open access papers
API: Yes, free
License: Open access only
Best for: Finding free full-text papers

4. Europe PMC

URL: https://europepmc.org/
Coverage: European life sciences papers
API: Yes, excellent
License: Open access
Best for: European horticulture research

5. arXiv (for preprints)

URL: https://arxiv.org/
Coverage: Preprints (not peer-reviewed yet)
API: Yes
Best for: Cutting-edge research


Research Databases (Structured Data)
1. TRY Plant Trait Database (covered earlier)

280,000 species, quantitative traits
Request access (non-commercial free, commercial license available)

2. GRIN-Global

URL: https://npgsweb.ars-grin.gov/gringlobal/search
Coverage: USDA germplasm (but more detailed than Plants Database)
Data: Growth characteristics, some quantitative
No API, but web scraping possible

3. eFloras

URL: http://www.efloras.org/
Coverage: Flora of China, North America, Pakistan, etc.
Data: Detailed descriptions, some habitat info
No API

4. World Flora Online

URL: http://www.worldfloraonline.org/
Coverage: Global consensus flora
Data: Taxonomy, distributions
API: In development


Practical Approach: Multi-Source Harvesting Strategy
Phase 2A: Government Databases
Priority 1: GBIF (occurrence data)
javascript// Where does this plant actually grow?
fetch('https://api.gbif.org/v1/occurrence/search?scientificName=Abies+balsamea')
  .then(r => r.json())
  .then(data => {
    // Get lat/lon of all observations
    // Infer climate tolerance from where it grows
  });
Priority 2: Kew POWO (taxonomy & distribution)
javascript// Official plant names and where they're native
fetch('https://api.kew.org/powo/...')
Priority 3: Regional databases based on your target users

If targeting EU: Euro+Med PlantBase
If targeting North America: VASCAN + USDA
If targeting Australia: AVH


Phase 2B: Research Papers (Targeted)
Don't try to scrape all papers - it's not feasible.
Instead: Build a targeted research system

Identify high-value plants (common garden plants)
For each plant, search:

PubMed Central API
Europe PMC API
Google Scholar (manually)


Extract data from abstracts/full-text:

Look for keywords: "optimal", "PPFD", "light saturation", "photoperiod"
Use regex or simple NLP to extract numbers



Example workflow:
python# Search PubMed for lettuce light requirements
search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
params = {
    "db": "pmc",
    "term": "lettuce AND (optimal PPFD OR light saturation)",
    "retmode": "json"
}

results = requests.get(search_url, params=params).json()
paper_ids = results['esearchresult']['idlist']

# Fetch abstracts
for paper_id in paper_ids:
    fetch_abstract(paper_id)
    # Parse for numbers like "300 μmol/m²/s"

Recommended Data Collection Priority
Week 1-2: GBIF Harvester

Why first: Public domain, excellent API, global coverage
What it gives you: Species distribution (where plants actually grow)
Use case: Infer climate tolerance from native range

Week 3: Kew POWO Harvester

Why: Authoritative taxonomy, good API
What it gives you: Official names, synonyms, native ranges
Use case: Link different databases together

Week 4-5: Regional Database (pick one)

Euro+Med if targeting Europe
VASCAN if targeting Canada
AVH if targeting Australia

Week 6+: Targeted Research Scraping

Pick 20 high-value plants
Manually + semi-automatically extract from papers
Build up trait database incrementally


Data Linking Strategy
All these databases use different IDs, so you need to link them:
sqlCREATE TABLE plant_identifiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scientific_name VARCHAR(500),  -- Standard name (from POWO)
    
    -- Source-specific IDs
    usda_symbol VARCHAR(50),
    gbif_taxon_id BIGINT,
    powo_id VARCHAR(100),
    ipni_id VARCHAR(50),
    
    -- For linking
    synonyms JSON,  -- Alternative names
    
    UNIQUE KEY (scientific_name)
);
Use scientific name as the bridge between databases.