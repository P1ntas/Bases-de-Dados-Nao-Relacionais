import requests

def clean_database(base_url, database_name, auth=None):
    endpoint = f"{base_url}/_api/database/{database_name}"
    
    try:
        # Get all collections in the database~
        headers = {"Authorization": "Basic cm9vdDo="} # cm9vdDo= -> Base64 encoding for root: 
        response = requests.delete(endpoint, headers=headers)
        
        if response.status_code == 200:
            print("Deleted database with success")
           
        else:
            for x in response:
                print(x)
            print(f"Failed to delete database. Status code: {response.status_code}")
    except Exception as e:
        print(f"Database doesnt exist")

if __name__ == "__main__":
    base_url = "http://localhost:8529"
    database_name = "IMDB"
    username = "root"
    password = ""  # Provide your password here if authentication is enabled

    auth = (username, password) if username and password else None

    # Clean the database
    clean_database(base_url, database_name, auth)
