#!/bin/sh

# Start ArangoDB in the background
arangod --server.endpoint tcp://0.0.0.0:8529 --database.directory /var/lib/arangodb3 --log.level info &

# Wait for ArangoDB to start up
echo "Waiting for ArangoDB to start..."
while ! nc -z localhost 8529; do   
  sleep 1 # wait for 1 second before check again
done
echo "ArangoDB started."

# Your command to download the dataset
wget https://github.com/arangodb/example-datasets/releases/download/imdb-graph-dump-rev2/imdb_graph_dump_rev2.zip -P /var/lib/arangodb3
unzip /var/lib/arangodb3/imdb_graph_dump_rev2.zip
arangorestore --server.endpoint tcp://localhost:8529 --server.database IMDB --create-database --include-system-collections --input-directory dump

# Keep the container running
wait