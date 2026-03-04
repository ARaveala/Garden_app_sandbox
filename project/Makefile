DOCKER_COMPOSE_FILE := srcs/docker-compose.yml

# Default target — show help when running bare make
.DEFAULT_GOAL := help

# Build all Docker images
build:
	docker-compose -f $(DOCKER_COMPOSE_FILE) build

# Start all containers (detached)
up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Stop and remove containers
down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

# Build and start, then show status
all: build up ps

# Restart all services
restart:
	docker-compose -f $(DOCKER_COMPOSE_FILE) restart

# Show status of running containers
ps:
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps

# Stream logs from all services
logs:
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

# Stream logs from harvester only
logs-harvester:
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f harvester

# Stream logs from database only
logs-db:
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f db

# Shell into harvester container
enter-harvester:
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec harvester sh

# Shell into user container
enter-user:
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec user sh

# Shell into database container
enter-db:
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec db sh

# Show most recent entries in raw_harvest table
db-query:
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec db \
		mariadb -u$${MYSQL_USER} -p$${MYSQL_PASSWORD} $${MYSQL_DATABASE} \
		-e "SELECT id, source, plant_identifier, data_type, harvested_at FROM raw_harvest ORDER BY id DESC LIMIT 10;"

# Start harvester and database only
harvester-up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d harvester db

# Start user display and database only
user-up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d user db

# Remove dangling images and unused volumes
clean:
	docker system prune -f --volumes

# Full clean — remove all stopped containers and images
fclean: clean
	@echo "Removing all stopped containers..."
	docker container prune -f
	@echo "Removing all Docker images..."
	docker image prune -a -f

# Tear down, full clean, wipe db volume, rebuild from scratch
reset: down fclean
	rm -rf srcs/requirements/db_data/*
	$(MAKE) all

# Show available targets
help:
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Core:"
	@echo "  all              Build, start, and show status"
	@echo "  build            Build Docker images"
	@echo "  up               Start all containers"
	@echo "  down             Stop and remove containers"
	@echo "  restart          Restart all services"
	@echo "  ps               Show container status"
	@echo ""
	@echo "Logs:"
	@echo "  logs             Stream logs from all services"
	@echo "  logs-harvester   Stream harvester logs only"
	@echo "  logs-db          Stream database logs only"
	@echo ""
	@echo "Debug:"
	@echo "  enter-harvester  Shell into harvester container"
	@echo "  enter-user       Shell into user container"
	@echo "  enter-db         Shell into database container"
	@echo "  db-query         Show latest 10 rows in raw_harvest"
	@echo ""
	@echo "Selective start:"
	@echo "  harvester-up     Start harvester + database only"
	@echo "  user-up          Start user display + database only"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean            Remove dangling images and unused volumes"
	@echo "  fclean           Full clean — all containers and images"
	@echo "  reset            Full teardown, wipe data, rebuild from scratch"
	@echo ""

.PHONY: build up down all restart ps logs logs-harvester logs-db \
        enter-harvester enter-user enter-db db-query \
        harvester-up user-up clean fclean reset help