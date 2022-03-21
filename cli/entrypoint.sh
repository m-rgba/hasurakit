#!/bin/bash
cd /usr/src/hasura

# Console Setup
socat TCP-LISTEN:8080,fork TCP:${HASURA_URL} &
socat TCP-LISTEN:9695,fork,reuseaddr,bind=cli TCP:127.0.0.1:9695 &
socat TCP-LISTEN:9693,fork,reuseaddr,bind=cli TCP:127.0.0.1:9693 &
{
    ## CLI Console
    if [[ ${CLI_MODE} == 'console' ]] 
    then
        if [[ -f "config.yaml" ]] 
        then
            echo "Hasura project ✅"
            echo "Copying current project (to /.backup) 🕐 Just in-case 👌"
            backupfolder=$(date +%Y%m%d-%H%M%S)
            mkdir -p ./.backup/"$backupfolder"
            cp -R * ./.backup/"$backupfolder"
            # cp -r !(./.backup) ./.backup/"$backupfolder"
            echo "Starting CLI 🕸️ & Console 💻 (http://localhost:9695)"
            hasura console --log-level DEBUG --address "127.0.0.1" --endpoint "${HASURA_PROTOCOL}${HASURA_URL}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" --no-browser || exit 1
        else
            echo "No Hasura project found 💡 Initializing... "
            hasura init .
            echo "Starting CLI 🕸️ & Console 💻 (http://localhost:9695)"
            hasura console --log-level DEBUG --address "127.0.0.1" --endpoint "${HASURA_PROTOCOL}${HASURA_URL}" --admin-secret "${HASURA_GRAPHQL_ADMIN_SECRET}" --no-browser || exit 1
        fi
    fi
    ## CLI Only
    if [[ ${CLI_MODE} == 'cli' ]]
    then
        if [[ -f "config.yaml" ]] 
        then
            echo "Hasura project ✅"
            echo "Copying current project (to /.backup) 🕐 Just in-case 👌"
            backupfolder=$(date +%Y%m%d-%H%M%S)
            mkdir -p ./.backup/"$backupfolder"
            cp -R * ./.backup/"$backupfolder"
            # cp -r !(./.backup) ./.backup/"$backupfolder"
            echo "Persistent CLI Running... 🕸️"
            tail -f /dev/null
        else
            echo "No Hasura project found 💡 Initializing... "
            hasura init .
            echo "Persistent CLI Running... 🕸️"
            tail -f /dev/null
        fi
    fi
}