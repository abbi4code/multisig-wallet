#! /bin/bash

#no set -e as we want to run both even though after one fails
echo "Cleaning up docker container"

docker stop bitcoind-regtest || echo "Container not running or maybe its already stopped"
docker rm bitcoind-regtest || echo "container not found, maybe its already removed"

echo "cleanup completes"