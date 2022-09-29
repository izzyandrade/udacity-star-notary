import Web3 from 'web3';
import starNotaryArtifact from '../../build/contracts/StarNotary.json';

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error('Could not connect to contract or chain.');
    }
  },

  setStatus: function (message) {
    const status = document.getElementById('status');
    status.innerHTML = message;
  },

  setFoundStar: function (message) {
    const status = document.getElementById('foundStar');
    status.innerHTML = message;
  },

  setTransferredStar: function (message) {
    const status = document.getElementById('transferredStar');
    status.innerHTML = message;
  },

  createStar: async function () {
    const { createStar } = this.meta.methods;
    const name = document.getElementById('starName').value;
    const id = document.getElementById('starId').value;
    await createStar(name, id).send({ from: this.account });
    App.setStatus('New Star Owner is ' + this.account + '.');
  },

  searchStar: async function () {
    const { lookUptokenIdToStarInfo, ownerOf } = this.meta.methods;
    const starId = document.getElementById('searchStarId').value;
    var star;
    try {
      star = await lookUptokenIdToStarInfo(starId).call();
    } catch (err) {
      App.setFoundStar('No star was found!');
    }
    const starOwner = await ownerOf(starId).call();
    App.setFoundStar('Found star: ' + star + ' / Owned by: ' + starOwner);
  },

  transferStar: async function () {
    const { transferStar } = this.meta.methods;
    const starId = document.getElementById('transferStarId').value;
    const toAddress = document.getElementById('transferStarToAddress').value;
    try {
      await transferStar(toAddress, starId).send({ from: this.account });
      App.setTransferredStar('Transferred star ' + starId + 'to: ' + toAddress);
    } catch (err) {
      App.setTransferredStar("You can't transfer this star!");
    }
  },
};

window.App = App;

window.addEventListener('load', async function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live'
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider('http://127.0.0.1:9545')
    );
  }

  App.start();
});
