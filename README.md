# Udacity Blockchain Capstone

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product. 

# Project Resources

* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin ](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)



# Run Zokrates

## Run ZoKrates docker container

### Step 1: Install docker
Docker instalation [Link](hhttps://docs.docker.com/install/)

### Step 2: Run Zokrates
```
docker run -v /path to your project folder:/home/zokrates/code -ti zokrates/zokrates /bin/bash
```

docker run -v C:/Users/zeh_1/Documents/Udacity/P07/RealStateMarketplace/zokrates/home/zokrates/code/square:/home/zokrates/code -ti zokrates/zokrates /bin/bash

* cd to folder -> code -> square
* You can use `ls` to check if you are in the right folder. It should outuput the file `square.code`

## Zokrates Generate Verifier.sol
### Step 3: A Quick Overview of the ZoKrates Process

1. Compile Program
2. Trusted Setup
3. Compute-Witness
4. Generate-Proof
5. Export-Verifier

Input file(s)
```
    program_name.code
```

Output file(s)
```
    out.code
    out
    proving.key
    verification.key
    variables.inf
    witness
    proof.json
    verifier.sol
```

### Step 4: Compile the program written in ZoKrates DSL
```
zokrates compile -i square.code
```

### Step 5: Generate the Trusted Setup
Now take the 'flattened' code, which is a circuit and go through a 'trusted setup' Repeat this process, every-time the program.code changes Two keys are generated - 'proving.key' and 'verification.key'
```
zokrates setup
```

### Step 6: Compute Witness
Having gone through the 'trusted setup' let's compute our 'witness' who knows the answer and it generates a witness file with computation steps
```
zokrates compute-witness -a 3 9
```

### Step 7: Generate Proof
Next step is to 'generate our proof' based on the above 'witness' A proof.json file is generated in this step
```
zokrates generate-proof
```

### Step 8: Export Verifier
Last but never the least, let's generate our 'verifier' smart contract
```
zokrates export-verifier
```

# Tests

## Automated tests scripts
### To Test The mintable contract

Inside the eth-contracts folder, run in the terminal:
```
truffle test ./test/TestERC721Mintable.js
```

### To Test SquareVerifier
```
truffle test ./test/TestSquareVerifier.js
```

### To Test SolnSquareVerifier
```
truffle test ./test/TestSolnSquareVerifier.js
```

# Project Rubrics
## Project Deliverables
- [x] Includes a README to explain how to test their code
- [ ] Provides Contract Addresses, Contract Abi's, OpenSea MarketPlace Storefront link's

## ERC721
- [x] Complete the boilerplate ERC721 Mintable Contract in 'ERC721Mintable.sol'
- [x] Write and pass the test cases in 'TestERC721Mintable.js'
- [x] Write and pass the test cases in 'TestSquareVerifier.js'
- [x] Write and pass the test cases in 'TestSolnSquareVerifier.js'

## Zokrates
- [x] Complete the Zokrates proof in square.code by adding the variable names in square.code
- [x] Complete test contract in SolnSquareVerifier.sol
- [x] Write and pass the test cases in 'TestSolnSquareVerifier.js'

## OpenSea Marketplace
- [ ] List ERC721/ ZoKrates tokens & complete transactions on market place

## Deployment
- [ ] Deploy ERC721 contracts with Zokrates integration.

* obs:
Infura with hdWallet
npm install @truffle/hdwallet-provider

run web application
npm install webpack-dev-server -g

Pinata
Verifier Contract Address
0x9B3C68A2dA2C865800bCB340E072C36c540864C1
The ABI from this contract can be found inside this project at folder eth-contracts/repository/abi

SolnSquareVerifier Transaction Hash
0x372a96215a05d9222cab44b29afc27f144d4a0cde41f808232f2cf54d782f4e8
SolnSquareVerifier Contract Address
0x43e180ceA558D1C313363C8524588A5C67ae5bd0

standard
0x25c12e010deC5207b199c7a4bd2Ba0C6FE851287
Verifier Contract Address
0x9B3C68A2dA2C865800bCB340E072C36c540864C1

SolnSquareVerifier Transaction Hash
0x96c5d7f0d722a933d75ca0fd12d9d63aea5fd8d1dec4f55422c37531bea16b7d
SolnSquareVerifier Contract Address
0x1f8A40FCfe429c5FA6dcF96EbB907a09ec196918
