var TestSolnSquareVerifier = artifacts.require('SolnSquareVerifier');

contract (TestSolnSquareVerifier, accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('Test for SolnSquareVerifier', function () {
        beforeEach(async function () { 
            this.contract = await SolnSquareVerifier.new({from: account_one});
        });

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('A new Solution can be added', async function() {

            

        });
    });

});



// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
