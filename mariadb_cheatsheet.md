# how to discover how much space is occupied

docker exec -it plant_db mariadb -uroot -p${MYSQL_ROOT_PASSWORD} -e "
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'plant_db'
GROUP BY table_schema;
"

# check individual table size 

docker exec -it plant_db mariadb -uroot -p${MYSQL_ROOT_PASSWORD} -e "
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
  table_rows AS 'Rows'
FROM information_schema.tables
WHERE table_schema = 'plant_db'
ORDER BY (data_length + index_length) DESC;
"

# notes : 

compress old raw data , perhaps 3 months old into sql lite , and archive , this is easly accesible later down the line 