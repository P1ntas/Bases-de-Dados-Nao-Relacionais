from arango import ArangoClient
import uuid
import json
import random

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

def generate_reactions(filepath, n):
    movies = vertices.all().batch()
    movie_ids = [movie['_id'] for movie in movies]
    global users
    users = users.all().batch()
    user_ids = [user['_id'] for user in users]
    reactions = []
    
    for user_id in user_ids:
        for _ in range(n):
            movie_id = random.choice(movie_ids)
            like = random.choice("Likes", "Dislikes")

            reactions.append({
                "_from": user_id,
                "_to": movie_id,
                "like": like
            })
    
    with open(filepath, 'w') as file:
        json.dump(reactions, file, indent=4)

def populate_likes(filepath):
    with open(filepath, 'r') as file:
        data = json.load(file)
    id = 1

    for item in data:
        edge = DatabaseEdge(id, item['_from'], item['_to'], item['like'])
        metadata = edge_def.insert(edge.to_dict())
        assert metadata['_key'] == edge._key
        id += 1
   

if __name__ == "__main__":
    filepath = '../data/reactions.json'

    if graph.has_vertex_collection('Users'):
        test = graph.vertex_collection('Users')
    else:
        test = graph.create_vertex_collection('Users')
    
    #generate_reactions(filepath, 5)
    populate_likes(filepath)
    
    