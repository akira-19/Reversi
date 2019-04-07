const Reversi = artifacts.require("Reversi");

module.exports = function(deployer) {
  deployer.deploy(Reversi);
};
