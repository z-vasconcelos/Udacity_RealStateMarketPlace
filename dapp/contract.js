import MintableContract from '../eth-contracts/build/contracts/SolnSquareVerifier.json';
import VerifierContract from '../eth-contracts/build/contracts/Verifier.json';
import Config from './config.json';
import Web3 from "web3";

export default class Contract {

    constructor(network, callback) {
        let config = Config[network];
        this.web3 = new Web3(Web3.givenProvider);
        this.mintableContract = new this.web3.eth.Contract(MintableContract.abi, config.mintableAddress);
        this.verifierContract = new this.web3.eth.Contract(VerifierContract.abi, config.verifierAddress);
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
            this.owner = accts[0];
            this.accounts = accts;
            console.log("initialize", this.accounts);
            callback();
        });
    }

    //Send Add Solution to submit a NEW solution
    verifyProof(proofA, proofB, proofC, inputs, accountOCheck, tokenToCheck, callback){
        let self = this;
        let payload = {
            proof_a: proofA,
            proof_b: proofB,
            proof_c: proofC,
            proof_inputs: inputs,
            tokenId: tokenToCheck,
            solAccount: accountOCheck
        }
        console.log("addSolution", payload);
        self.mintableContract.methods
            .addSolution(payload.proof_a, payload.proof_b, payload.proof_c, payload.proof_inputs, payload.solAccount, payload.tokenId)
            .send({from: payload.solAccount, gas: 3000000}, (error, result) => {
                callback(error, result);
            });
    }

    //call hasSolution to get info if Solution with a proof was already "solved"
    proofHasSolution(proofA, proofB, proofC, inputs, accountOCheck, callback){
        let self = this;
        let payload = {
            solAccount: accountOCheck,
            proof_a: proofA,
            proof_b: proofB,
            proof_c: proofC,
            proof_inputs: inputs
        }

        self.mintableContract.methods
            .hasSolution(payload.proof_a, payload.proof_b, payload.proof_c, payload.proof_inputs)
            .call({from: accountOCheck}, callback);
    }
    
    //call getSolutionInfo to retrieve solution information about an specific proof
    getSolutionInfo(proofA, proofB, proofC, inputs, accountOCheck, callback){
        let self = this;
        let payload = {
            solAccount: accountOCheck,
            proof_a: proofA,
            proof_b: proofB,
            proof_c: proofC,
            proof_inputs: inputs
        }
        self.mintableContract.methods
            .getSolutionInfo(payload.proof_a, payload.proof_b, payload.proof_c, payload.proof_inputs)
            .call({from: accountOCheck}, callback);
    }

    //send mint in Solsquare that require a zSnark solution to work
    mint(toAddress, tokenId, tokenUri, callback){
        let self = this;
        let payload = {
            mintToAddress: toAddress,
            mintTokenId: tokenId,
            mintTokenUri: tokenUri
        }
        self.mintableContract.methods
            .mint(payload.mintToAddress, payload.mintTokenId, payload.mintTokenUri)
            .send({from: payload.mintToAddress, gas: 3000000}, (error, result) => {
                callback(error, result);
            });
    } 

    //Mint without proof
    _mint(toAddress, tokenId, callback){
        let self = this;
        let payload = {
            mintToAddress: toAddress,
            mintTokenId: tokenId,
            mintTokenUri: ""
        }
        self.mintableContract.methods
            ._mint(payload.mintToAddress, payload.mintTokenId, payload.mintTokenUri)
            .send({from: payload.mintToAddress, gas: 3000000}, (error, result) => {
                callback(error, result);
            });
    } 
    
    //Debug
    getTokenURI(tokenId, senderAccont, callback){
        let self = this;
        let payload = {
            mintedTokenId: tokenId,
            sender: senderAccont
        }
        self.mintableContract.methods
            .tokenURI(payload.mintedTokenId)
            .call({from: payload.sender}, callback);
    } 
    getbaseTokenURI(senderAccont, callback){
        let self = this;
        let payload = {
            sender: senderAccont
        }
        console.log("getbaseTokenURI", payload);
        self.mintableContract.methods
            .baseTokenURI()
            .call({from: payload.sender}, callback);
    } 

    getTokenName(senderAccont, callback){
        let self = this;
        let payload = {
            sender: senderAccont
        }
        self.mintableContract.methods
            .name()
            .call({from: payload.sender}, callback);
    } 

    getTokenSymbol(senderAccont, callback){
        let self = this;
        let payload = {
            sender: senderAccont
        }
        self.mintableContract.methods
            .symbol()
            .call({from: payload.sender}, callback);
    } 
}