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

event ReimbursementRequested(address indexed patient, uint256 timestamp);

function demanderemboursement() public {//this will emit an event in the blockchain so the agent see it and then ...;patient contract
    //require(getUser().role == Authentication.Role.patient, "Only patients can submit reimbursement requests");
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

}






/*
contract Patients  {
 
    Authentication private contractRInstance;

  constructor(address _contractBAddress) {
        contractRInstance = Authentication(_contractBAddress);
    }
struct Appointment {
    string date;
    string time;
    string doctorName;
    string location;
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
    Appointment[] Appointments;
    //here i will add records option but its should contain both test and ordonnance 
}






mapping(address => Patient) public patients;

function registerUserDetails( string memory _firstname,string memory _lastname,uint _age,address   _authorizedUsers,string memory _dossierHash)public   
{//we can use a struct json from the webapp 
        require(getUser().role == Authentication.Role.patient, "Only patients can submit this type ");
        Patient storage patient = patients[msg.sender];
        patient.firstname = _firstname;
        patient.lastname = _lastname;
        patient.age = _age;
        patient.authorizedUsers.push(_authorizedUsers);
        patient.dossierHash = _dossierHash;//optional

       
}



//open for more modifications other users 
   function getUser() public view   returns (Authentication.User memory) {
        return contractRInstance.getUser(msg.sender);
    }
    function getPatient() public view   returns (Patient memory) {
        return patients[msg.sender];
    }



event ReimbursementRequested(address indexed patient, uint256 timestamp);

function demanderemboursement() public {//this will emit an event in the blockchain so the agent see it and then ...;patient contract
    //require(getUser().role == Authentication.Role.patient, "Only patients can submit reimbursement requests");
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

function isAuthorized(address _user,address _fromPatient) internal view returns (bool) {//patient contract
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

  
function visualiserProchainsRendezVous() public view returns (Appointment[] memory) {//patient contract 
    // Obtenez les prochains rendez-vous du patient actuel
    Patient storage patient = patients[msg.sender];
    return patient.Appointments;
}

 function addAppointment(//called by the doctor
        string memory _date,
        string memory _time,
        string memory _doctorName,
        string memory _location
    ) public {
        // Ensure that only patients can add appointments
        require(getUser().role == Authentication.Role.doctor, "Only doctors can add appointments.");

        // Create the new appointment
        Appointment memory newAppointment = Appointment({
            date: _date,
            time: _time,
            doctorName: _doctorName,
            location: _location
        });

        // Add the new appointment to the patient's appointments array
        patients[msg.sender].Appointments.push(newAppointment);
    }

}*/