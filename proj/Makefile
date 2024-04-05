.DEFAULT_GOAL := help

.PHONY: build clean seed down run

POPULATE := ./arangodb/scripts/populate.py
CLEAN_DB := ./arangodb/scripts/cleanDatabase.py

USERS := ./arangodb/data/users.json
DB_NAME := IMDB

build:
	docker compose up -d --build

clean:
	python ${CLEAN_DB}
	
seed:
	python ${POPULATE} --database ${DB_NAME} --collection Users --type document --file-path ${USERS}

down:
	docker compose down

help:
	@echo "Available commands:"
	@echo "  build       : Build the Docker Compose project"
	@echo "  clean       : Clean the database removing all docs"
	@echo "  seed     	 : Create DB and Load all data into the database"
	@echo "  down        : Shut down the Docker Compose project"
	@echo "  run         : Shut down, build, and load data into the database"
	@echo "  help        : Show this help message"

run: down build
	@echo "Waiting for build to complete..."
	@sleep 10  # Wait for 10 seconds
	@echo "Build completed, loading data into the database..."
	@make seed
