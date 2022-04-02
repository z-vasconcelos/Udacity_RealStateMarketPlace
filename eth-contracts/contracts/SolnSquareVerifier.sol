pragma solidity >=0.4.21 <0.6.0;

import "./ERC721MintableComplete.sol";
import "./Verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {

    Verifier verifier;

    constructor(string memory name, string memory symbol, string memory baseTokenURI, address verifierAddress) 
                                    ERC721MintableComplete(name, symbol, baseTokenURI) public 
    {
        verifier = Verifier(verifierAddress);
    }    

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        bool hasSolution;
        uint256 index;
        address solutionAddress;
        bool isMinted;
    }

    // TODO define an array of the above struct
    //map tokens ids to keys that can be used to access the sctruct SolutionKey
    struct SolutionKey {
        bool isKeyValid;
        bytes32 key;
    }
    mapping(uint256 => SolutionKey) solutionsKeys;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded (uint256 index, address solutionAddress);

    // TODO Create a function to add the solutions to the array and emit the event
    //https://zokrates.github.io/examples/sha256example.html?highlight=verifyTx#prove-knowledge-of-pre-image

    //bkp parameters
    // uint[2] memory a,
    // uint[2] memory a_p,
    // uint[2][2] memory b,
    // uint[2] memory b_p,
    // uint[2] memory c,
    // uint[2] memory c_p,
    // uint[2] memory h,
    // uint[2] memory k,
    // uint[2] memory input,
    // address solAddress,
    // uint256 tokenId

    function addSolution 
                        (
                            uint[2] memory a,
                            uint[2][2] memory b,
                            uint[2] memory c,
                            uint[2] memory input,
                            address solAddress,
                            uint256 tokenId
                        )
                        public
    {
        //generate a key to put in Solutions mapping and array
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, input));
        
        //check if solution already exists
        require(!solutions[solutionKey].hasSolution, "A Solution has already been generated");
        require(!solutionsKeys[tokenId].isKeyValid, "This tokenId has already been solved. Generate a new solution with Zokrates");

        //Try to solve
        //bool isVerified = verifier.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input);
        bool isVerified = verifier.verifyTx(a, b, c, input);
        require(isVerified, "The verification has failed");        

        solutions[solutionKey] = Solution ({
            hasSolution: true,
            index: tokenId,
            solutionAddress: solAddress,
            isMinted: false
        });

        solutionsKeys[tokenId] = SolutionKey ({
            isKeyValid: true,
            key: solutionKey
        });

        emit SolutionAdded(tokenId, solAddress);
    }

    function hasSolution (
                        uint[2] memory a,
                        uint[2][2] memory b,
                        uint[2] memory c,
                        uint[2] memory input
                        )
                        public
                        view
                        returns (bool) {
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, input));
        return(solutions[solutionKey].hasSolution);
    }

    function getSolutionInfo (
                        uint[2] memory a,
                        uint[2][2] memory b,
                        uint[2] memory c,
                        uint[2] memory input
                        )
                        public
                        view
                        returns (bool solution, uint256 id, address solAddress, bool mint) {
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, input));
        return(solutions[solutionKey].hasSolution, solutions[solutionKey].index, solutions[solutionKey].solutionAddress, solutions[solutionKey].isMinted);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint (address to, uint256 tokenId, string memory tokenUri) public {
        
        //check if passed through verifyTx and if can be minted
        bytes32 solutionKey = solutionsKeys[tokenId].key;
        require(solutions[solutionKey].hasSolution, "Can not mint without validate autenticity");
        require(!solutions[solutionKey].isMinted, "Can not mint an item already minted");
        require(to == solutions[solutionKey].solutionAddress, "Failed. The user addres used to mint is different from the validation owner addresses");
        
        solutions[solutionKey].isMinted = true;
        super._mint(to, tokenId, tokenUri);
    }

}





  


























