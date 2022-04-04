#!/bin/bash

# Run migration.
echo "Applying metadata... 📄"
hasura metadata apply --endpoint "${HASURA_PROTOCOL}${HASURA_URL}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" || exit 1
echo "Applying migrations... 💽"
hasura migrate apply --endpoint "${HASURA_PROTOCOL}${HASURA_URL}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" --database-name "default" || exit 1
echo "Reloading metadata... 📄"
hasura metadata reload --endpoint "${HASURA_PROTOCOL}${HASURA_URL}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" || exit 1
echo "Migration complete ✅"

# (Optional) Running in case any follow-up actions.
#            If removed - will finish with status 0 (success) if successful.
tail -f /dev/null