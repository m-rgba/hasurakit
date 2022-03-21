# HasuraKit
Services, helpers, and cookbooks for deploying your next Hasura instance.

## Getting Started
Basic starter - setting up your initial Hasura + Postgres instance:
```
docker-compose up postgres hasura
```

Run CLI and Hasura with defaults:
```
docker-compose up
```

---

## `cli` : CLI / CLI Console Service
Runs the CLI and CLI Console in a container.
- Saves declaritive metadata and migrations as you're working in Console (by default)
- Blueprint for how to deploy and manage metadata and migrations using the Hasura CLI hosted in a container  

### Getting started:
```
docker-compose up cli
```
The CLI Console will be available at: [http://localhost:9695](http://localhost:9695). \
All changes (metadata / SQL migrations) made in this Console will be saved to your project's `./hasura` folder.

### Files / Volumes:

- By default the Hasura project folder will be mounted to the `./hasura` directory in the root directory of this project.
    - When first running the container the CLI will initialize the project folder with the `hasura init .` command
    - If a Hasura `config.yml` is detected in the folder, the initialization will be skipped, and the current state of the project will be backed up into a temporary folder at: `./hasura/.backups/`

### Environment Variables:

#### HASURA_URL
- URL of your Hasura instances
- Use `host.docker.internal` + port for connecting to internal instances

#### HASURA_PROTOCOL
- `HTTP://` or `HTTPS://`

#### HASURA_GRAPHQL_ADMIN_SECRET
- The admin secret for your Hasura instances

#### CLI_MODE
- `cli` / `console` / none
- `console` will initialize a project folder which will be mirrored in the `/hasura` folder
- `cli` will spawn a persistent CLI to interact with your Hasura instance.
    - This can be interacted with using:

```
docker exec [container_name] hasura [command]
---
Example:
docker exec kit_cli hasura metadata apply
```
- Removing the `CLI_MODE` variable will allow you to run the container for non-persistent use.
    - ex: Continuous integration workflows like deploying a Hasura instance with the `cli` container: ([Deploying with CLI](./recipes/cli-deploy))

---

## Recipes
- [Deploying a Hasura instance with the `cli` container](./recipes/cli-deploy)