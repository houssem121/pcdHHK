// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./Authentication.sol";
import "./patientcontract.sol";

contract Pharmacist {

    Authentication private contractRInstance;
    Patients private patientInstance;
  constructor(address _contractBAddress,address _contractPAddress) {
        contractRInstance = Authentication(_contractBAddress);
        patientInstance = Patients(_contractPAddress);
    }


    // Structure to store pharmacist information
    struct PharmacistInfo {
        string firstname;
        string lastname;
        string location;
        string phone;
        string pharmacie;
        string pharmacieid;
    }

    // Mapping to store pharmacists
    mapping(address => PharmacistInfo) public pharmaciens;

    // Mapping to store prescription access for pharmacists
    mapping(address => mapping(uint256 => bool)) public prescriptionAccess;

  event pharmaciensadded(address indexed _newEmployee, string  _firstname,string _lastname,string _location,string _pharmacie,string _pharmacieid);

    // Function to Authentication a pharmacist
    function registerPharmacist(
        string memory _firstname,
        string memory _lastname,
        string memory _location,
        string memory _phone,
        string memory _pharmacie,
        string memory _pharmacieid
    ) public {
        // Check that the user is a pharmacist
        require(getUser().role == Authentication.Role.pharmacist, "Only pharmacists can Authentication");
        PharmacistInfo storage pharmacist = pharmaciens[msg.sender];
        pharmacist.firstname = _firstname;
        pharmacist.lastname = _lastname;
        pharmacist.location=_location;
        pharmacist.phone = _phone;
        pharmacist.pharmacie= _pharmacie;
        pharmacist.pharmacieid= _pharmacieid;

        emit pharmaciensadded(msg.sender, _firstname,_lastname,_location,_pharmacie,_pharmacieid);
        
    }
   
    //open for more modifications other users 
   function getUser() public view   returns (Authentication.User memory) {
        return contractRInstance.getUser(msg.sender);
    }

    // Function to get the information of a pharmacist
    function getPharmacistInfo(address _pharmacien) public view returns (PharmacistInfo memory) {
        // Check that the user is a pharmacist
        require(getUser().role == Authentication.Role.pharmacist, "Only pharmacists can get information of other pharmacists");

        // Return the pharmacist's information
        return pharmaciens[_pharmacien];
    }

 

    // Function to validate the purchase of a prescription
    function validatePrescriptionPurchase(address _patient, uint256 _recordid) public {
        // Check that the user is a pharmacist
        require(getUser().role == Authentication.Role.pharmacist, "Only pharmacists can validate prescription purchases");

        // Update the state of the prescription
        patientInstance.addPrescriptionResultToPatient(msg.sender ,_patient, _recordid, true);

        // Emit an event to signal the validation of the purchase
        emit PrescriptionPurchaseValidated(msg.sender, _patient,pharmaciens[msg.sender].pharmacie, _recordid);
    }
    // Event to signal the validation of a purchase of a prescription
    event PrescriptionPurchaseValidated(address indexed _pharmacien ,address indexed patient,string _pharmacie, uint256 prescriptionId);

}