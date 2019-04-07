const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 4500000
      }
    // ropsten:{
    //   provider: function(){
    //       return new HDWalletProvider(mnemonic, infura_url)
    //   },
    //   network_id:3,
    //   gas: 4700000
    // }
  }
};
