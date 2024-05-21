// SPDX-License-Identifier: GPL-3.0

import './Authentication.sol';
pragma solidity ^0.8.0;
contract Patients  {
 
    Authentication private contractRInstance;

    constructor(address _contractBAddress) {
        contractRInstance = Authentication(_contractBAddress);
    }


struct Patient {
    string firstname;
    string lastname;
    uint age;
    string location;
    string phone;
    address[] authorizedUsers; // List of addresses of authorized doctors
    string dossierHash; // Medical history of the patient
    string PublicKey;
    Authentication.MedicalRecord[]  record;
    Authentication.Appointment[] Appointmentslist;
    //here i will add records option but its should contain both test and ordonnance 
}


event patientadded(address indexed patient, string firstname,string lastname,uint age);

mapping(address => Patient) public patients;

function registerUserDetails( string memory _firstname,string memory _lastname,uint _age,string memory _dossierHash ,string memory location,string memory phone)public
{
        require(getUser().role == Authentication.Role.patient, "Only patients can submit this type ");
        Patient storage patient = patients[msg.sender];
        patient.firstname = _firstname;
        patient.lastname = _lastname;
        patient.age = _age;
        patient.dossierHash = _dossierHash;
        patient.location=location;
        patient.phone=phone;

        emit patientadded(msg.sender,_firstname,_lastname,_age);

       
}



//open for more modifications other users 
   function getUser() public view   returns (Authentication.User memory) {
        return contractRInstance.getUser(msg.sender);
    }
  
 function getPatients(address _patient) public view   returns (Patient memory) {
        return patients[_patient];
}

function addAppointment(address _patient,Authentication.Appointment memory newAppointment) public {
        patients[_patient].Appointmentslist.push(newAppointment);
}
function addrecordtoPatient(Authentication.MedicalRecord  memory record,address _patient)public{
     patients[_patient].record.push(record);
}

function getRecordById(address _patient, uint _id) public view returns (Authentication.MedicalRecord memory) {
    for (uint i = 0; i < patients[_patient].record.length; i++) {
        if (patients[_patient].record[i].id == _id) {
            return patients[_patient].record[i];
        }
    }
    revert("Medical record not found"); // Revert if medical record with given ID is not found
}
function printpatientrecord(address _patient, uint i) public view returns (Authentication.Prescription memory) {
    return patients[_patient].record[i].treatment;
}
/* // Function to validate the purchase of a prescription
    function validatePrescriptionPurchase(address _patient, uint256 _recordid) public {
        // Check that the user is a pharmacist
        require(getUser().role == Authentication.Role.pharmacist, "Only pharmacists can validate prescription purchases");

        // Update the state of the prescription
        patientInstance.addPrescriptionResultToPatient(msg.sender ,_patient, _recordid, true);

        // Emit an event to signal the validation of the purchase
        emit PrescriptionPurchaseValidated(_patient, _recordid);
    } */

function addPrescriptionResultToPatient(address _user,address _patient, uint _id, bool _result) public onlyAuthorizedUser(_user,_patient) {//patient contract
    Authentication.MedicalRecord memory medicalRecord = getRecordById(_patient, _id);

    // Update the prescription purchase status in the medical record
    medicalRecord.treatment.fullyPurchased = _result;

    // Optionally, emit an event or perform any additional logic

    // Update the medical record in the patient's records array
    for (uint i = 0; i < patients[_patient].record.length; i++) {
        if (patients[_patient].record[i].id == _id) {
            patients[_patient].record[i] = medicalRecord;
            break; // Break the loop once the medical record is updated
        }
    }
}




function addTestResultToPatient(address _patient, uint _id, string memory _result) public {
    Authentication.MedicalRecord memory medicalRecord = getRecordById(_patient, _id);
    
    // Update the test result in the medical record
    medicalRecord.test.result = _result;
    
    // Optionally, emit an event or perform any additional logic
    
    // Update the medical record in the patient's records array
    for (uint i = 0; i < patients[_patient].record.length; i++) {
        if (patients[_patient].record[i].id == _id) {
            patients[_patient].record[i] = medicalRecord;
            break; // Break the loop once the medical record is updated
        }
    }
}


event RemboursementDemandePrescription(address indexed patient, uint256 prescriptionId);

function demanderRemboursementPrescription(uint256 prescriptionId,uint recordid) public {
    require(patients[msg.sender].record[recordid].treatment.fullyPurchased,"Treatment is not fully purchased");
    // Autres vérifications éventuelles...

    // Enregistrer la demande de remboursement pour cette prescription
    // Émettre un événement pour informer l'agent d'assurance
    emit RemboursementDemandePrescription(msg.sender, prescriptionId);
}



function AuthorizeUser(address  _user) public {//maybe add modifier so only patient can use ths function ;patient contract 
    require(getUser().role == Authentication.Role.patient, "Only patients can submit this type ");
    for (uint i = 0; i < patients[msg.sender].authorizedUsers.length; i++) {
        require(patients[msg.sender].authorizedUsers[i] != _user, "User already authorized");
      }
      patients[msg.sender].authorizedUsers.push(_user);
}




function removeAuthorizedUser(address _user) public {//patient contract 
    // Find the index of the user in the authorized list
    require(getUser().role == Authentication.Role.patient, "Only patients can submit this type ");
    for (uint i = 0; i < patients[msg.sender].authorizedUsers.length; i++) {
        if (patients[msg.sender].authorizedUsers[i] == _user) {
            // Remove the user by shifting the elements and decreasing the array length
            for (uint j = i; j < patients[msg.sender].authorizedUsers.length - 1; j++) {
                patients[msg.sender].authorizedUsers[j] = patients[msg.sender].authorizedUsers[j + 1];
            }
            patients[msg.sender].authorizedUsers.pop(); // Remove the last element
            break;
        }
    }
}




function StorePatientFileHash(string memory _ipfsfilehash,string memory _pubkey) public returns (bool) {//patient contract
     patients[msg.sender].dossierHash=_ipfsfilehash;
     patients[msg.sender].PublicKey=_pubkey;
     return true ;   
} 


function getAuthorizedUsers(address _fromPatient )public view returns (address[] memory ) {//patient contract
return patients[_fromPatient].authorizedUsers;
}

function isAuthorized(address _user,address _fromPatient) public view returns (bool) {//patient contract
    // Retrieve the patient's authorized users
    address[] memory authorizedUsers = getAuthorizedUsers(_fromPatient);

    // Check if the given address is in the list of authorized users
    for (uint i = 0; i < authorizedUsers.length; i++) {
        if (authorizedUsers[i] == _user) {
            return true; // Address is authorized
        }
    }
    return false; // Address is not authorized

}


 modifier onlyAuthorizedUser(address _user,address _fromPatient) {//patient contract
        require(isAuthorized(_user,_fromPatient), "Unauthorized user");
        _;
    }



function getFileHash(address _user,address _fromPatient) public view onlyAuthorizedUser(_user,_fromPatient) returns (string memory) {//user contract with permission
    // Retrieve and return the file hash
    return patients[_fromPatient].dossierHash;
}

  
function visualiserProchainsRendezVous() public view returns (Authentication.Appointment[] memory) {//patient contract 
    // Obtenez les prochains rendez-vous du patient actuel
    Patient storage patient = patients[msg.sender];
    return patient.Appointmentslist;
}



// Événement pour notifier l'achat d'une ordonnance
event OrdonnanceAchete(address indexed patient, uint256 recordId, uint256 timestamp,string firstname,string lastname,address indexed pharmacieaddress);
// Fonction pour notifier l'achat d'une ordonnance par le pharmacien
function notifierAchatOrdonnance(address _patient, uint256 recordId,address pharmachieaddress) external {
    // Autres vérifications éventuelles...

    // Émettre un événement pour notifier l'achat de l'ordonnance
    emit OrdonnanceAchete(_patient, recordId, block.timestamp,patients[_patient].firstname,patients[_patient].lastname,pharmachieaddress);
}

// Événement pour notifier la visite chez le médecin
event VisiteMedecinEffectuee(address indexed patient, address indexed doctor, uint256 timestamp,string firstname,string lastname);

// Fonction pour notifier la visite chez le médecin
function notifierVisiteMedecin(address _patient, address _doctor) external {
    // Autres vérifications éventuelles...

    // Émettre un événement pour notifier la visite chez le médecin
    emit VisiteMedecinEffectuee(_patient, _doctor, block.timestamp,patients[_patient].firstname,patients[_patient].lastname);    
}

// Événement pour notifier la demande de remboursement
event RemboursementDemande(address indexed patient, uint256 recordId, string service, uint256 timestamp);

// Fonction pour notifier la demande de remboursement d'un service
function notifierDemandeRemboursement(address _patient, uint256 recordId, string memory _service) external {//i will add prescription id here 
    // Autres vérifications éventuelles...

    // Émettre un événement pour notifier la demande de remboursement
    emit RemboursementDemande(_patient, recordId, _service, block.timestamp);
}

}













/*contract Patients  {
 
    Authentication private contractRInstance;

    constructor(address _contractBAddress) {
        contractRInstance = Authentication(_contractBAddress);
    }


struct Patient {
    string firstname;
    string lastname;
    uint age;
    string location;
    string phone;
    address[] authorizedUsers; // List of addresses of authorized doctors
    string dossierHash; // Medical history of the patient
    string PublicKey;
    Authentication.MedicalRecord[]  record;
    Authentication.Appointment[] Appointmentslist;
}





mapping(address => Patient) public patients;

function registerUserDetails( string memory _firstname,string memory _lastname,uint _age,string memory _dossierHash ,string memory location,string memory phone)public
{
        require(getUser().role == Authentication.Role.patient, "Only patients can submit this type ");
        Patient storage patient = patients[msg.sender];
        patient.firstname = _firstname;
        patient.lastname = _lastname;
        patient.age = _age;
        patient.dossierHash = _dossierHash;
        patient.location=location;
        patient.phone=phone;
        

       
}

function SetHash(string memory _dossierHash) public {
    patients[msg.sender].dossierHash = _dossierHash;
}


//open for more modifications other users 
   function getUser() public view   returns (Authentication.User memory) {
        return contractRInstance.getUser(msg.sender);
    }
  
 function getPatients(address _patient) public view   returns (Patient memory) {
        return patients[_patient];
}

function addAppointment(address _patient,Authentication.Appointment memory newAppointment) public {
        patients[_patient].Appointmentslist.push(newAppointment);
}
function addrecordtoPatient(Authentication.MedicalRecord  memory record,address _patient)public{
     patients[_patient].record.push(record);
}

function getRecordById(address _patient, uint _id) public view returns (Authentication.MedicalRecord memory) {
    for (uint i = 0; i < patients[_patient].record.length; i++) {
        if (patients[_patient].record[i].id == _id) {
            return patients[_patient].record[i];
        }
    }
    revert("Medical record not found"); // Revert if medical record with given ID is not found
}
function addTestResultToPatient(address _patient, uint _id, string memory _result) public {
    Authentication.MedicalRecord memory medicalRecord = getRecordById(_patient, _id);
    
    // Update the test result in the medical record
    medicalRecord.test.result = _result;
    
    // Optionally, emit an event or perform any additional logic
    
    // Update the medical record in the patient's records array
    for (uint i = 0; i < patients[_patient].record.length; i++) {
        if (patients[_patient].record[i].id == _id) {
            patients[_patient].record[i] = medicalRecord;
            break; // Break the loop once the medical record is updated
        }
    }
}
event 
event ReimbursementRequested(address indexed patient, uint256 timestamp);

function demanderemboursement() public {//this will emit an event in the blockchain so the agent see it and then ...;patient contract
    require(getUser().role == Authentication.Role.patient, "Only patients can submit reimbursement requests");
    emit ReimbursementRequested(msg.sender, block.timestamp);
}



function AuthorizeUser(address  _user) public {//maybe add modifier so only patient can use ths function ;patient contract 
    require(getUser().role == Authentication.Role.patient, "Only patients can submit this type ");
    for (uint i = 0; i < patients[msg.sender].authorizedUsers.length; i++) {
        require(patients[msg.sender].authorizedUsers[i] != _user, "User already authorized");
      }
      patients[msg.sender].authorizedUsers.push(_user);
}




function removeAuthorizedUser(address _user) public {//patient contract 
    // Find the index of the user in the authorized list
    require(getUser().role == Authentication.Role.patient, "Only patients can submit this type ");
    for (uint i = 0; i < patients[msg.sender].authorizedUsers.length; i++) {
        if (patients[msg.sender].authorizedUsers[i] == _user) {
            // Remove the user by shifting the elements and decreasing the array length
            for (uint j = i; j < patients[msg.sender].authorizedUsers.length - 1; j++) {
                patients[msg.sender].authorizedUsers[j] = patients[msg.sender].authorizedUsers[j + 1];
            }
            patients[msg.sender].authorizedUsers.pop(); // Remove the last element
            break;
        }
    }
}




function StorePatientFileHash(string memory _ipfsfilehash,string memory _pubkey) public returns (bool) {//patient contract
     patients[msg.sender].dossierHash=_ipfsfilehash;
     patients[msg.sender].PublicKey=_pubkey;
     return true ;   
} 


function getAuthorizedUsers(address _fromPatient )public view returns (address[] memory ) {//patient contract
return patients[_fromPatient].authorizedUsers;
}

function isAuthorized(address _user,address _fromPatient) public view returns (bool) {//patient contract
    // Retrieve the patient's authorized users
    address[] memory authorizedUsers = getAuthorizedUsers(_fromPatient);

    // Check if the given address is in the list of authorized users
    for (uint i = 0; i < authorizedUsers.length; i++) {
        if (authorizedUsers[i] == _user) {
            return true; // Address is authorized
        }
    }
    return false; // Address is not authorized

}


 modifier onlyAuthorizedUser(address _user,address _fromPatient) {//patient contract
        require(isAuthorized(_user,_fromPatient), "Unauthorized user");
        _;
    }



function getFileHash(address _user,address _fromPatient) public view onlyAuthorizedUser(_user,_fromPatient) returns (string memory) {//user contract with permission
    // Retrieve and return the file hash
    return patients[_fromPatient].dossierHash;
}

  
function visualiserProchainsRendezVous() public view returns (Authentication.Appointment[] memory) {//patient contract 
    // Obtenez les prochains rendez-vous du patient actuel
    Patient storage patient = patients[msg.sender];
    return patient.Appointmentslist;
}

function setPublicKey(string memory _pubkey) public {
    patients[msg.sender].PublicKey = _pubkey;   
}

}*/