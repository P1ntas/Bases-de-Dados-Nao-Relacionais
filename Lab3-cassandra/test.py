from cassandra.cluster import Cluster
from uuid import uuid4
from datetime import datetime

cluster = Cluster()
session = cluster.connect('bookit')

def initialize_keyspace():
    session.execute("""
    CREATE KEYSPACE IF NOT EXISTS bookit WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
    """)
    session.execute("USE bookit")

def add_bookmark(url, tags):
    bookmark_id = uuid4()
    created_at = datetime.now()

    session.execute(
        """
        INSERT INTO bookmarks (id, url, created_at) VALUES (%s, %s, %s)
        """,
        (bookmark_id, url, created_at)
    )

    for tag in tags:
        session.execute(
            """
            INSERT INTO bookmark_tags (bookmark_id, tag) VALUES (%s, %s)
            """,
            (bookmark_id, tag)
        )
        session.execute(
            """
            INSERT INTO tag_bookmarks (tag, bookmark_id) VALUES (%s, %s)
            """,
            (tag, bookmark_id)
        )
    return bookmark_id

def get_bookmarks_by_tag(tag):
    bookmarks = session.execute(
        """
        SELECT bookmark_id FROM tag_bookmarks WHERE tag = %s
        """,
        (tag,)
    )
    return [bookmark.bookmark_id for bookmark in bookmarks]
