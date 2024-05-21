// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./Authentication.sol";
import "./patientcontract.sol";
contract DoctorContract {
    Authentication private registerInstance;
    Patients private contractPAInstance;
    struct Doctor {
        address doctorAddress;
        string firstname;
        string lastname;
        string specialty;
        string location;
        address[] patientsList;
        Authentication.Appointment[] appointmentsList;
    }

    constructor(address _registerInstance, address _contractBAddress) {
        registerInstance = Authentication(_registerInstance);
        contractPAInstance = Patients(_contractBAddress);
    }

    mapping(address => Doctor) public doctors;
    mapping(uint16 => Authentication.Test) public tests;
    mapping(uint16 => Authentication.Prescription) public Prescriptions;

    event doctoradded(address  _newEmployee, string  _department,string  _location);

    function registerUserDetails(
        string memory _firstname,
        string memory _lastname,
        string memory _specialty,
        string memory _location
    ) public {
        // Ensure only patients can call this function
        require(
            getUser().role == Authentication.Role.doctor,
            "Only doctors can submit this type "
        );

        // Create a new doctor record
        Doctor storage newDoctor = doctors[msg.sender];
        newDoctor.doctorAddress = msg.sender;
        newDoctor.firstname = _firstname;
        newDoctor.lastname = _lastname;
        newDoctor.specialty = _specialty;
        newDoctor.location = _location;
        // Optionally, emit an event or perform any additional logic
        emit doctoradded(msg.sender, _specialty, _location);
    }

    function getUser() public view returns (Authentication.User memory) {
        return registerInstance.getUser(msg.sender);
    }

    // Function to check if an address exists in the patientsList array
    

    modifier onlyAuthorizedDoctor(address _doctor, address _patient) {
        require(
            getUser().role == Authentication.Role.doctor,
            "Only doctors can submit this type "
        );
        require(
            contractPAInstance.isAuthorized(_doctor, _patient),
            "Unauthorized user"
        );
        _;
    }

    function scheduleAppointment(
        address _patient,
        uint256 _date,
        string memory _purpose
    ) public onlyAuthorizedDoctor(msg.sender, _patient) {
        // Ensure the appointment date is in the future
        require(_date > block.timestamp, "Invalid appointment date");
        Authentication.doc memory medecin = Authentication.doc({
            name: doctors[msg.sender].firstname,
            speciality: doctors[msg.sender].specialty
        });
        // Create the appointment
        Authentication.Appointment memory newAppointment = Authentication
            .Appointment({
                doctor: msg.sender,
                patient: _patient,
                date: _date,
                purpose: _purpose,
                isConfirmed: true,
                doctorN: medecin
            });

        // Add the appointment to the doctor's list and add patient to the doctor's patient list

        doctors[msg.sender].patientsList.push(_patient);    
        doctors[msg.sender].appointmentsList.push(newAppointment);
        contractPAInstance.addAppointment(_patient, newAppointment);
    }

    function NextAppointments()
        public
        view
        returns (Authentication.Appointment[] memory)
    {
        return doctors[msg.sender].appointmentsList;
    }

    // Event to log the creation of a medical record
    event MedicalRecordCreated(
        address indexed patient,
        string diagnosis,
        address indexed doctor,
        string[] medicines,
        string category,
        string result
    );

    // Event to log the creation of a prescription
    event PrescriptionCreated(
        address indexed doctor,
        address indexed patient,
        string[] medicines,
        bool fullyPurchased
    );

    // Event to log the creation of a test
    event TestCreated(
        address indexed patient,
        string category,
        string result,
        bool done
    );

    uint256 private nonce = 0;
    uint16 private newPrescriptionId;
    uint16 private newRecordId;
    uint16 private newTestId;

    function randomId() private returns (uint16) {
        nonce++;
        return
            uint16(
                uint256(
                    keccak256(
                        abi.encodePacked(block.timestamp, msg.sender, nonce)
                    )
                ) % 65536
            );
    }

    event PrintNewRecordId(uint16 newRecordId);

    //this function should be called aftfer the creation of test or Prescription
    function createMedicalRecord(
        address _patient,
        string memory _diagnosis,
        string memory date
    ) public onlyAuthorizedDoctor(msg.sender, _patient) {
        newRecordId = randomId();
        Authentication.doc memory medecin = Authentication.doc({
            name: doctors[msg.sender].firstname,
            speciality: doctors[msg.sender].specialty
        });
        Authentication.MedicalRecord memory newRecord = Authentication
            .MedicalRecord({
                id: newRecordId,
                date: date,
                timestamp: block.timestamp,
                diagnosis: _diagnosis,
                treatment: Prescriptions[newPrescriptionId], // Assurez-vous que cet ID a été utilisé pour créer une prescription
                test: tests[newTestId], // Assurez-vous que cet ID a été utilisé pour créer un test
                doctor: medecin
            });

        contractPAInstance.addrecordtoPatient(newRecord, _patient);
        emit MedicalRecordCreated(
            _patient,
            _diagnosis,
            msg.sender,
            Prescriptions[newRecordId].medicines,
            tests[newRecordId].category,
            tests[newRecordId].result
        );
        emit PrintNewRecordId(newRecordId); // Émettre l'événement pour "imprimer" newRecordId
    }

    function createPrescription(
        address _patient,
        string[] memory _medicines,
        bool _fullyPurchased
    ) public onlyAuthorizedDoctor(msg.sender, _patient) returns (uint256) {
        newPrescriptionId = randomId();
        Authentication.Prescription memory newPrescription = Authentication
            .Prescription({
                id: newPrescriptionId,
                timestamp: block.timestamp,
                doctor: msg.sender,
                patient: _patient,
                medicines: _medicines,
                fullyPurchased: _fullyPurchased
            });
        Prescriptions[newPrescriptionId] = newPrescription;
        emit PrescriptionCreated(
            msg.sender,
            _patient,
            _medicines,
            _fullyPurchased
        );
        return newPrescriptionId;
    }

    function createTest(
        address _patient,
        string memory _category,
        string memory _result,
        bool _done
    ) public onlyAuthorizedDoctor(msg.sender, _patient) returns (uint256) {
        newTestId = randomId();
        Authentication.Test memory newTest = Authentication.Test({
            patient: _patient,
            timestamp: block.timestamp,
            category: _category,
            result: _result,
            done: _done
        });
        tests[newTestId] = newTest;
        emit TestCreated(_patient, _category, _result, _done);
        return newTestId;
    }

    function getFileHashFP(
        address _fromPatient
    ) public view returns (string memory) {
        return contractPAInstance.getFileHash(msg.sender, _fromPatient);
    }

    function getPatientlist() public view returns (address[] memory) {
        return doctors[msg.sender].patientsList;
    }

    // Event to emit when a request to access medical file is made
    event AccessRequestMade(address requester, address patient,string publicKey,string doctorname,string role ,uint256 date);

    // Function to make a request to access a patient's medical file
    function requestAccess(address _patient) public {
        // Emit the event to indicate the access request
        emit AccessRequestMade(msg.sender, _patient,registerInstance.getUser(msg.sender).pubkey,doctors[msg.sender].firstname,"docteur",block.timestamp);
    }
}

/*function isPatientInDoctor(
        address _doctor,
        address _targetAddress
    ) public view returns (bool) {
        for (uint256 i = 0; i < doctors[_doctor].patientsList.length; i++) {
            if (doctors[_doctor].patientsList[i] == _targetAddress) {
                return true;
            }
        }
        return false;
    }

    function PatientIndex(
        address _doctor,
        address _patient
    ) public view returns (uint256) {
        for (uint256 i = 0; i < doctors[_doctor].patientsList.length; i++) {
            if (doctors[_doctor].patientsList[i] == _patient) {
                return i;
            }
        }
        return 0;
    } */