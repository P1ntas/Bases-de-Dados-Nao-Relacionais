# Use the official ArangoDB image as a parent image
FROM arangodb:latest

# Set the environment variable to disable authentication
ENV ARANGO_NO_AUTH=1

# Copy the custom entrypoint script into the container
COPY custom-entrypoint.sh /usr/local/bin/custom-entrypoint.sh

# Make sure the custom entrypoint script is executable
RUN chmod +x /usr/local/bin/custom-entrypoint.sh

# Set the volume to persist data
VOLUME ["/var/lib/arangodb3"]

# Expose the port ArangoDB runs on
EXPOSE 8529

# Run the custom entrypoint script
ENTRYPOINT ["custom-entrypoint.sh"]
