// Importing the StartNotary Smart Contract ABI (JSON representation of the Smart Contract)
const StarNotary = artifacts.require('StarNotary');

var accounts; // List of development accounts provided by Truffle
var owner; // Global variable use it in the tests cases

// This called the StartNotary Smart contract and initialize it
contract('StarNotary', (accs) => {
  accounts = accs; // Assigning test accounts
  owner = accounts[0]; // Assigning the owner test account
});

it('Can create star', async () => {
  let tokenId = 1;
  let instance = await StarNotary.deployed(); // Making sure the Smart Contract is deployed and getting the instance.
  await instance.createStar('Antares', tokenId, { from: accounts[0] }); //creating a star with name and tokenId
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Antares'); // Assert if the starName property was initialized correctly
});

it('Star owner can put star up for sale', async () => {
  let tokenId = 2;
  let instance = await StarNotary.deployed();
  let accountToUse = accounts[1];
  let starPrice = web3.utils.toWei('.01', 'ether');
  await instance.createStar('Sirius', tokenId, { from: accountToUse });
  await instance.putStarUpForSale(tokenId, starPrice, { from: accountToUse });
  assert.equal(await instance.starsForSale.call(tokenId), starPrice);
});

it('Seller gets funds after sale', async () => {
  let instance = await StarNotary.deployed();
  let tokenId = 3;
  let sellerAccount = accounts[0];
  let buyerAccount = accounts[1];
  let balance = web3.utils.toWei('.05', 'ether');
  let starPrice = web3.utils.toWei('.01', 'ether');
  await instance.createStar('Aldebaran', tokenId, { from: sellerAccount });
  await instance.putStarUpForSale(tokenId, starPrice, { from: sellerAccount });
  let balanceBeforeTransaction = await web3.eth.getBalance(sellerAccount);
  await instance.buyStar(tokenId, {
    from: buyerAccount,
    value: balance,
  });
  let balanceAfterTransaction = await web3.eth.getBalance(sellerAccount);
  let value1 = Number(balanceBeforeTransaction) + Number(starPrice);
  let value2 = Number(balanceAfterTransaction);
  assert.equal(value1, value2);
});

it('Lets user buy star if it is up for sale', async () => {
  let instance = await StarNotary.deployed();
  let tokenId = 4;
  let sellerAccount = accounts[0];
  let buyerAccount = accounts[1];
  let balance = web3.utils.toWei('.05', 'ether');
  let starPrice = web3.utils.toWei('.01', 'ether');
  await instance.createStar('Aldebaran', tokenId, { from: sellerAccount });
  await instance.putStarUpForSale(tokenId, starPrice, { from: sellerAccount });
  await instance.buyStar(tokenId, {
    from: buyerAccount,
    value: balance,
  });
  assert.equal(await instance.ownerOf.call(tokenId), buyerAccount);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async () => {
  let instance = await StarNotary.deployed();
  let name = await instance.name.call();
  let symbol = await instance.symbol.call();
  assert.equal(name, 'Star Notary');
  assert.equal(symbol, 'STAR');
});

it('lets a user transfer a star', async () => {
  let tokenId = 5;
  let instance = await StarNotary.deployed();
  let sendingAccount = accounts[0];
  let receivingAccount = accounts[1];
  await instance.createStar('Ágata', tokenId, { from: sendingAccount }); //creating a star with name and tokenId
  await instance.transferStar(receivingAccount, tokenId, {
    from: sendingAccount,
  });
  const newStarOwner = await instance.ownerOf.call(tokenId);
  assert.equal(newStarOwner, receivingAccount);
});

it('lets 2 users exchange stars', async () => {
  const firstTokenId = 6;
  const secondTokenId = 7;
  const instance = await StarNotary.deployed();
  const firstAccount = accounts[0];
  const secondAccount = accounts[1];
  await instance.createStar('Esmeralda', firstTokenId, { from: firstAccount });
  await instance.createStar('Ruby', secondTokenId, { from: secondAccount });
  await instance.exchangeStars(firstTokenId, secondTokenId, {
    from: firstAccount,
  });
  const ownerOfFirstToken = await instance.ownerOf.call(firstTokenId);
  const ownerOfSecondToken = await instance.ownerOf.call(secondTokenId);
  assert.equal(ownerOfFirstToken, secondAccount);
  assert.equal(ownerOfSecondToken, firstAccount);
});

it('lookUptokenIdToStarInfo is returning star name', async () => {
  const tokenId = 8;
  const instance = await StarNotary.deployed();
  const account = accounts[0];
  await instance.createStar('Aegon', tokenId, { from: account });
  const starName = await instance.lookUptokenIdToStarInfo.call(tokenId);
  assert.equal(starName, 'Aegon');
});
