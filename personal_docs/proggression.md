run npm install inside src/requirements/harvester to update json package lock

docker exec -it plant_db mysql -utestuser -p${MYSQL_PASSWORD} plant_db -e "SHOW TABLES;"

-- Show tables
SHOW TABLES;

-- Describe table
DESCRIBE raw_harvest;

-- See all data
SELECT * FROM raw_harvest;

-- Pretty print JSON
SELECT id, plant_name, JSON_PRETTY(raw_json) FROM raw_harvest;

-- Filter by source
SELECT * FROM raw_harvest WHERE source = 'usda';

-- Exit
EXIT;

db-shell:
	docker exec -it plant_db bash

db-connect:
	docker exec -it plant_db mariadb -uroot -prootpass plant_db

db-tables:
	docker exec -it plant_db mariadb -uroot -prootpass plant_db -e "SHOW TABLES;"

db-data:
	docker exec -it plant_db mariadb -uroot -prootpass plant_db -e "SELECT * FROM raw_harvest;"

db-count:
	docker exec -it plant_db mariadb -uroot -prootpass plant_db -e "SELECT COUNT(*) FROM raw_harvest;"

db-clear:
	docker exec -it plant_db mariadb -uroot -prootpass plant_db -e "TRUNCATE TABLE raw_harvest;"

	harvest:
	docker-compose -f srcs/docker-compose.yml run --rm harvester

display:
	docker-compose -f srcs/docker-compose.yml run --rm user

test: harvest dis