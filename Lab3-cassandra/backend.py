from flask import Flask, request, render_template_string, jsonify, redirect, url_for
from cassandra.cluster import Cluster
from uuid import uuid4
from datetime import datetime

app = Flask(__name__)

# Connect to Cassandra
cluster = Cluster()
session = cluster.connect('bookit')

@app.route('/')
def index():
    # Serve the HTML form
    with open('index.html', 'r') as file:
        html_content = file.read()
    return render_template_string(html_content)

@app.route('/add_bookmark', methods=['POST'])
def add_bookmark():
    url = request.form['url']
    tags = request.form['tags'].split(',')
    add_bookmark_to_cassandra(url, tags)
    # Redirect to the tags display page
    return redirect(url_for('display_tags'))

@app.route('/tags')
def display_tags():
    urls_with_tags = get_urls_and_tags()
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Tagged Bookmarks</title>
    </head>
    <body>
        <h1>Tagged Bookmarks</h1>
        <div>
            {% for url, tags in urls_with_tags.items() %}
                <div><p>URL: <a href="{{ url if url.startswith('http://') or url.startswith('https://') else 'http://' + url }}">{{ url }}</a></p>
                <p>Tags: 
                    {% for tag in tags %}
                        <a href="/tags/{{ tag }}">{{ tag }}</a>{% if not loop.last %}, {% endif %}
                    {% endfor %}
                </p><br></div>
            {% endfor %}
        </div>
        <a href="/">Add another bookmark</a>
    </body>
    </html>
    """
    return render_template_string(html, urls_with_tags=urls_with_tags)



def get_bookmarks_by_two_tags(tag1, tag2):
    # Fetch bookmark_ids for each tag
    bookmarks_tag1 = session.execute(
        "SELECT bookmark_id FROM bookmark_tags WHERE tag = %s ALLOW FILTERING",
        (tag1,)
    )
    bookmarks_url1 = set()
    for bookmark_id in bookmarks_tag1:
        query_result = session.execute(
            "SELECT url FROM bookmarks WHERE id = %s ALLOW FILTERING",
            (bookmark_id.bookmark_id,)
        )
        for row in query_result:
            bookmarks_url1.add(row.url)

    bookmarks_tag2 = session.execute(
        "SELECT bookmark_id FROM bookmark_tags WHERE tag = %s ALLOW FILTERING",
        (tag2,)
    ) 

    bookmarks_url2 = set()
    for bookmark_id in bookmarks_tag2:
        query_result = session.execute(
            "SELECT url FROM bookmarks WHERE id = %s ALLOW FILTERING",
            (bookmark_id.bookmark_id,)
        )
        for row in query_result:
            bookmarks_url2.add(row.url)

    # Find the intersection of bookmark IDs associated with both tags
    common_bookmark_ids = bookmarks_url1.intersection(bookmarks_url2)

    return common_bookmark_ids




def get_all_tags():
    result = session.execute("SELECT tag FROM bookmark_tags")
    # Use a set to remove duplicates
    tags = set(row.tag for row in result)
    return list(tags)

def add_bookmark_to_cassandra(url, tags):
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
            (bookmark_id, tag.strip())
        )
        session.execute(
            """
            INSERT INTO tag_bookmarks (tag, bookmark_id) VALUES (%s, %s)
            """,
            (tag.strip(), bookmark_id)
        )

def get_tags_and_urls():
    # Placeholder for the new structure
    urls_with_tags = {}
    
    # Fetch all bookmarks and their tags
    bookmarks = session.execute("SELECT id, url FROM bookmarks")
    for bookmark in bookmarks:
        tags_result = session.execute(
            "SELECT tag FROM bookmark_tags WHERE bookmark_id = %s",
            (bookmark.id,)
        )
        urls_with_tags[bookmark.url] = [tag.tag for tag in tags_result]
    
    return urls_with_tags

def get_urls_and_tags():
    urls_with_tags = {}
    # Fetch all bookmarks and their tags
    bookmarks = session.execute("SELECT id, url FROM bookmarks")
    for bookmark in bookmarks:
        tags_result = session.execute(
            "SELECT tag FROM bookmark_tags WHERE bookmark_id = %s",
            (bookmark.id,)
        )
        if bookmark.url not in urls_with_tags:
            urls_with_tags[bookmark.url] = set()
        urls_with_tags[bookmark.url].update(tag.tag for tag in tags_result)
    
    return urls_with_tags



def get_tag_url_pairs():
    # Assuming you have a session established with your Cassandra database
    query_result = session.execute("SELECT bookmark_id, tag FROM bookmark_tags")
    
    tag_url_pairs = []
    for row in query_result:
        # Fetch the URL for each bookmark_id
        url_result = session.execute(
            "SELECT url FROM bookmarks WHERE id = %s",
            (row.bookmark_id,)
        )
        url = url_result.one().url if url_result.one() else None
        if url:
            tag_url_pairs.append({"tag": row.tag, "url": url})

    return tag_url_pairs


@app.route('/tags/<tag>')
def bookmarks_by_tag(tag):
    # Fetch bookmark_ids for the given tag
    bookmark_ids_result = session.execute(
        "SELECT bookmark_id FROM bookmark_tags WHERE tag = %s ALLOW FILTERING",
        (tag,)
    )

    bookmarks = []
    for row in bookmark_ids_result:
        # For each bookmark_id, fetch the corresponding URL
        url_result = session.execute(
            "SELECT url FROM bookmarks WHERE id = %s",
            (row.bookmark_id,)
        )
        url_row = url_result.one()
        if url_row:
            bookmarks.append(url_row.url)
    
    # Generate and return the HTML for displaying bookmarks
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Bookmarks for Tag: {{ tag }}</title>
    </head>
    <body>
        <h1>Bookmarks for Tag: "{{ tag }}"</h1>
        <ul>
            {% for url in bookmarks %}
                <li><a href="{{ url }}" target="_blank">{{ url }}</a></li>
            {% endfor %}
        </ul>
        <a href="/tags">Back to All Tags</a>
    </body>
    </html>
    """
    return render_template_string(html, tag=tag, bookmarks=bookmarks)

@app.route('/tags/<tag1>,<tag2>')
def bookmarks_by_two_tags(tag1, tag2):
    bookmarks = get_bookmarks_by_two_tags(tag1, tag2)
    return render_template_string("""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Bookmarks for Tags: {{ tag1 }} and {{ tag2 }}</title>
    </head>
    <body>
        <h1>Bookmarks for Tags: "{{ tag1 }}" and "{{ tag2 }}"</h1>
        <ul>
            {% for url in bookmarks %}
                <li><a href="{{ url }}" target="_blank">{{ url }}</a></li>
            {% endfor %}
        </ul>
        <a href="/tags">Back to All Tags</a>
    </body>
    </html>
    """, tag1=tag1, tag2=tag2, bookmarks=bookmarks)





if __name__ == '__main__':
    app.run(debug=True)
