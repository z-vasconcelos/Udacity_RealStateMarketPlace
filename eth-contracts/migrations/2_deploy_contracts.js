// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
//var baseUri = "https://gateway.pinata.cloud/ipfs/"
var baseUri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"

module.exports = function(deployer) {
  deployer.deploy(Verifier).then(() => {
    deployer.deploy(SolnSquareVerifier, "ThisIsTheRealSate", "RSM", baseUri, Verifier.address);
  });
};