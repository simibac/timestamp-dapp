var TimeStamper = artifacts.require("./TimeStamper");

module.exports = function(deployer) {
  deployer.deploy(TimeStamper);
};
