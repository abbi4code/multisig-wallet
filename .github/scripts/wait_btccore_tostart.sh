#! /bin/bash
set -e

echo "Waiting for bitcoin core to start"

for i in {1..20}; do 
  if docker exec bitcoind-regtest bitcoin-cli \
    -rpcuser=abhishek \
    -rpcpassword=abhishek \
    getblockchaininfo  >/dev/null 2>&1; then
    echo "Bitcoin core running"

    echo "Checking bitcoin core status"
    docker exec bitcoind-regtest bitcoin-cli \
      -rpcuser=abhishek \
      -rpcpassword=abhishek \
      getblockchaininfo | grep -E (chain|blocks|bestblockhash)
    exit 0
  fis
    echo "attempt $i: to start the bitcoin core in 3..2..1 lfg"
    sleep 3
done

echo "Failed to start the bitcoin core even after 20 attempts"
exit 1


  
