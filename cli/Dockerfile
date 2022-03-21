FROM ubuntu:20.04

RUN echo "Updating Dependencies..." 
RUN apt-get update -y && apt-get install -y curl socat

RUN echo "Getting CLI / Entrypoint..."
RUN curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
RUN chmod +x /usr/local/bin/hasura

COPY ./entrypoint.sh /usr/src/cli/entrypoint.sh
RUN chmod +x /usr/src/cli/entrypoint.sh

RUN echo "Starting..."
WORKDIR /usr/src/hasura
CMD "/usr/src/cli/entrypoint.sh"