//var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');
var ERC721MintableComplete = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const mintableContractName = "AlmostRealState";
    const mintableContractSymbol = "ARSM";
    //const mintableContractBaseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

    //Img exposed in google drive. It generates random IDs, mapped them here
    //ex complete uri: https://drive.google.com/uc?id=1buU9Sx5SMa2xBKyYLwWkT9Cj9SYaUM3f
    //It would be simpler to upload it in an ipfs. I wanted to use Pinata, but I am getting error to access the site. For praticity, used google drive

    const mintableContractBaseTokenURI = "https://drive.google.com/";
    const tokenUri = "uc?id=";
    let nftInfo = [
        {id: 1, url: "1buU9Sx5SMa2xBKyYLwWkT9Cj9SYaUM3f"},
        {id: 2, url: "1c1Q7qrViVNqkQBCRCoxj9NUoUmnXd1AZ"},
        {id: 3, url: "1c9zcGyESt8D8OoYRzJRvQDj_u9JN95Op"},
        {id: 4, url: "1cD7lAfrGBfM7PoLg-riV5iyLk3nExxqi"},
        {id: 5, url: "1cKPAaXuoxPa3-ic6lQLijjVZDhK3ZvWw"},
        {id: 6, url: "1cL-JI5a17C3qvIaQqaNpUTEI4JF0x7tG"},
        {id: 7, url: "1cSn69BOQ9gNXOVNMl9JHbiMd1h34n26J"},
        {id: 8, url: "1cZRIN1s3KzB6D4XnGkGRy6x18uW-puCt"},
        {id: 9, url: "1cebhKWZRDXbhIWUWHj8R4exQnm17WvRc"},
        {id: 10, url: "1cjLZ4NNyHCMxvnN6Q57CjB-fy0BH3aCr"}
    ];

    let nftInfoToFail = [
        {id: 1, url: "1buU9Sx5SMa2xBKyYLwWkT9Cj9SYaUM3f"}
    ]

    let amountOfNft = nftInfo.length;

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(
                                                            mintableContractName,
                                                            mintableContractSymbol,
                                                            mintableContractBaseTokenURI,
                                                            {from: account_one}
                                                            );

            // TODO: mint multiple tokens
            for (var i = 0; i < amountOfNft; i++) {
                await this.contract._mint(account_one, nftInfo[i].id, tokenUri+nftInfo[i].url, {from: account_one});
            }
        })

        it('should return total supply', async function () { 
            let totalTokensSupply = await this.contract.totalSupply.call();

            assert.equal(totalTokensSupply == amountOfNft, true, "The total supply does not match the amount minted. NFTs minted: " + amountOfNft + " ; Total supply returned: " + totalTokensSupply);
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf.call(account_one);

            assert.equal(balance != 0, true, "The balance should be different from zero. Balance: " + balance);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenIdToTest = 1;
            let uri = await this.contract.getTokenURI.call(tokenIdToTest);
            let correctUri = mintableContractBaseTokenURI + tokenUri + nftInfo[0].url; //0 for the item in array equivalent from id 1
            //let correctUri = "https://drive.google.com/uc?id=1buU9Sx5SMa2xBKyYLwWkT9Cj9SYaUM3f";

            assert.equal(uri == correctUri, true, "The urls does not match. uri: " + uri + " ; correctUri: " + correctUri);
        })

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
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(
                mintableContractName,
                mintableContractSymbol,
                mintableContractBaseTokenURI,
                {from: account_one}
            );
        })

        it('should fail when minting when address is not contract owner', async function () {
            let tokenId = 0;

            try {
                await this.contract._mint(account_two, nftInfoToFail[tokenId].id, tokenUri+nftInfoToFail[tokenId].url, {from: account_two});
            } catch (error) { 

            }

            let checkIfMinted = await this.contract.checkIfTokenExists.call(tokenId);

            assert.equal(checkIfMinted == true, false, "Only the contract owner should be able to mint. Insted it returned " + checkIfMinted + " for a token from the address " + account_two);
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.getOwner.call();

            assert.equal(contractOwner == account_one, true, "The contract owner is different from the first address. It returned: " + contractOwner);
        })

    });
})