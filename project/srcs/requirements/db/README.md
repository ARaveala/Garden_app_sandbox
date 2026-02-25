# raw harvester
collects raw data, there may be irrelevant data in there too but , irrelevence is yet to be determined 

missing from raw harvester key to state that data has been integrated by cleaner 

This should be added and kept as another type of raw harvest simply because it collects a very different type od ata ? 
CREATE TABLE research_extractions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plant_scientific_name VARCHAR(500),
    paper_id VARCHAR(100),
    trait_type VARCHAR(100),  -- 'optimal_temp', 'ppfd', 'ph_range'
    extracted_text TEXT,      -- The actual sentence/paragraph
    extracted_value JSON,     -- Parsed numbers/values
    confidence DECIMAL(3,2),  -- 0.0-1.0
    created_at TIMESTAMP
);