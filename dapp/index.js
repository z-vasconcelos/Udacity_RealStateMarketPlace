import Contract from './contract';
const zproof = require("../zokrates/home/zokrates/code/square/proof.json");

let contract = new Contract('localhost', () => {});

//------------------ metamask
if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
}

let account;

const ethereumButton = document.getElementById('connect-metamsk');

ethereumButton.addEventListener('click', () => {
  getAccount();
});

async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  account = accounts[0];
  console.log(account);
  document.getElementById('ipt-account-validate').value = account;
  document.getElementById('ipt-mint-to-address').value = account;
}
//------------------ metamask

//Submit a Solution with a provided proof
document.getElementById('bt-check-proof').addEventListener('click', () => {

  let tokenId = document.getElementById('ipt-token-validate').value;

  contract.verifyProof(zproof.proof.a,
    zproof.proof.b, 
    zproof.proof.c,
    zproof.inputs,
    account,
    tokenId,
    (error, result) =>
    {
      if(error){
        console.log("verifyProof", error);
      } else {
        console.log("verifyProof", result);

        contract.proofHasSolution( zproof.proof.a,
                              zproof.proof.b, 
                              zproof.proof.c,
                              zproof.inputs,
                              (error, result) =>
          {
            if(error){
              console.log("proofHasSolution", error);
            } else {
              console.log("proofHasSolution", result);
            }
          }
        );
      }
    }
  );  
});

//Check if proof has already been used to a solution
document.getElementById('bt-check-id-has-proof').addEventListener('click', () => {

  contract.getSolutionInfo(
    zproof.proof.a,
    zproof.proof.b, 
    zproof.proof.c,
    zproof.inputs,
    account,
    (error, result) =>
    {
      if(error){
        console.log("getSolutionInfo", error);
      } else {
        console.log("getSolutionInfo", result);
        document.getElementById('ta-output-validation').classList.remove("d-none");

        if(result.solution == true){
          document.getElementById('has-proof').innerHTML =
                                          " true. This Proof is already used. You need to generate a new one or Submit a new Solution.";
        } else {
          document.getElementById('has-proof').innerHTML = " " + result.solution;
        }

        let outputResult =  "Is Solved: " + result.solution +
                            ". Token Id: " + result.id +
                            ". Is Minted: " + result.mint +
                            ". User Address: " + result.solAddress;                            

        document.getElementById('output-info-from-validation').value = outputResult;
      }
    }
  );
});

//Mint Token
document.getElementById('bt-mint-token').addEventListener('click', () => {

  let mintToAddress = document.getElementById('ipt-mint-to-address').value;
  let tokenId = document.getElementById('ipt-token-mint').value;

  let mintWithProof = true;

  if(mintWithProof){
    contract.mint(mintToAddress, tokenId, "", (error, result) => {
      if(error){
        console.log("mint ERROR", error);
      } else {
        console.log("mint", result);
      }
    });
  } else {
    //mint without proof
    contract._mint(mintToAddress, tokenId, (error, result) => {
      if(error){
        console.log("_mint ERROR",error);
      } else {
        console.log("_mint", result);
      }
    });
  }
});

//------------------- Debug Functions

//Get token name and symbol
document.getElementById('bt-get-token-info').addEventListener('click', () => {

  document.getElementById('token-info-output').innerHTML = "";

  contract.getTokenName(account, (error, result) => {
    if(error){
      console.log(error);
    } else {
      console.log("getTokenName:", result);
      document.getElementById('token-info-output').innerHTML += " Token Name: " + result + ".";
    }
  });
  contract.getTokenSymbol(account, (error, result) => {
    if(error){
      console.log(error);
    } else {
      console.log("getTokenSymbol:", result);
      document.getElementById('token-info-output').innerHTML += " Token Symbol: " + result + ".";
    }
  });
});

//Get baseTokenUri and tokenUri
document.getElementById('bt-get-token-uri').addEventListener('click', () => {

  let tokenId = document.getElementById('ipt-get-uri-tokenid').value;

  contract.getbaseTokenURI(account, (error, result) => {
    if(error){
      console.log(error);
    } else {
      console.log("getbaseTokenURI:", result);
      document.getElementById('token-base-uri').innerHTML = "Base Token URI: " + result;
    }
  });
  contract.getTokenURI(tokenId, account, (error, result) => {
    if(error){
      console.log(error);
    } else {
      console.log("tokenUri:", result);
      document.getElementById('token-uri').innerHTML = "Token URI: <a class='link-info' href='" + result + "' target='_blank'>" + result + "</a>";
    }
  });
});
//------------------- Debug Functions
