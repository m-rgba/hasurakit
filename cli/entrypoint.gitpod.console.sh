#!/bin/bash

# Add Gitpod user / take ownership
chown -R 33333:33333 /usr/src/hasura
chmod g+s /usr/src/hasura

cd /usr/src/hasura

## Run Migrations
if [[ ${CLI_RUN_MIGRATE} == *'metadata'* ]] || [[ ${CLI_RUN_MIGRATE} == *'migrations'* ]]
then
    if [[ -f "config.yaml" ]] 
    then
        echo "Hasura project β"
        if [[ ${CLI_RUN_MIGRATE} == *'metadata'* ]] 
        then
            echo "Loading metadata (metadata apply)... π’"
            hasura metadata apply --endpoint "https://8080-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" || exit 1
        fi
        if [[ ${CLI_RUN_MIGRATE} == *'migrations'* ]] 
        then
            echo "Loading migrations to databases (migration apply --all-databases)... π"
            hasura migrate apply --endpoint "https://8080-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" --all-databases || exit 1
        fi
        if [[ ${CLI_RUN_MIGRATE} == *'metadata'* ]] 
        then
            echo "Reloading metadata to ensure consistency (metadata reload)... β"
            hasura metadata reload --endpoint "https://8080-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" || exit 1
        fi
    else
        echo "No Hasura project found β Skipping metadata / migrations... "
    fi
fi
## CLI Console
if [[ ${CLI_MODE} == 'console' ]] 
then
    if [[ -f "config.yaml" ]] 
    then
        echo "Hasura project β"
        echo "Copying current project (to /.backup) π Just in-case π"
        backupfolder=$(date +%Y%m%d-%H%M%S)
        mkdir -p ./.backup/"$backupfolder"
        chown -R 33333:33333 /usr/src/hasura
        cp -R * ./.backup/"$backupfolder"
        # cp -r !(./.backup) ./.backup/"$backupfolder"
        echo "Starting CLI πΈοΈ & Console π» (https://9693-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST})"
        hasura console --log-level DEBUG --address "kit_cli" --endpoint "https://8080-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" --api-host "https://9693-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" --api-port 443 --no-browser || exit 1
    else
        echo "No Hasura project found π‘ Initializing... "
        hasura init .
        echo "Starting CLI πΈοΈ & Console π» (https://9693-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST})"
        hasura console --log-level DEBUG --address "kit_cli" --endpoint "https://8080-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" --api-host "https://9693-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" --api-port 443 --no-browser || exit 1
    fi
fi
## CLI Only
if [[ ${CLI_MODE} == 'cli' ]]
then
    if [[ -f "config.yaml" ]] 
    then
        echo "Hasura project β"
        echo "Copying current project (to /.backup) π Just in-case π"
        backupfolder=$(date +%Y%m%d-%H%M%S)
        mkdir -p ./.backup/"$backupfolder"
        chown -R 33333:33333 /usr/src/hasura
        cp -R * ./.backup/"$backupfolder"
        # cp -r !(./.backup) ./.backup/"$backupfolder"
        echo "Persistent CLI Running... πΈοΈ"
        tail -f /dev/null
    else
        echo "No Hasura project found π‘ Initializing... "
        hasura init .
        echo "Persistent CLI Running... πΈοΈ"
        tail -f /dev/null
    fi
fi