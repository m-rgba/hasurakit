# Deploying using the `cli` container

Demonstration of a deployment from a Hasura project using a the CLI container.

## Getting started

To setup your initial Hasura + Postgres instance with no data we'll run:

```
docker-compose up postgres hasura
```

To run our CLI deployment we can run:

```
docker-compose up cli
```

The following acions occur when the container is run:

- We will start the `cli` container image (with no `CLI_MODE` environment variable or ports mapped as this will be an ephemeral container to apply our migrations).
- Our `./hasura` project folder is mounted with our metadata and migrations we would like to apply.
- We have mounted `./migrate.sh` and then specify running it on container start as a command.
- You'll notice we `hasura apply metadata`, `hasura apply migrations`, and then `hasura reload metadata` in our migrate script.
    - We run a `hasura apply metadata` first so your Hasura instance's active metadata will have the context of the `--database-name` which will be used when applying our migrations. 
    - `reload metadata` is specified to ensure any inconsistencies are reloaded after both metadata and migrations have been applied.

Your deployment should now have been run and when you visit your instances local Console on [http://localhost:8080](http://localhost:8080) you should see the data has been added.