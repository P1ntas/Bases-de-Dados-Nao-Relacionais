import requests

def clean_database(base_url, database_name):
    endpoint = f"{base_url}/_db/{database_name}/_api/collection"
    
    try:
        # Get all collections in the database
        response = requests.get(endpoint)
        
        if response.status_code == 200:
            collections = response.json()["result"]
            for collection in collections:
                # Delete each collection
                collection_name = collection["name"]
                delete_collection_endpoint = f"{base_url}/_db/{database_name}/_api/collection/{collection_name}"
                delete_response = requests.delete(delete_collection_endpoint)
                if delete_response.status_code == 200:
                    print(f"Collection '{collection_name}' deleted successfully.")
                else:
                    print(f"Failed to delete collection '{collection_name}'. Status code: {delete_response.status_code}")
        else:
            print(f"Failed to fetch collections. Status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    base_url = "http://localhost:8529"
    
    database_name = "IMDB"
    
    # Clean the database
    clean_database(base_url, database_name)
