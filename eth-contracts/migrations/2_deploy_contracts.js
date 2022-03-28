// migrating the appropriate contracts
//var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
//var MintableContract = artifacts.require("./ERC721MintableComplete.sol");
//var baseUri = "https://gateway.pinata.cloud/ipfs/"
var baseUri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"

module.exports = function(deployer) {
  deployer.deploy(Verifier).then(() => {
    deployer.deploy(SolnSquareVerifier, "ThiIsTheRealSate", "RSM", baseUri, Verifier.address);
  });
};