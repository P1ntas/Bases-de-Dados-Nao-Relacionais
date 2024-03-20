from arango import ArangoClient
import csv
import uuid

client = ArangoClient(hosts="http://localhost:8529")

sys_db = client.db("_system", username="root", password="")

if not sys_db.has_database('IMDB'):
    print("Database not found")
else:
    db = client.db("IMDB", username="root", password="")

vertices = db.collection("imdb_vertices")
edges = db.collection("imdb_edges")
graph = db.graph("imdb")
edge_def = graph.edge_collection("imdb_edges")


class MovieRecord:
    def __init__(self, id, name, year, song_name, written_by, performed_by, composed_by, lyrics_by, written_performed_by, music_by, courtesy_of, conducted_by, libretto_by, under_license_from):
        self._key = str(int(id) + 90000)
        self.name = name
        self.year = year
        self.song_name = song_name
        self.written_by = written_by
        self.performed_by = performed_by
        self.composed_by = composed_by
        self.lyrics_by = lyrics_by
        self.written_performed_by = written_performed_by
        self.music_by = music_by
        self.courtesy_of = courtesy_of
        self.conducted_by = conducted_by
        self.libretto_by = libretto_by
        self.under_license_from = under_license_from

    def to_dict(self):
        return self.__dict__

    def __str__(self):
        return f"{self._key}, {self.name}, {self.year}, {self.song_name}, {self.written_by}, {self.performed_by}, {self.composed_by}, {self.lyrics_by}, {self.written_performed_by}, {self.music_by}, {self.courtesy_of}, {self.conducted_by}, {self.libretto_by}, {self.under_license_from}"

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


def read_csv_to_objects(filepath):
    records = []
    id = 1
    with open(filepath, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            record = MovieRecord(
                id=row[''],
                name=row['name'],
                year=row['year'],
                song_name=row['song_name'],
                written_by=row['written_by'],
                performed_by=row['performed_by'],
                composed_by=row['composed_by'],
                lyrics_by=row['lyrics_by'],
                written_performed_by=row['written_performed_by'],
                music_by=row['music_by'],
                courtesy_of=row['courtesy_of'],
                conducted_by=row['conducted_by'],
                libretto_by=row['libretto_by'],
                under_license_from=row['under_license_from']
            )
            metadata = vertices.insert(record.to_dict())
            assert metadata['_id'] == 'imdb_vertices/' + record._key
            assert metadata['_key'] == record._key
            q = vertices.find({'title': record.name})
            if not q.empty():
                movie = q.batch()
                edge = DatabaseEdge(id, movie[0]['_id'], "imdb_vertices/" + str(record._key), "has_song")
                metadata = edge_def.insert(edge.to_dict())
                assert metadata['_key'] == edge._key
                id += 1

if __name__ == "__main__":
    filepath = 'sound_track_imdb_top_250_movie_tv_series.csv'
    records = read_csv_to_objects(filepath)
    #print(edge_def.edges('imdb_vertices/3372', direction='out'))
    #print(edge_def.edges('imdb_vertices/6746', direction='out'))