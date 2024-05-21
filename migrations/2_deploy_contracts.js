var Authentication = artifacts.require("./Authentication.sol");
var Patients = artifacts.require("./Patients.sol");
var Docteur = artifacts.require("./DoctorContract.sol");
var pharmacien = artifacts.require("./Pharmacist.sol");
var insuranceemployee = artifacts.require("./AgentAssurance.sol");  
module.exports = function(deployer) {
  // Déployer le contrat Authentication
  deployer.deploy(Authentication).then(function() {
    // Avec l'adresse de Authentication, déployer Patients
    return deployer.deploy(Patients, Authentication.address);
  }).then(function() {
    // Avec les adresses de Authentication et Patients, déployer Docteur
    return deployer.deploy(Docteur, Authentication.address, Patients.address);
  }).then(function() {
    // Avec les adresses de Authentication et Patients, déployer pharmacien
    return deployer.deploy(pharmacien, Authentication.address, Patients.address);
  }
  ).then(function() {
    // Avec les adresses de Authentication et Patients, déployer assuranceemployee
    return deployer.deploy(insuranceemployee, Authentication.address, Patients.address);
  } 
  );

};
