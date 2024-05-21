// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract  Authentication {
enum Role { patient, doctor, researcher, pharmacist, labAgent, insuranceemployee }
    address private owner;

    struct MedicalRecord {
        uint id;
        uint timestamp;
        string date ;
        string diagnosis;
        Prescription treatment;
        Test test;
        doc doctor;
    }
    struct doc{
        string name ;
        string speciality;
    }
    struct Appointment {
        address doctor;
        address patient;
        uint256 date; // Unix timestamp for the appointment date and time
        string purpose; // Reason for the appointment or a brief description
        bool isConfirmed; // Status to track if the appointment is confirmed
        doc doctorN;
    }

    // Structure to represent a patient's medical record
    struct Test{
        
        address patient;
        uint timestamp;
        string category;
        string result;
        bool done;
    }

    
    
    // Structure to represent a prescription
     struct Prescription {
        uint id;
        uint timestamp;
        address doctor;
        address patient;
        string[] medicines; // Mapping of medicine names to instructions
        bool fullyPurchased;
    }

    

    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    // modifier to check if caller is owner
   
   struct User {
    string signatureHash;
    Role role; 
    string pubkey;
    address UserAddress;
    }
    
    mapping(address => User) private user;
    address[] private userAddresses;

    modifier isOwner() {
    
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerSet(address(0), owner);
    }
function register(string memory _signature,Role UserRole, string memory  pubkey ) public {
        require(
            user[msg.sender].UserAddress ==
                address(0x0000000000000000000000000000000000000000),
            "already registered"
        );

        user[msg.sender].signatureHash = _signature;
        user[msg.sender].role=UserRole;
        user[msg.sender].UserAddress = msg.sender;
        user[msg.sender].pubkey=pubkey;
        userAddresses.push(msg.sender);

    }
     function getSignatureHash() public view returns (string memory) {//user contract
        require(msg.sender == user[msg.sender].UserAddress, "Not allowed");

        return user[msg.sender].signatureHash;
    }

    function getUserAddress() public view returns (address) {//user contract
        return user[msg.sender].UserAddress;
    }
    function getUser(address _address) public view returns (User memory) {
        return user[_address];
    }
    function getAllUserAddresses() public view returns (address[] memory) {
        return userAddresses;
    }
}
/*contract Authentication {
    enum Role { patient, doctor, researcher, pharmacist, labAgent, insuranceemployee }
    address private owner;

    struct MedicalRecord {
        uint id;
        uint timestamp;
        string diagnosis;
        Prescription treatment;
        Test test;
        address doctor;
    }

    struct Appointment {
        address doctor;
        address patient;
        uint256 date; // Unix timestamp for the appointment date and time
        string purpose; // Reason for the appointment or a brief description
        bool isConfirmed; // Status to track if the appointment is confirmed
    }

    // Structure to represent a patient's medical record
    struct Test{
        
        address patient;
        uint timestamp;
        string category;
        string result;
        bool done;
    }

    
    
    // Structure to represent a prescription
     struct Prescription {
        uint timestamp;
        address doctor;
        address patient;
        string[] medicines; // Mapping of medicine names to instructions
        bool fullyPurchased;
    }

    

    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    // modifier to check if caller is owner
   
    struct User {
    string signatureHash;
    Role role; 
    string pubkey;
    address UserAddress;
    }

    mapping(address => User) private user;
    address[] private userAddresses;

    modifier isOwner() {
    
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerSet(address(0), owner);
    }
function register(string memory _signature,Role UserRole, string memory  pubkey ) public {
        require(
            user[msg.sender].UserAddress ==
                address(0x0000000000000000000000000000000000000000),
            "already registered"
        );

        user[msg.sender].signatureHash = _signature;
        user[msg.sender].role=UserRole;
        user[msg.sender].UserAddress = msg.sender;
        user[msg.sender].pubkey=pubkey;
        userAddresses.push(msg.sender);

    }
     function getSignatureHash() public view returns (string memory) {//user contract
        require(msg.sender == user[msg.sender].UserAddress, "Not allowed");

        return user[msg.sender].signatureHash;
    }

    function getUserAddress() public view returns (address) {//user contract
        return user[msg.sender].UserAddress;
    }
    function getUser(address _address) public view returns (User memory) {
        return user[_address];
    }
    function getAllUserAddresses() public view returns (address[] memory) {
        return userAddresses;
    }
}
*/