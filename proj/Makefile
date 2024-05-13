.DEFAULT_GOAL := help

.PHONY: build clean seed down run

POPULATE := ./arangodb/scripts/populate.py
CLEAN_DB := ./arangodb/scripts/cleanDatabase.py
CREATE_VIEWS := ./arangodb/scripts/createViews.py


USERS := ./arangodb/data/users.json
REACTIONS := ./arangodb/data/reactions.json
COMMENTS := ./arangodb/data/comments.json
FOLLOWS := ./arangodb/data/followers.json

DB_NAME := IMDB

build:
	sudo docker compose up -d --build

clean:
	python3 ${CLEAN_DB}
	
seed:
	python3 ${POPULATE} --database ${DB_NAME} --collection users --type document --file-path ${USERS}
	python3 ${POPULATE} --database ${DB_NAME} --collection reactions --type edge --file-path ${REACTIONS}
	python3 ${POPULATE} --database ${DB_NAME} --collection comments --type edge --file-path ${COMMENTS}
	python3 ${POPULATE} --database ${DB_NAME} --collection follows --type edge --file-path ${FOLLOWS}
	python3 ${CREATE_VIEWS}

down: clean
	sudo docker compose down

help:
	@echo "Available commands:"
	@echo "  build       : Build the Docker Compose project"
	@echo "  clean       : Clean the database"
	@echo "  seed     	 : Create DB and Load data into the database"
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
