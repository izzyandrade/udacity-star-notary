const HDWalletProvider = require('@truffle/hdwallet-provider');

const goerliURL =
  'https://goerli.infura.io/v3/d463e5ba89224a45ab3af3f32eaf0cb4';
const mnemonicMetamask =
  'pudding concert ignore hold travel property rifle salon announce pioneer predict dynamic';
const mnemonicLocal =
  'above verb heavy fetch where loop magic thunder tone off warm oak';

module.exports = {
  networks: {
    develop: {
      port: 9545,
      network_id: 5777,
    },
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 9545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },

    goerli: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          providerOrUrl: goerliURL,
          mnemonic: {
            phrase: mnemonicMetamask,
          },
          addressIndex: 0,
        }),
      network_id: '5',
    },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },

    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.7', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
};
