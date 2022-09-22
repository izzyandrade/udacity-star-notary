// Importing the StartNotary Smart Contract ABI (JSON representation of the Smart Contract)
const StarNotary = artifacts.require('StarNotary');

var accounts; // List of development accounts provided by Truffle
var owner; // Global variable use it in the tests cases

// This called the StartNotary Smart contract and initialize it
contract('StarNotary', (accs) => {
  accounts = accs; // Assigning test accounts
  owner = accounts[0]; // Assigning the owner test account
});

// Example test case, it will test if the contract is able to return the starName property
// initialized in the contract constructor
it('has correct name', async () => {
  let instance = await StarNotary.deployed(); // Making sure the Smart Contract is deployed and getting the instance.
  let starName = await instance.starName.call(); // Calling the starName property
  assert.equal(starName, "Izzy's Star"); // Assert if the starName property was initialized correctly
});

it('can be claimed', async () => {
  let instance = await StarNotary.deployed();
  await instance.claimStar({ from: owner });
  assert.equal(await instance.starOwner.call(), owner);
});

it('can star ownership change', async () => {
  let secondAccount = accounts[1];
  let instance = await StarNotary.deployed();
  await instance.claimStar({ from: owner });
  assert.equal(await instance.starOwner.call(), owner);
  await instance.claimStar({ from: secondAccount });
  assert.equal(await instance.starOwner.call(), secondAccount);
});

it('can change star name if owner', async () => {
  var name = 'TEST_NAME';
  let instance = await StarNotary.deployed();
  await instance.claimStar({ from: owner });
  assert.equal(await instance.starOwner.call(), owner);
  await instance.changeStarName(name);
  assert.equal(await instance.starName.call(), name);
});
