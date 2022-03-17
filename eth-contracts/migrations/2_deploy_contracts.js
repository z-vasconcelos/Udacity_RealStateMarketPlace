// migrating the appropriate contracts
//var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var MintableContract = artifacts.require("./ERC721Mintable.sol");

module.exports = function(deployer) {
  //deployer.deploy(SquareVerifier);
  //deployer.deploy(Verifier);
  //deployer.deploy(SolnSquareVerifier);
  deployer.deploy(MintableContract, "ThiIsTheRealSate", "RSM", "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/");
};
