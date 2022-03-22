#!/bin/bash

# Add Gitpod user / take ownership
useradd -ms /bin/bash gitpod
chown -R gitpod:gitpod /usr/src/cli
chown -R gitpod:gitpod /usr/src/hasura
su gitpod

cd /usr/src/hasura

echo "Starting Console API 💻 (https://9693-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST})"
hasura console --log-level DEBUG --address "kit_cli_api" --endpoint "https://8080-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" --no-browser || exit 1