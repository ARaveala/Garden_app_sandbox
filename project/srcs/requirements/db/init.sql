-- apparently i can store entire jsons in text fields, 
-- so i can store the entire plant object as json in the database, and then parse it when i need to use it
-- do i want to do that , or do i want to do mapping of the plant object to the database fields ?

CREATE TABLE IF NOT EXISTS raw_harvest
(
    id INT AUTO_INCREMENT PRIMARY KEY ,
    source VARCHAR(50) NOT NULL,
    plant_identifier VARCHAR(255) NOT NULL, -- or  if i want to limit the length of the plant identifier
    data_type VARCHAR(255) NOT NULL, -- or VARCHAR(255) if i want to limit the length of the data type
	raw_json JSON, -- or BLOB if i want to store the raw json as a blob or JSON if i want to store it as text
	harvested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
