# Use the official ArangoDB image as a parent image
FROM arangodb:latest

# Set the environment variable to disable authentication
ENV ARANGO_NO_AUTH=1

# Copy the custom entrypoint script into the container
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

COPY users.json /tmp/users.json

# Make sure the docker entrypoint script is executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the volume to persist data
VOLUME ["/var/lib/arangodb3"]

# Expose the port ArangoDB runs on
EXPOSE 8529

# Run the docker entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]
