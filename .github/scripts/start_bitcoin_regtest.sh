#! /bin/bash
set -e

echo "Starting bitcoin core in regtest ✌️"


docker run -d \
  --name bitcoind-regtest
  -p 18443:18443 \
  -p 18444:18444 \
  ruimarinho/bitcoin-core:alpine \
  -regtest \
  -server \
  -rpcbind=0.0.0.0:18443 \
  -rpcallowip=0.0.0.0/0 \
  -rpcuser=abhishek \
  -rpcpassword=abhishek \
  -rpcport=18443 \
  -printtoconsole \
  -txindex \
  -fallbackfee=0.0002 \
  -acceptnonstdtxn=1

echo "Bitcoin core container started"
