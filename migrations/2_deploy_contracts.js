var Authentication = artifacts.require("./Authentication.sol");
var Patients = artifacts.require("./Patients.sol");
module.exports = function (deployer) {// Deploy the Authentication contract and insert address of the contract in patients contract
  deployer.deploy(Authentication).then(function () {
    return deployer.deploy(Patients, Authentication.address);
  }
  );
}
;