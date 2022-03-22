# HasuraKit
Services, helpers, and recipes for deploying your next Hasura instance.

## Getting Started
### Run it locally with Docker
Run everything in the repo with defaults:
```
docker-compose up
```

*or*


Basic starter - setting up your initial Hasura + Postgres instance:
```
docker-compose up postgres hasura
```
and the run the specific services below you'd like to run (currently just CLI / CLI Console).

### Run with Gitpod - Develop in the Cloud

This repo has been modified to be deployed with Gitpod for your cloud dev environment 🪄

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/m-rgba/hasurakit/tree/main)

Recommend forking / cloning this repo -- all project files from CLI Console in Gitpod will be found in your `./hasura` folder and will be commit-able from Gitpod.

This repo has a `.gitpod.yml` which runs a modified set of services at `docker-compose.gitpod.yml` which will deploy the environment.

Special thanks to **Raphael + Chewy** for their tutorial on how they got everything working nicely (the Traefik + data API service combination was invaluable):
- [Chewy Gitpod + Hasura Tutorial](https://we.gochewy.io/how-to-use-hasura-in-gitpod-without-port-forwarding/)
- [Origial Repo](https://github.com/ephemerecreative/hasura-cli-gitpod-example)

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
- Default: `console`
- `cli` / `console` / none
- `console` will initialize a project folder which will be mirrored in the `/hasura` folder
- `cli` will spawn a persistent CLI to interact with your Hasura instance.
    - This can be interacted with using:

#### CLI_RUN_MIGRATE
- Default: `[]`
- [ `metadata` and/or `migrations` / none ]
- Will run a deployment of metadata or migrations when your CLI container is run:
    - `metadata` runs `hasura apply metadata`
    - `migrations` runs `hasura apply migrations --all-databases`
    - If `metadata` is selected it will also run `metadata reload metadata` to ensure consistency after migrations are run

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
