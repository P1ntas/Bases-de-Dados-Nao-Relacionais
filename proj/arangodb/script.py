import os
import requests
import json

# ArangoDB details
arango_url = "http://localhost:8529"
arango_db = "IMDB"

# Collection details
collections_data = {
    "users": {
        "type": "document",
        "file": "data/users.json",
        "name": "users"
    },
    "interactions": {
        "type": "edge",
        "files": "data/likes.json",
        "name": "likes"
    },
    "interactions": {
        "type": "edge",
        "file": "data/comments.json",
        "name": "comments"
    }
}

username = "root"
password = ""

def create_collection(collection_name, collection_type):
    collection_url = f"{arango_url}/_db/{arango_db}/_api/collection"
    collection_data = {
        "name": collection_name,
        "type": collection_type
    }
    response = requests.post(collection_url, json=collection_data, auth=(username, password))
    if response.status_code == 201:
        print(f"Collection '{collection_name}' created successfully")
    elif response.status_code == 409:
        print(f"Collection '{collection_name}' already exists")
    else:
        print(f"Failed to create collection '{collection_name}'. Status code: {response.status_code}")
        print(response.text)

def insert_documents(collection_name, file_path, data):
    collection_url = f"{arango_url}/_db/{arango_db}/_api/document/{collection_name}"
    with open(file_path, 'r') as file:
        data = json.load(file)[data]
    for item in data:
        response = requests.post(collection_url, json=item, auth=(username, password))
        if response.status_code == 201:
            print(f"Document inserted into collection '{collection_name}' successfully")
        else:
            print(f"Failed to insert document into collection '{collection_name}'. Status code: {response.status_code}")
            print(response.text)

# Create collections
for collection_name, collection_info in collections_data.items():
    create_collection(collection_name, collection_info["type"])
    if collection_info["type"] == "document":
        insert_documents(collection_name, collection_info["file"], collection_info["name"])
    elif collection_info["type"] == "edge":
            insert_documents(collection_name, collection_info["file"], collection_info["name"])
    