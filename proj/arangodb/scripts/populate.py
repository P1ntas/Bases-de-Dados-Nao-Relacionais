import requests
import json
import argparse

username = "root"
password = ""

def populate_db(database_name, collection_name, collection_type, file_path):
    creation_url = f"http://localhost:8529/_db/{database_name}/_api/collection"
    collection_data = {
        "name": collection_name,
        "type": collection_type
    }
    response = requests.post(creation_url, json=collection_data, auth=(username, password))
    if (response.status_code == 201 or response.status_code == 200 or response.status_code == 202):
        print(f"Collection '{collection_name}' created successfully")
    elif response.status_code == 409:
        print(f"Collection '{collection_name}' already exists")
    else:
        print(f"Failed to create collection '{collection_name}'. Status code: {response.status_code}")

    collection_url = f"http://localhost:8529/_db/{database_name}/_api/document/{collection_name}"

    with open(file_path, 'r') as file:
        data = json.load(file)
    for item in data:
        response = requests.post(collection_url, json=item, auth=(username, password))
        if (response.status_code == 201 or response.status_code == 200 or response.status_code == 202):
            print(f"Document inserted into collection '{collection_name}' successfully")
        else:
            print(f"Failed to insert document into collection '{collection_name}'. Status code: {response.status_code}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Send products to Arangodb')
    parser.add_argument('--database', type=str, help='Arangodb database name', required=True)
    parser.add_argument('--collection', type=str, help='Arangodb collection name', required=True)
    parser.add_argument('--type', type=str, help='Type of collection', required=True)
    parser.add_argument('--file-path', type=str, help='JSON file containing data', required=True)
    args = parser.parse_args()

    populate_db(args.database, args.collection, args.type, args.file_path)
