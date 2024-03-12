#!/bin/bash

# Define your image name
IMAGE_NAME="my-arangodb"

# Step to build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME .

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "Build succeeded, running the Docker container..."
    # Command to run the Docker container
    docker run -e ARANGO_NO_AUTH=1 -p 8529:8529 -d -v $(pwd)/Downloads/arangodb:/var/lib/arangodb3 $IMAGE_NAME
else
    echo "Docker build failed, aborting..."
    exit 1
fi
