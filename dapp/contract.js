import MintableContract from '../eth-contracts/build/contracts/SolnSquareVerifier.json';
import VerifierContract from '../eth-contracts/build/contracts/Verifier.json';
//import flightSuretyData from '../../build/contracts/flightSuretyData.json';
import Config from './config.json';
import Web3 from "web3";

//const Web3 = require("web3");
//import Web3 from '/node_modules/web3/lib/index.js';
//import Web3 from 'https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js';
//<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>

export default class Contract {

    constructor(network, callback) {
        let config = Config[network];
        // this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.web3 = new Web3(Web3.givenProvider);
        this.mintableContract = new this.web3.eth.Contract(MintableContract.abi, config.mintableAddress);
        this.verifierContract = new this.web3.eth.Contract(VerifierContract.abi, config.verifierAddress);
        //this.flightSuretyApp = new this.web3.eth.Contract(MintableContract.abi, "0x1f8A40FCfe429c5FA6dcF96EbB907a09ec196918");
        //this.flightSuretyData = new this.web3.eth.Contract(flightSuretyData.abi, config.dataAddress);
        //this.initialize(callback);
        // this.owner = null;
        // this.airlines = [];
        // this.passengers = [];
        // this.accounts = []
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
            this.owner = accts[0];
            this.accounts = accts;
            console.log("initialize", this.accounts);
            callback();
        });
    }

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
        console.log(payload);
        self.mintableContract.methods
            .addSolution(payload.proof_a, payload.proof_b, payload.proof_c, payload.proof_inputs, payload.solAccount, payload.tokenId)
            .send({from: payload.solAccount}, (error, result) => {
                callback(error, result);
            });
        // self.mintableContract.methods
        //     .addSolution(payload.proof_a, payload.proof_b, payload.proof_c, payload.proof_inputs, payload.solAccount, payload.tokenId)
        //     .call({from: payload.solAccount}, callback);
    }

    proofHasSolution(proofA, proofB, proofC, inputs, accountOCheck, callback){
        let self = this;
        let payload = {
            solAccount: accountOCheck,
            proof_a: proofA,
            proof_b: proofB,
            proof_c: proofC,
            proof_inputs: inputs
        }
        console.log(payload);
        self.mintableContract.methods
            .hasSolution(payload.proof_a, payload.proof_b, payload.proof_c, payload.proof_inputs)
            .call({from: accountOCheck}, callback);
    }

    getSolutionInfo(proofA, proofB, proofC, inputs, accountOCheck, callback){
        let self = this;
        let payload = {
            solAccount: accountOCheck,
            proof_a: proofA,
            proof_b: proofB,
            proof_c: proofC,
            proof_inputs: inputs
        }
        console.log(payload);
        self.mintableContract.methods
            .getSolutionInfo(payload.proof_a, payload.proof_b, payload.proof_c, payload.proof_inputs)
            .call({from: accountOCheck}, callback);
    }

    // isOperational(callback) {
    //    let self = this;
    //    self.flightSuretyApp.methods
    //         .isOperational()
    //         .call({ from: self.owner}, callback);
    // }

    // getAccounts(){
    //     return(this.accounts);
    // }

    // /********************************************************************************************/
    // /*                                       INSURANCE                                           */
    // /********************************************************************************************/
    // buyInsurance(buyer, flightKey, insuranceValue, callback) {
    //     let self = this;
    //     let payload = {
    //         flightUniqueKey: flightKey,
    //         valueToSend: insuranceValue,
    //         buyerAddress: buyer
    //     }
    //     self.flightSuretyApp.methods
    //         .buyInsurance(payload.flightUniqueKey)
    //         .send({from: payload.buyerAddress, value: self.web3.utils.toWei(payload.valueToSend.toString(), "ether"), gas: 3000000}, (error, result) => {
    //             callback(error, payload);
    //         });
    //     //other owner to send in From -> this.accounts[8]
    // }
}