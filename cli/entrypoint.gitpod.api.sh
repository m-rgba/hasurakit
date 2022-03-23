#!/bin/bash

# Add Gitpod user / take ownership
chown 33333:33333 /usr/src/hasura
chmod g+s /usr/src/hasura

cd /usr/src/hasura

echo "Starting Console API 💻 (https://9693-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST})"
hasura console --log-level DEBUG --address "kit_cli_api" --endpoint "https://8080-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" --no-browser || exit 1