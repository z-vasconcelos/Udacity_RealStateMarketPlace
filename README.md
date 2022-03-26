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
## Run ZoKrates docker container:

### Step 1: Install docker
https://docs.docker.com/install/

### Step 2: Run Zokrates
docker run -v <path to your project folder>:/home/zokrates/code -ti zokrates/zokrates /bin/bash

docker run -v C:/Users/zeh_1/Documents/Udacity/P07/RealStateMarketplace/zokrates/home/zokrates/code/square:/home/zokrates/code -ti zokrates/zokrates /bin/bash

cd to folder -> code -> square

### Step 3: A Quick Overview of the ZoKrates Process
1 - Compile Program
2 - Trusted Setup
3 - Compute-Witness
4 - Generate-Proof
5 - Export-Verifier

Input file(s)
    program_name.code

Output file(s)
    out.code
    out
    proving.key
    verification.key
    variables.inf
    witness
    proof.json
    verifier.sol

### Step 4: Compile the program written in ZoKrates DSL
zokrates compile -i square.code

### Step 5: Generate the Trusted Setup
Now take the 'flattened' code, which is a circuit and go through a 'trusted setup' Repeat this process, every-time the program.code changes Two keys are generated - 'proving.key' and 'verification.key'

zokrates setup

### Step 6: Compute Witness
Having gone through the 'trusted setup' let's compute our 'witness' who knows the answer and it generates a witness file with computation steps

zokrates compute-witness -a 3 9

### Step 7: Generate Proof
Next step is to 'generate our proof' based on the above 'witness' A proof.json file is generated in this step

zokrates generate-proof

### Step 8: Export Verifier
Last but never the least, let's generate our 'verifier' smart contract

zokrates export-verifier

Test
`truffle test ./test/TestERC721Mintable.js`