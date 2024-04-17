.DEFAULT_GOAL := help

.PHONY: build clean seed down run

POPULATE := ./arangodb/scripts/populate.py
CLEAN_DB := ./arangodb/scripts/cleanDatabase.py


USERS := ./arangodb/data/users.json
REACTIONS := ./arangodb/data/reactions.json
COMMENTS := ./arangodb/data/comments.json

DB_NAME := IMDB

build:
	sudo docker compose up -d --build

clean:
	python3 ${CLEAN_DB}
	
seed:
	python3 ${POPULATE} --database ${DB_NAME} --collection Users --type document --file-path ${USERS}
	python3 ${POPULATE} --database ${DB_NAME} --collection Interactions --type edge --file-path ${REACTIONS}
	python3 ${POPULATE} --database ${DB_NAME} --collection Interactions --type edge --file-path ${COMMENTS}


down:
	sudo docker compose down

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
ifeq ($(OS),Windows_NT)
	@timeout /t 15 > nul
else
	@sleep 15
endif
	@echo "Build completed, loading data into the database..."
	@make seed
