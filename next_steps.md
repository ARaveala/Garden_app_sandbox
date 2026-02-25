# Next Steps

## Phase 2: Multi-Source Data Collection (Week 3-4)
- [ ] Add NASA POWER harvester for solar radiation data
- [ ] Test with 100 locations
- [ ] Store location-based climate data

## Phase 3: Data Processing (Week 5-6)
- [ ] Build cleaner (C++) to normalize USDA data
- [ ] Infer DLI ranges from qualitative descriptions
- [ ] Create structured plant_data table

## Phase 4: Calculation Engine (Week 7-8)
- [ ] Build calculator (C++) for DLI matching
- [ ] Algorithm: Compare plant needs vs location availability
- [ ] Output: Suitability scores and recommendations

## Phase 5: User Interface (Week 9+)
- [ ] User profile container (location, preferences)
- [ ] Query interface
- [ ] Recommendations engine

## Known Limitations
- USDA provides qualitative light data ("full sun") not quantitative (DLI)
- Requires inference or cross-referencing with research papers
- No comprehensive plant DLI database exists (yet)

## Research Questions
- How to accurately convert "full sun" to DLI ranges?
- Best approach for species distribution modeling?
- Legal considerations for plant recommendation system?