# timestamp-dapp

This decentralized app let's you upload a file to IPFS and afterwards store the unique hash of this file on the Ethereum Blockchain. 

![](./demo/ui-demo.gif)

## Installation

### IPFS must be installed and running

**IPFS** installation guide can be found [here](https://docs.ipfs.io/introduction/install/).

Run daemon with the following command:

```
ipfs daemon
```

### Install ganache-cli
**ganache-cli** installation guide can be found [here](https://github.com/trufflesuite/ganache-cli).

Run a local ethereum instance with the following command:

```
ganache-cli
```

This will create 10 ethereum accounts which can be imported to Metamask (just copy-paste a private key to the import window in Metamask). Make sure your Metamask is connected to ```http://127.0.0.1:8545/```.


### Truffe smart contract compilation and deployment
```
truffle develop
```
Then compile the contract

```
compile
```
and 

```
migrate
```

or if you have already migrated before

```
migrate --reset
```

### Run client application

```
cd client
npm install
npm start
```

