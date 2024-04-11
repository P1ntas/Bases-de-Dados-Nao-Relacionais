from arango import ArangoClient
import uuid
import json
import random
from datetime import datetime, timedelta

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

def generate_comments(filepath, n):
    movies = vertices.all().batch()
    movie_ids = [movie['_id'] for movie in movies if movie['type'] == 'Movie']
    global users
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
            like = random.choice(texts)

            comments.append({
                "_from": user_id,
                "_to": movie_id,
                "content": like,
                "timestamp":str(start_date + timedelta(seconds=random_seconds))
            })
    
    with open(filepath, 'w') as file:
        json.dump(comments, file, indent=4)

def populate_comments(filepath):
    with open(filepath, 'r') as file:
        data = json.load(file)
    id = 251000

    for item in data:
        edge = DatabaseEdge(id, item['_from'], item['_to'], item['content'])
        metadata = edge_def.insert(edge.to_dict())
        assert metadata['_key'] == edge._key
        id += 1
   

if __name__ == "__main__":
    filepath = '../data/comments.json'

    if graph.has_vertex_collection('Users'):
        test = graph.vertex_collection('Users')
    else:
        test = graph.create_vertex_collection('Users')
    
    #generate_comments(filepath, 5)
    populate_comments(filepath)
    
    