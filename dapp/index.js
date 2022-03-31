import Contract from './contract';
const zproof = require("../zokrates/home/zokrates/code/square/proof.json");

let contract = new Contract('localhost', () => {

  console.log("Inside");

  document.getElementById('connect-metamsk').addEventListener('click', () => {

    console.log("Inside2");

    if(account != undefined){
      DOM.elid('ipt-account-validate').value = account;
      console.log(account);
    }

    //let flight = DOM.elid('fetch-flight-number').value;
    //let airline = DOM.elid('fetch-flight-airline').value;
    // Write transaction
    // contract.fetchFlightStatus(airline, flight, (error, result) => {
    //     display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
    //     //console.log("fetchFlightStatus", result);
    //     getFlightData();
    // });

  })
});

//------------------ load ABI

//------------------ metamask
if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
}

let account;

const ethereumButton = document.getElementById('connect-metamsk');
const showAccount = document.querySelector('.showAccount');

ethereumButton.addEventListener('click', () => {
  getAccount();
});

async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  account = accounts[0];
  console.log(account);
  document.getElementById('ipt-account-validate').value = account;
}
//------------------ metamask

document.getElementById('bt-check-proof').addEventListener('click', () => {

  let tokenId = document.getElementById('ipt-token-validate').value;
  let accountToValidate = document.getElementById('ipt-account-validate').value;

  proofOwnership(tokenId);  
});

document.getElementById('bt-check-id-has-proof').addEventListener('click', () => {

  console.log("click proofHasSolution");

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

        let outputResult =  "Is Solved: " + result.solution +
                            ". Token Id: " + result.id +
                            ".Is Minted: " + result.mint +
                            ". User Address: " + result.solAddress;                            

        document.getElementById('output-info-from-validation').value = outputResult;
      }
    }
  );



});

async function proofOwnership(tokenId) {
  const accounts = await window.ethereum.enable();
  const account = accounts[0];

  // contract.mintableContract.methods
  //   .addSolution(zproof.proof.a, zproof.proof.b, zproof.proof.c, zproof.inputs, account, tokenId)
  //   .send({from: account}, (error, result) => {
  //     if(error){
  //       console.log("verifyProof", error);
  //     } else {
  //     console.log("verifyProof", result);
  //     }
  //   });

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
}