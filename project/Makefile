DOCKER_COMPOSE_FILE := srcs/docker-compose.yml

##### docker exec -it plant_db mysql -u plantuser -pplantpass plants -e "SELECT * FROM raw_harvest;"
##to vberify data in db 

##setup:
##	mkdir -p ./volumes/db-data
##	chmod 755 ./volumes/db-data

# Target to create the custom network
#start-network:
#	@docker network inspect custom-network >/dev/null 2>&1 || docker network create inceptionnet
# Build the Docker images defined in the Dockerfile
build:
	docker-compose -f $(DOCKER_COMPOSE_FILE) build

# Start services defined in docker-compose.yml added as fail safe to start network
up: #start-network
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Stop and remove services, cleanup
down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

enter-harvester:
	docker exec -it harvester sh

enter-user:
	docker exec -it user sh

enter-mariadb:
	docker exec -it mariadb sh

# Show status of containers managed by docker-compose (only running)
ps:
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps

# Restart all services
restart:
	docker-compose -f $(DOCKER_COMPOSE_FILE) restart

clean_redo: down fclean 
	rm -rf srcs/requirements/db_data/*
	make all
# Run Docker Container new and not tested yet
#run:
#    docker run --env-file /path/to/your/.env -d --name wordpress-container wordpress

# Run tests if any are defined
#test:
#	docker-compose -f $(DOCKER_COMPOSE_FILE) run --rm test

# View logs of the running services in real time
logs:
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

# Clean dangling images and unused volumes
clean:
	docker system prune -f --volumes

# View logs for the Nginx service in real time
##logs-nginx:
##	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f nginx


# Full clean: includes `clean` and removes images and stopped containers
fclean: clean
	@echo "Removing all stopped containers..."
	docker container prune -f
	@echo "Removing all Docker images..."
	docker image prune -a -f
# Clear logs
##clear-logs:
##	docker exec -it $(docker ps -q -f "name=nginx") sh -c 'cd /var/log/nginx && 

# Default target, builds and starts services, and shows status
all: build up ps

# Help message
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build	 - Build Docker images"
	@echo "  up		- Start Docker containers"
	@echo "  down	  - Stop Docker containers"
	@echo "  ps		- Show Docker containers status"
	@echo "  restart   - Restart Docker containers"
	@echo "  test	  - Run tests (if defined)"
	@echo "  logs	  - Show Docker containers logs"
	@echo "  clean	 - Remove dangling images and unused volumes"
	@echo "  fclean	- Full clean: remove all stopped containers and images"
	@echo "  all	   - Build, start, and show status of Docker containers"
	@echo "  help	  - Show this help message"

.PHONY: build up down ps restart test logs clean  all help
#	@echo "  logs-nginx - Show logs for Nginx service"
