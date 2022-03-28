var ERC721MintableComplete = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');
const zproof = require("../../zokrates/home/zokrates/code/square/proof.json");

contract ('SolnSquareVerifier', accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];

    const mintableContractName = "AlmostRealState";
    const mintableContractSymbol = "ARSM";
    //const mintableContractBaseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

    //Used a pinned cid from pinata to hold the images
    const mintableContractBaseTokenURI = "https://gateway.pinata.cloud/ipfs/";
    const tokenUri = "QmUY3UPGpnjLsiNiwASjcepjJN2z98kjkzvbZW9V5QGJeN/";
    const completeTokenUri = "https://gateway.pinata.cloud/ipfs/QmUY3UPGpnjLsiNiwASjcepjJN2z98kjkzvbZW9V5QGJeN/";

    describe('Test for SolnSquareVerifier', function () {
        beforeEach(async function () { 
            let VerifierContract = await Verifier.new({from: account_one});
            this.contract = await ERC721MintableComplete.new(
                                                            mintableContractName,
                                                            mintableContractSymbol,
                                                            mintableContractBaseTokenURI,
                                                            VerifierContract.address,
                                                            {from: account_one}
            );
        });

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('A new Solution can be added', async function() {
            let tokenId = 1;
            try {
                await this.contract.addSolution(
                    zproof.proof.a,
                    //zproof.proof.a_p,
                    zproof.proof.b, 
                    //zproof.proof.b_p,
                    zproof.proof.c,
                    //zproof.proof.c_p,
                    //zproof.proof.h,
                    //zproof.proof.k,
                    zproof.inputs,
                    account_two,
                    tokenId,
                    {from: account_two}
                );                
            } catch (error) {

            }

            let isSolutionSolved = await this.contract.hasSolution.call(
                                                                        zproof.proof.a,
                                                                        zproof.proof.b, 
                                                                        zproof.proof.c,
                                                                        zproof.inputs,
                                                                        {from: account_two}
            );

            assert.equal(isSolutionSolved, true, "The solution was not added. Trying to check the solution it returned: " + isSolutionSolved);

        });

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted from contract', async function() {
            let tokenId = 2;

            //add Solution for token 2
            try {
                await this.contract.addSolution(
                    zproof.proof.a,
                    //zproof.proof.a_p,
                    zproof.proof.b, 
                    //zproof.proof.b_p,
                    zproof.proof.c,
                    //zproof.proof.c_p,
                    //zproof.proof.h,
                    //zproof.proof.k,
                    zproof.inputs,
                    account_two,
                    tokenId,
                    {from: account_two}
                );                
            } catch (error) {

            }
            
            //mint token 2
            try {
                await this.contract.mint(account_two, tokenId, {from: account_one});
            } catch (error) {
                
            }            

            result = await this.contract.getSolutionInfo.call(
                                                            zproof.proof.a,
                                                            zproof.proof.b, 
                                                            zproof.proof.c,
                                                            zproof.inputs,
                                                            {from: account_two}
            );

            assert.equal(result.mint, true, "Solution: "+ result.mint + " / Mint: " + result.mint);
        });        
    });
});


