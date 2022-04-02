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

# Functional Tests with Rinkeby

To use the interface to Validate Proof and Mint, follow these steps
1. create a .env file at the base folder of the project
2. Add at .env your infura key in the format shown bellow (without quotes)
3. Add at .env your mnemonic in the format shown bellow (inside quotes)

```
INFURA_PROJECT_ID=Your id here
MNEMONIC="you mnemonic"
```

Then, run Dapp
```
npm run dapp
```
Access http://localhost:8000/ at your browser

You will access:

![Alt text](img/udct_realStateDapp.png?raw=true "localhost Dapp")

In this page you can
1. Check if the proof is already used and get information about it
2. Connect a metamask wallet to make the validation and minting and use it ro sign the transactions
3. Submit a Solution
4. Mint a token
5. Get information about the token and metadata urls

# Project Rubrics
## Project Deliverables
- [x] Includes a README to explain how to test their code
- [X] Provides Contract Addresses, Contract Abi's, OpenSea MarketPlace Storefront link's

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
- [X] List ERC721/ ZoKrates tokens & complete transactions on market place

## Deployment
- [X] Deploy ERC721 contracts with Zokrates integration.

# Contract Information

## Verifier Transaction and Contract Address:

### Transaction
* 0x1aa9a8f0a46c86fecb6700d14b82bbe24bc7bfb92eca9d2f59815ebfaff35318  
https://rinkeby.etherscan.io/tx/0x1aa9a8f0a46c86fecb6700d14b82bbe24bc7bfb92eca9d2f59815ebfaff35318

### Contract
* 0xBfefea67Afb68107C46dBDd38845E1EB71DC18d8  
https://rinkeby.etherscan.io/address/0xBfefea67Afb68107C46dBDd38845E1EB71DC18d8

## Mintable Transaction and Contract Address:

### Transaction
* 0xa3a42b2d8c2ff69037b5b146f311ecd0c656873b1d3f8c20e72981c4e9a9a14d  
https://rinkeby.etherscan.io/tx/0xa3a42b2d8c2ff69037b5b146f311ecd0c656873b1d3f8c20e72981c4e9a9a14d

### Contract
* 0xF0c827dFb2c559dFecE87842B545dEe358BFdE78  
https://rinkeby.etherscan.io/address/0xF0c827dFb2c559dFecE87842B545dEe358BFdE78

# OpenSea Collection
https://testnets.opensea.io/collection/thiistherealsate

# Contract ABIs
The ABIs are available at folder "eth-contracts/build"