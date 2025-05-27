#! /bin/bash
set -e

echo "Waiting for bitcoin core to start"

# lets wait for container if running or not
echo "Checking if container is running..."
for i in {1..10}; do
  if docker ps --format "table {{.Names}}" | grep -q "bitcoind-regtest"; then
    echo "Container bitcoind-regtest is running"
    break
  fi
  if [ $i -eq 10 ]; then
    echo "Container failed to start after 10 attempts"
    echo "Current containers:"
    docker ps -a
    exit 1
  fi
  echo "Container not running yet, waiting 2 seconds..."
  sleep 2
done

# waitt a bit more for bitcoincore to initialize
echo "Waiting 5 seconds for Bitcoin Core to initialize..."
sleep 5

for i in {1..20}; do 
  if docker exec bitcoind-regtest bitcoin-cli \
    -regtest \
    -rpcuser=abhishek \
    -rpcpassword=abhishek \
    getblockchaininfo  >/dev/null 2>&1; then
    echo "Bitcoin core running"

    echo "Checking bitcoin core status"
    docker exec bitcoind-regtest bitcoin-cli \
      -regtest \
      -rpcuser=abhishek \
      -rpcpassword=abhishek \
      -rpcport=18443
      getblockchaininfo | grep -E '(chain|blocks|bestblockhash)'
    exit 0
  fi
  echo "attempt $i: to start the bitcoin core in 3..2..1 lfg"
  sleep 3
done

echo "Failed to start the bitcoin core even after 20 attempts"
echo "Final container status:"
docker ps -a
echo "Container logs:"
docker logs bitcoind-regtest
exit 1


  
