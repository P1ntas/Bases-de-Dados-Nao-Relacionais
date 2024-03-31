#!/bin/bash

# Define your image name
IMAGE_NAME="my-arangodb"
BACKEND_IMAGE="my-node-backend"
FRONTEND_IMAGE="my-react-frontend"

# Step to build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME arangodb/

echo "Building the Node.js backend Docker image..."
docker build -t $BACKEND_IMAGE backend/

echo "Building the React frontend Docker image..."
docker build -t $FRONTEND_IMAGE frontend/

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "Build succeeded, running the Docker container..."
    # Command to run the Docker container
    docker run -e ARANGO_NO_AUTH=1 -p 8529:8529 -d -v $(pwd)/arangodb:/var/lib/arangodb3 $IMAGE_NAME

    # Run Node.js backend container
    docker run -d -p 3000:3000 $BACKEND_IMAGE

    # Run React frontend container
    docker run -d -p 8080:3000 $FRONTEND_IMAGE

else
    echo "Docker build failed, aborting..."
    exit 1
fi
