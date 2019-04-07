const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic ="property flush police undo warfare pulp awful obscure match know paddle acoustic";
const infura_url = "https://ropsten.infura.io/v3/90631142bcb344bfb2a6dcf69ad80b10"

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 4500000
    },
    ropsten:{
        provider: function(){
            return new HDWalletProvider(mnemonic, infura_url)
        },
        network_id:3,
        gas: 4500000
    }
  }
};
