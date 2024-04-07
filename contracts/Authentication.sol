// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Authentication {
    enum Role { patient, doctor, researcher, pharmacist, labAgent, insuranceemployee }
    address private owner;
struct MedicalRecord {
        uint timestamp;
        string diagnosis;
        string treatment;
    }
    // event for EVM logging
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    // modifier to check if caller is owner
    modifier isOwner() {
    
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    struct User {
    string signatureHash;
    Role role; 
    address UserAddress;
    }

    mapping(address => User) private user;
    address[] private userAddresses;

    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerSet(address(0), owner);
    }
    function register(string memory _signature,Role UserRole) public {
        require(
            user[msg.sender].UserAddress ==
                address(0x0000000000000000000000000000000000000000),
            "already registered"
        );

        user[msg.sender].signatureHash = _signature;
        user[msg.sender].role=UserRole;
        user[msg.sender].UserAddress = msg.sender;
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
    function getRole() public view returns (Role) {
        return user[msg.sender].role;
    }
}
/*
contract Authentication {
    uint256 public nbOfUsers;

    struct User {
        string signatureHash;
        address userAddress;
    }

    mapping(address => User) private user;

    constructor() {
        nbOfUsers = 0;
    }

    function register(string memory _signature) public {
        require(
            user[msg.sender].userAddress ==
                address(0x0000000000000000000000000000000000000000),
            "already registered"
        );

        user[msg.sender].signatureHash = _signature;
        user[msg.sender].userAddress = msg.sender;
        nbOfUsers++;
    }

    function getSignatureHash() public view returns (string memory) {
        require(msg.sender == user[msg.sender].userAddress, "Not allowed");

        return user[msg.sender].signatureHash;
    }

    function getUserAddress() public view returns (address) {
        return user[msg.sender].userAddress;
    }
}
*/