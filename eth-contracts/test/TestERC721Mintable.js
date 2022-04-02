var ERC721MintableComplete = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const mintableContractName = "AlmostRealState";
    const mintableContractSymbol = "ARSM";
    const mintableContractBaseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
    const tokenUri = "";

    //Using a pinned cid from pinata to hold the images
    //const mintableContractBaseTokenURI = "https://gateway.pinata.cloud/ipfs/";
    //const tokenUri = "QmUY3UPGpnjLsiNiwASjcepjJN2z98kjkzvbZW9V5QGJeN/";
    //const completeTokenUri = "https://gateway.pinata.cloud/ipfs/QmUY3UPGpnjLsiNiwASjcepjJN2z98kjkzvbZW9V5QGJeN/";
    
    let amountOfNft = 10;

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            let VerifierContract = await Verifier.new({from: account_one});
            this.contract = await ERC721MintableComplete.new(
                                                            mintableContractName,
                                                            mintableContractSymbol,
                                                            mintableContractBaseTokenURI,
                                                            VerifierContract.address,
                                                            {from: account_one}
                                                            );

            // TODO: mint multiple tokens
            //There is no additional tokenUri. Therefore, sending it empty
            for (var i = 1; i <= amountOfNft; i++) {
                await this.contract._mint(account_one, i, tokenUri, {from: account_one});
            }
        })

        it('should return total supply', async function () { 
            let totalTokensSupply = await this.contract.totalSupply.call();

            assert.equal(totalTokensSupply == amountOfNft, true, "The total supply does not match the amount minted. NFTs minted: " + amountOfNft + " ; Total supply returned: " + totalTokensSupply);
        });

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf.call(account_one);

            assert.equal(balance != 0, true, "The balance should be different from zero. Balance: " + balance);
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenIdToTest = 1;
            let uri = await this.contract.tokenURI.call(tokenIdToTest);
            let correctUri = mintableContractBaseTokenURI + tokenUri + tokenIdToTest; //0 for the item in array equivalent from id 1
            //let correctUri = "https://drive.google.com/uc?id=1buU9Sx5SMa2xBKyYLwWkT9Cj9SYaUM3f";

            assert.equal(uri == correctUri, true, "The urls does not match. uri: " + uri + " ; correctUri: " + correctUri);
        });

        it('should transfer token from one owner to another', async function () { 
            //token id to be transfered
            let = tokenToTransferId = 1;

            try {
                await this.contract.transferFrom(account_one, account_two, tokenToTransferId);
            } catch (error) {
                
            }

            let checkOwnerShip = await this.contract.ownerOf.call(tokenToTransferId);

            assert.equal(checkOwnerShip == account_one, false, "The owner should not be from address " + checkOwnerShip + " ; It should have transfered to " + account_two);
            assert.equal(checkOwnerShip == account_two, true, "The owner should be the address " + account_two + "; instead it returned " + checkOwnerShip);
        });
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            let VerifierContract = await Verifier.new({from: account_one});
            this.contract = await ERC721MintableComplete.new(
                                                            mintableContractName,
                                                            mintableContractSymbol,
                                                            mintableContractBaseTokenURI,
                                                            VerifierContract.address,
                                                            {from: account_one}
                                                            );
        })

        it('should fail when minting when address is not contract owner', async function () {
            let tokenId = 0;

            try {

                await this.contract._mint(account_one, tokenId, tokenUri, {from: account_two});

            } catch (error) { 

            }

            let checkIfMinted = await this.contract.checkIfTokenExists.call(tokenId, {from: account_one});

            assert.equal(checkIfMinted == true, false, "Only the contract owner should be able to mint. Insted it returned " + checkIfMinted + " for a token from the address " + account_two);
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.getOwner.call();

            assert.equal(contractOwner == account_one, true, "The contract owner is different from the first address. It returned: " + contractOwner);
        })

    });
})