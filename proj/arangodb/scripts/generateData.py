import json
import random
from arango import ArangoClient
from datetime import datetime, timedelta


def generate_reactions(filepath, n, vertices, users):
    movies = vertices.all().batch()
    movie_ids = [movie['_id'] for movie in movies]
    users = users.all().batch()
    user_ids = [user['_id'] for user in users]
    reactions = []
    
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 5, 5)
    time_difference = end_date - start_date

    for user_id in user_ids:
        movies_to_react = random.sample(movie_ids, n)
        for movie_id in movies_to_react:
            random_seconds = random.randint(0, time_difference.days * 24 * 60 * 60) + time_difference.seconds * random.random()
            timestamp = start_date + timedelta(seconds=random_seconds)
            formatted_timestamp = timestamp.strftime("%m/%d/%Y %H:%M:%S")

            like = random.choice([1, 0])
            reactions.append({
                "_from": user_id,
                "_to": movie_id,
                "likes": like,
                "timestamp": formatted_timestamp,
                "$label": "reacts"
            })
    
    with open(filepath, 'w') as file:
        json.dump(reactions, file, indent=4)

def generate_comments(filepath, n, vertices, users):
    movies = vertices.all().batch()
    movie_ids = [movie['_id'] for movie in movies if movie['type'] == 'Movie']
    users = users.all().batch()
    user_ids = [user['_id'] for user in users]
    texts = [
        "Absolutely loved it! The plot twists were mind-blowing.",
        "A bit too slow for my taste, but the cinematography was stunning.",
        "Incredible performances all around. A must-watch for drama enthusiasts.",
        "Overhyped in my opinion. It was okay, but I expected more depth",
        "The soundtrack alone is worth the watch. Really adds to the atmosphere.",
        "Had me on the edge of my seat from start to finish. Brilliantly executed suspense.",
        "Felt a bit disjointed. Some scenes seemed unnecessary.",
        "A visual masterpiece. Every frame could be a painting.",
        "Not really for me. The storyline was a bit too predictable.",
        "Laughed till I cried. The comedic timing is impeccable.",
        "A true cinematic experience! The special effects were out of this world.",
        "Deeply moving and thought-provoking. Left me contemplating life for days.",
        "A fresh take on a classic genre. Refreshingly original.",
        "The chemistry between the leads was electrifying. Couldn't take my eyes off the screen.",
        "A rollercoaster of emotions. I laughed, I cried, I cheered.",
        "Visually stunning with a powerful message. A feast for the eyes and the soul.",
        "Intriguing storyline with unexpected twists at every turn",
        "Captivating from the very first scene. Gripped me until the credits rolled.",
        "A masterclass in storytelling. Every subplot seamlessly weaved together.",
        "Perfect blend of action and heart. Had me at the edge of my seat throughout"
    ]
    
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 5, 5)
    time_difference = end_date - start_date

    comments = []
    
    for user_id in user_ids:
        for _ in range(n):
            movie_id = random.choice(movie_ids)
            text = random.choice(texts)

            random_seconds = random.randint(0, time_difference.days * 24 * 60 * 60) + time_difference.seconds * random.random()
            timestamp = start_date + timedelta(seconds=random_seconds)
            formatted_timestamp = timestamp.strftime("%m/%d/%Y %H:%M:%S")

            comments.append({
                "_from": user_id,
                "_to": movie_id,
                "content": text,
                "timestamp": formatted_timestamp,
                "$label": "comments"
            })
    
    with open(filepath, 'w') as file:
        json.dump(comments, file, indent=4)

def generate_follows(filepath, n, users):
    users = users.all().batch()
    user_ids = [user['_id'] for user in users]
    follows = []
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 5, 5)

    time_difference = end_date - start_date
    for user_id in user_ids:
        possible_follows = [uid for uid in user_ids if uid != user_id]
        
        followed_users = random.sample(possible_follows, n)

        for follow_user_id in followed_users:
            random_seconds = random.randint(0, time_difference.days * 24 * 60 * 60) + time_difference.seconds * random.random()
            timestamp = start_date + timedelta(seconds=random_seconds)
            formatted_timestamp = timestamp.strftime("%m/%d/%Y %H:%M:%S")

            follows.append({
                "_from": user_id,
                "_to": follow_user_id,
                "timestamp": formatted_timestamp,
                "$label": "follows"
            })

    with open(filepath, 'w') as file:
        json.dump(follows, file, indent=4)


if __name__ == "__main__":

    client = ArangoClient(hosts="http://localhost:8529")

    sys_db = client.db("_system", username="root", password="")

    if not sys_db.has_database('IMDB'):
        print("Database not found")
    else:
        db = client.db("IMDB", username="root", password="")

    vertices = db.collection("imdb_vertices")
    users = db.collection("users")
    graph = db.graph("imdb")

    generate_reactions('./arangodb/data/reactions.json', 250, vertices, users)
    generate_comments('./arangodb/data/comments.json', 15, vertices, users)
    generate_follows('./arangodb/data/followers.json', 15, users)

