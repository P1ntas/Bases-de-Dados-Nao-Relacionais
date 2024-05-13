import uuid
from arango import ArangoClient


if __name__ == "__main__":

    client = ArangoClient(hosts="http://localhost:8529")

    sys_db = client.db("_system", username="root", password="")

    if not sys_db.has_database('IMDB'):
        print("Database not found")
    else:
        db = client.db("IMDB", username="root", password="")

    users = db.collection('users')
    index = users.add_persistent_index(fields=['username'])
    #index = users.add_geo_index(fields=['geometry'], geo_json=True)


    db.create_analyzer(
        name='text_analyzer',
        analyzer_type='text',
        properties={
            'locale': 'en',
            'case': 'lower',
            'accent': False,
            'stemming': False,
            'normalization': True
        },
        features=[]
    )
    # Define the view characteristics
    movie_view_definition = {
        "writebufferSizeMax": 33554432,
        "id": "442",
        "storedValues": [],
        "name": "movieView",
        "type": "arangosearch",
        "consolidationPolicy": {
            "type": "tier",
            "segmentsBytesFloor": 2097152,
            "segmentsBytesMax": 5368709120,
            "segmentsMax": 10,
            "segmentsMin": 1,
            "minScore": 0
        },
        "writebufferActive": 0,
        "links": {
            "imdb_vertices": {
                "analyzers": ["text_analyzer"],
                "fields": {
                    "title": {"analyzers": ["text_en"]},
                    "description": {"analyzers": ["text_en"]}
                },
                "includeAllFields": False,
                "storeValues": "none",
                "trackListPositions": False
            }
        },
        "commitIntervalMsec": 1000,
        "consolidationIntervalMsec": 10000,
        "globallyUniqueId": "c16032914/",
        "cleanupIntervalStep": 2,
        "primarySort": [],
        "primarySortCompression": "lz4",
        "writebufferIdle": 64
    }

    # Create the view
    db.create_arangosearch_view(name=movie_view_definition['name'], properties=movie_view_definition)

    db.create_analyzer(
        name='name_analyzer',
        analyzer_type='text',
        properties={
            'locale': 'en',
            'tokenizer': 'white',
            'case': 'lower',
            'accent': False,
            'stemming': False,
            'stopwords': []
        },
        features=[]
    )
    person_view_definition = {
        "writebufferSizeMax": 33554432,
        "id": "443",
        "storedValues": [],
        "name": "personView",
        "type": "arangosearch",
        "consolidationPolicy": {
            "type": "tier",
            "segmentsBytesFloor": 2097152,
            "segmentsBytesMax": 5368709120,
            "segmentsMax": 10,
            "segmentsMin": 1,
            "minScore": 0
        },
        "writebufferActive": 0,
        "links": {
            "imdb_vertices": {
                "analyzers": ["name_analyzer"],
                "fields": {
                    "name": {"analyzers": ["name_analyzer"]}
                },
                "includeAllFields": False,
                "storeValues": "none",
                "trackListPositions": False
            }
        },
        "commitIntervalMsec": 1000,
        "consolidationIntervalMsec": 10000,
        "globallyUniqueId": "c16032914/",
        "cleanupIntervalStep": 2,
        "primarySort": [],
        "primarySortCompression": "lz4",
        "writebufferIdle": 64
    }
    unique_id = str(uuid.uuid4())

    # Update the globally unique identifier in the view definition
    person_view_definition["globallyUniqueId"] = unique_id

    # Create the view
    db.create_arangosearch_view(name=person_view_definition['name'], properties=person_view_definition)

    users_view_definition = {
        "writebufferSizeMax": 33554432,
        "id": "444",
        "storedValues": [],
        "name": "userView",
        "type": "arangosearch",
        "consolidationPolicy": {
            "type": "tier",
            "segmentsBytesFloor": 2097152,
            "segmentsBytesMax": 5368709120,
            "segmentsMax": 10,
            "segmentsMin": 1,
            "minScore": 0
        },
        "writebufferActive": 0,
        "links": {
            "users": {
                "analyzers": ["name_analyzer"],
                "fields": {
                    "name": {"analyzers": ["name_analyzer"]},
                    "username": {"analyzers": ["name_analyzer"]}
                },
                "includeAllFields": False,
                "storeValues": "none",
                "trackListPositions": False
            }
        },
        "commitIntervalMsec": 1000,
        "consolidationIntervalMsec": 10000,
        "globallyUniqueId": "c16032914/",
        "cleanupIntervalStep": 2,
        "primarySort": [],
        "primarySortCompression": "lz4",
        "writebufferIdle": 64
    }
    
    users_unique_id = str(uuid.uuid4())
    users_view_definition["globallyUniqueId"] = users_unique_id
    db.create_arangosearch_view(name=users_view_definition['name'], properties=users_view_definition)

