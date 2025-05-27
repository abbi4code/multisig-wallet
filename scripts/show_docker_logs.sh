#! /bin/bash
set -e

echo "Showing bitcoin error logs"

docker logs --tail 100 bitcoind-regtest 

