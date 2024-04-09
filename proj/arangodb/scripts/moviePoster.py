import requests

arango_url = "http://localhost:8529"
db_name = "IMDB"
collection_name = "imdb_vertices"
username = "root"
password = ""

image_attribute = "imageUrl"

def getMoviePosters():

    headers = {
        "Authorization": "Basic " + (username + ":" + password).encode("base64").rstrip(),
        "Content-Type": "application/json"
    }

    url = f"{arango_url}/_db/{db_name}/_api/document/{collection_name}"

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        for document in response.json()["result"]:
            if document.get("type") == "Movie":
                new_attribute_value = f"https://www.myapifilms.com/imdb/idIMDB?idIMDB={document['imdbId']}&token=ce7119d2-fb30-4d9e-a51e-c87f7357acde"
                document[image_attribute] = new_attribute_value
                update_url = f"{arango_url}/_db/{db_name}/_api/document/{collection_name}/{document['_key']}"
                update_response = requests.put(update_url, headers=headers, json=document)
                if update_response.status_code == 200:
                    print(f"Attribute '{image_attribute}' added to document with _key: {document['_key']}")
                else:
                    print(f"Failed to update document with _key: {document['_key']}")
    else:
        print("Failed to retrieve documents from the collection.")

if __name__ == "__main__":
    getMoviePosters()
