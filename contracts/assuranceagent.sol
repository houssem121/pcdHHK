// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./Authentication.sol";
import "./patientcontract.sol";

contract AgentAssurance {

    Authentication private contratAuthInstance;
    Patients private contratPatientInstance;

    constructor(address _adresseContratAuth, address _adresseContratPatient) {
        contratAuthInstance = Authentication(_adresseContratAuth);
        contratPatientInstance = Patients(_adresseContratPatient);
    }

    struct InfoEmployeAssurance {
        string prenom;
        string nom;
        string email;
        string telephone;
        string region;
        string agenceAssurance;
    }

    mapping(address => InfoEmployeAssurance) public employesAssurance;

    event EmployeAssuranceAjoute(address indexed _nouvelEmploye, string _agenceAssurance, string _prenom, string _nom, string _region);

    function enregistrerEmploye(
        string memory _prenom,
        string memory _nom,
        string memory _email,
        string memory _telephone,
        string memory _region,
        string memory _agenceAssurance
    ) public {
        require(obtenirUtilisateur().role == Authentication.Role.insuranceemployee, "Seuls les employes d'assurance peuvent s'enregistrer.");
        InfoEmployeAssurance storage employe = employesAssurance[msg.sender];
        employe.prenom = _prenom;
        employe.nom = _nom;
        employe.email = _email;
        employe.telephone = _telephone;
        employe.region = _region;
        employe.agenceAssurance = _agenceAssurance;
        
        emit EmployeAssuranceAjoute(msg.sender, _agenceAssurance, _prenom, _nom, _region);
    }

    function obtenirHashFichierDuPatient(address _duPatient) public view returns (string memory) {
        return contratPatientInstance.getFileHash(msg.sender, _duPatient);
    }

    function obtenirUtilisateur() public view returns (Authentication.User memory) {
        return contratAuthInstance.getUser(msg.sender);
    }

    event RemboursementPrescriptionApprouve(address indexed _patient, address indexed _agentAssurance, uint256 indexed prescriptionId, uint256 _timestamp);

    function approuverRemboursementPrescription(uint256 prescriptionId, address _patient) public {
        require(obtenirUtilisateur().role == Authentication.Role.insuranceemployee, "Seuls les employes d'assurance peuvent approuver les remboursements de prescriptions");

        emit RemboursementPrescriptionApprouve(_patient, msg.sender, prescriptionId, block.timestamp);
    }

    event DemandeAccesCreee(Authentication.Role typeDemandeur, address adresseDemandeur, address adressePatient);

    function demanderAcces(Authentication.Role _typeDemandeur, address _patient) public {
        emit DemandeAccesCreee(_typeDemandeur, msg.sender, _patient);
    }
}