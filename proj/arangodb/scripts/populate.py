import requests
import json
import argparse
import uuid
import random
from arango import ArangoClient
from datetime import datetime, timedelta

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

class DatabaseEdge:
    def __init__(self, key, from_vertex, to_vertex, label):
        self._key = str(250000 + int(key))
        self._id = "imdb_edges/" + str(self._key)
        self._from = from_vertex
        self._to = to_vertex
        self._rev = f"_{uuid.uuid4().hex}-"
        self.label = label

    def to_dict(self):
        return {
            "_key": self._key,
            "_id": self._id,
            "_from": self._from,
            "_to": self._to,
            "_rev": self._rev,
            "$label": self.label 
        }

class DatabaseEdgeComments:
    def __init__(self, key, from_vertex, to_vertex, label, comment, timestamp):
        self._key = str(250000 + int(key))
        self._id = "imdb_edges/" + str(self._key)
        self._from = from_vertex
        self._to = to_vertex
        self._rev = f"_{uuid.uuid4().hex}-"
        self.label = label
        self.comment = comment
        self.timestamp = timestamp

    def to_dict(self):
        return {
            "_key": self._key,
            "_id": self._id,
            "_from": self._from,
            "_to": self._to,
            "_rev": self._rev,
            "$label": self.label, 
            "content": self.comment,
            "timestamp": self.timestamp
        }

def populate_likes(filepath, edge_def):

    with open(filepath, 'r') as file:
        data = json.load(file)
    id = 1
    for item in data:
        edge = DatabaseEdge(id, item['_from'], item['_to'], item['like'])
        metadata = edge_def.insert(edge.to_dict())
        assert metadata['_key'] == edge._key
        id += 1

def populate_comments(filepath, edge_def):
    with open(filepath, 'r') as file:
        data = json.load(file)
    id = 251000

    for item in data:
        edge = DatabaseEdgeComments(id, item['_from'], item['_to'], "comments", item['content'], item['timestamp'])
        metadata = edge_def.insert(edge.to_dict())
        assert metadata['_key'] == edge._key
        id += 1

def generate_reactions(filepath, n, vertices, users):
    movies = vertices.all().batch()
    movie_ids = [movie['_id'] for movie in movies]
    users = users.all().batch()
    user_ids = [user['_id'] for user in users]
    reactions = []
    
    for user_id in user_ids:
        for _ in range(n):
            movie_id = random.choice(movie_ids)
            like = random.choice([1, 0])

            reactions.append({
                "_from": user_id,
                "_to": movie_id,
                "like": like,
                "$label": "reacts"
            })
    
    with open(filepath, 'w') as file:
        json.dump(reactions, file, indent=4)

def generate_comments(filepath, n, vertices, users):
    movies = vertices.all().batch()
    movie_ids = [movie['_id'] for movie in movies if movie['type'] == 'Movie']
    users = users.all().batch()
    user_ids = [user['_id'] for user in users]
    texts = ["Absolutely loved it! The plot twists were mind-blowing.", 
             "A bit too slow for my taste, but the cinematography was stunning.",
             "Incredible performances all around. A must-watch for drama enthusiasts.",
             "Overhyped in my opinion. It was okay, but I expected more depth.",
             "The soundtrack alone is worth the watch. Really adds to the atmosphere.",
             "Had me on the edge of my seat from start to finish. Brilliantly executed suspense.",
             "Felt a bit disjointed. Some scenes seemed unnecessary.",
             "A visual masterpiece. Every frame could be a painting."
             "Not really for me. The storyline was a bit too predictable.",
             "Laughed till I cried. The comedic timing is impeccable."]
    
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 5, 1)

    time_difference = end_date - start_date

    random_seconds = random.randint(0, time_difference.days * 24 * 60 * 60) + time_difference.seconds * random.random()

    comments = []
    
    for user_id in user_ids:
        for _ in range(n):
            movie_id = random.choice(movie_ids)
            text = random.choice(texts)

            comments.append({
                "_from": user_id,
                "_to": movie_id,
                "content": text,
                "timestamp":str(start_date + timedelta(seconds=random_seconds)),
                "$label": "comments"

            })
    
    with open(filepath, 'w') as file:
        json.dump(comments, file, indent=4)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Send products to Arangodb')
    parser.add_argument('--database', type=str, help='Arangodb database name', required=True)
    parser.add_argument('--collection', type=str, help='Arangodb collection name', required=True)
    parser.add_argument('--type', type=str, help='Type of collection', required=True)
    parser.add_argument('--file-path', type=str, help='JSON file containing data', required=True)
    args = parser.parse_args()

    populate_db(args.database, args.collection, args.type, args.file_path)

    client = ArangoClient(hosts="http://localhost:8529")

    sys_db = client.db("_system", username="root", password="")

    if not sys_db.has_database('IMDB'):
        print("Database not found")
    else:
        db = client.db("IMDB", username="root", password="")

    vertices = db.collection("imdb_vertices")
    users = db.collection("Users")
    edges = db.collection("imdb_edges")
    graph = db.graph("imdb")
    edge_def = graph.edge_collection("imdb_edges")

    generate_reactions('./arangodb/data/reactions.json', 5, vertices, users)
    generate_comments('./arangodb/data/comments.json', 5, vertices, users)

    if graph.has_vertex_collection('Users'):
        test = graph.vertex_collection('Users')
    else:
        test = graph.create_vertex_collection('Users')

    populate_likes('./arangodb/data/reactions.json', edge_def)

    populate_comments('./arangodb/data/comments.json', edge_def)
