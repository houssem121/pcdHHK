import React, { useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { Card, ListGroup } from 'react-bootstrap';
import { ContractAssurance, ContractPatient,ContractPharmacist} from '../Contract';
import Assurance from '../components/agentassurance';
import { useEffect } from 'react';
import { DecryptFileParSante, parseJSONWithLargeNumbers } from '../utils/UpDownIPFS';


const ClaimsDashboard = (props) => {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [filterDate, setFilterDate] = useState('');



    const handleShowDetailsModal = async (claim) => {//this will downlaod the file with hash of patient  , donwload teh file , decrypt it and show the details of the patient,the patient will auto give the access to the file when he ask for refund 
        await setSelectedClaims(claim);
        await downloadFile();
        await downloadFile();
        setShowDetailsModal(true);

        await setShow(true);
    };
    const [prescriptionValid, setPrescriptionValid] = useState(false);
    const handleConfirmRefund = async () => {
        // Logique de confirmation contract assurance events of the refund     event RemboursementPrescriptionApprouve(address indexed _patient, address indexed _agentAssurance, uint256 indexed prescriptionId, uint256 _timestamp);
        const contractAssurance = await ContractAssurance(props.web3);//(uint256 prescriptionId, address _patien
        const events = await contractAssurance.methods.approuverRemboursementPrescription(selectedClaim.prescrptionID, selectedClaim.patientName).send({ from: props.account });
        console.log('events:', events);
        setConfirmationMessage('Le remboursement a été confirmé avec succès.');
        console.log('Le remboursement a été confirmé avec succès.');
        alert('Le remboursement a été confirmé avec succès.');  
        // Vous pouvez également ajouter d'autres actions ici, comme enregistrer la confirmation dans la base de données, etc.
    };

    const handleAchatMedicament = async () => {
        try {
            const contractPharmacist = await ContractPharmacist(props.web3);
            const events = await contractPharmacist.getPastEvents('PrescriptionPurchaseValidated', {
                filter: { prescriptionId: selectedClaim.prescrptionID },
                fromBlock: 0,
                toBlock: 'latest'
            });

            const isValid = events.length > 0;
            console.log('isValid:', isValid,events);
            setPrescriptionValid(isValid);

            if (isValid) {
                //en french
                setConfirmationMessage('L\'achat de médicament a été validé avec succès.');
               //make alert with some beautifuul message color and icon

                alert('L\'achat de médicament a été validé avec succès.');
                console.log('The medication purchase has been validated successfully.');
            } else {
                setConfirmationMessage('L\'achat de médicament n\'a pas été validé.');
                alert('L\'achat de médicament n\'a pas été validé.');

                console.log('The medication purchase has not been validated.');
            }
        } catch (error) {
            console.error('Error checking prescription validation:', error);
        }
    };





    const [selectedClaim, setSelectedClaims] = useState('');
    const [claims, setSelectedClaim] = useState([
        {
            patientName: 'John Doe',
            prescrptionID: '654984',
            service: 'Consultation',
            submissionDate: '2024-05-10',
        },
        {
            patientName: 'Jane Smith',
            prescrptionID: '654994',
            service: 'Radiographie',
            submissionDate: '2024-05-11',
        },
    ]);

    async function getAllAssuranceclaims() {

        try {

            const contractAssurance = await ContractPatient(props.web3);
            const events = await contractAssurance.getPastEvents('RemboursementDemande', {
                filter: { Assurance: props.account },
                fromBlock: 0,
                toBlock: 'latest'
            });
            console.log(events);
            //event RemboursementDemande(address indexed patient, uint256 recordId, string service, uint256 timestamp);

            const claims = events.map(event => {
                return {
                    patientName: event.returnValues.patient,
                    prescrptionID: event.returnValues.recordId,
                    service: event.returnValues.service,
                    //transforme the timestam change 2016/01/01 to 2016-01-01
                    submissionDate: new Date(event.returnValues.timestamp * 1000).toISOString().split('T')[0],
                };
            }
            );

            console.log(claims);

            setSelectedClaim(claims);


        }
        catch (error) {
            console.error(error);
        }
    }





    useEffect(() => {
        getAllAssuranceclaims();
        console.log('claims', claims);
    }, []);







    const filteredClaims = claims.filter(claim => claim.submissionDate.includes(filterDate));
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [patientData, setPatients] = useState({

        "Informations du patient": {
            "ID du patient": "0x123456789abcdef",
            "Nom": "chakroun mohamed",
            "Date de naissance": "2002-04-15",
            "Sexe": "Hommes",
            "Adresse": "1234 Elm Street, YourCity, YC, 12345",
            "Contact": {
                "Téléphone": "555-123-4567",
                "Email": "johndoe@example.com"
            },
            "Contact d'urgence": {
                "Nom": "Jane Doe",
                "Relation": "Épouse",
                "Téléphone": "555-987-6543"
            },
            "Assurance": {
                "Fournisseur": "XYZ Insurance",
                "Numéro de police": "123456789",
                "Numéro de groupe": "ABC123"
            }
        },
        "Dossiers médicaux": [
            {
                "id": 1,
                "timestamp": 1620124800,
                "date": "2023-01-15",
                "diagnosis": "Grippe",
                "treatment": {
                    "timestamp": 1620124800,
                    "doctor": {
                        "name": "Dr. Martin",
                        "speciality": "Médecine générale"
                    },
                    "patient": "John Doe",
                    "medicines": ["Paracétamol", "Ibuprofène"],
                    "fullyPurchased": true
                },
                "test": {
                    "timestamp": 1620124800,
                    "category": "Taux de fièvre",
                    "result": "38.5°C",
                    "done": true
                },
                "doctor": {
                    "name": "Dr. Martin",
                    "speciality": "Médecine générale"
                }
            }
        ]

    }
    );

    const downloadFile = async () => {
        try {


            // Log the patient's Ethereum address
            const agentaddress = props.account;
            console.log('agentaddress address:', agentaddress);

            // Retrieve patient details from a smart contract
            const initcontract = await ContractAssurance(props.web3);

            const patientDetails = await initcontract.methods.obtenirHashFichierDuPatient(selectedClaim.patientName).call({ from: agentaddress });

            console.log('IPFS Hash:', patientDetails);

            // Construct the URL to access the file via IPFS gateway
            const url = `https://ipfs.io/ipfs/${patientDetails}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Failed to download file: ${res.status} ${res.statusText}`);
            }
            // Parse the response into JSON
            const data = await res.json();

            // Parse the JSON string while preserving large numbers
            const parsedData = parseJSONWithLargeNumbers(data);
            console.log('parseddata', parsedData);
            console.log('Encrypted File:', parsedData.encrypted_file);
            console.log('Capsule:', parsedData.capsule);
            // Decrypt the file
            const decryptedData = await DecryptFileParSante(parsedData.encrypted_file, parsedData.capsule, selectedClaim.patientName, agentaddress);
            console.log('Decrypted File:', decryptedData);

            // Ajouter les détails du patient à la structure de données des patients
           await  setPatients(decryptedData.decrypted_file);
            console.log('Détails du patient ajoutés :', decryptedData.decrypted_file);

        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    

   
  
    




    return (
        <div className="register-comp">
        

            <h2 className="register-title">Réclamations</h2>
            <Form.Group controlId="filterDate" style={
                {
                    marginBottom: '20px'
                }

            }>
                <Form.Label>Filtrer par Date:</Form.Label>
                <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </Form.Group>
            <div className='table-container-assurance'>
                <Table striped bordered hover >
                    <thead className='sticky-header'>
                        <tr>
                            
                            <th>Date de Soumission</th>
                            <th>Ordonnance ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClaims.map((claim, index) => (
                            <tr key={index}>
                                <td>{claim.submissionDate}</td>
                                <td>{claim.prescrptionID}</td>
                                <td>
                                    <Button variant="info" onClick={() => { handleShowDetailsModal(claim) }}>Détails</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton className="bg-info text-dark">
                    <Modal.Title>Détails du patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
               
                    <Card>
                        <Card.Header className="bg-primary text-white">Informations générales</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item><strong>ID du patient:</strong> {patientData["Informations du patient"]["ID du patient"]}</ListGroup.Item>
                            <ListGroup.Item><strong>Nom:</strong> {patientData["Informations du patient"].Nom}</ListGroup.Item>
                            <ListGroup.Item><strong>Date de naissance:</strong> {patientData["Informations du patient"]["Date de naissance"]}</ListGroup.Item>
                            <ListGroup.Item><strong>Sexe:</strong> {patientData["Informations du patient"].Sexe}</ListGroup.Item>
                            <ListGroup.Item><strong>Adresse:</strong> {patientData["Informations du patient"].Adresse}</ListGroup.Item>
                            <ListGroup.Item><strong>Contact:</strong> Téléphone: {patientData["Informations du patient"].Contact.Téléphone}, Email: {patientData["Informations du patient"].Contact.Email}</ListGroup.Item>
                            <ListGroup.Item><strong>Contact d'urgence:</strong> {patientData["Informations du patient"]["Contact d'urgence"].Nom} ({patientData["Informations du patient"]["Contact d'urgence"].Relation}), Téléphone: {patientData["Informations du patient"]["Contact d'urgence"].Téléphone}</ListGroup.Item>
                            <ListGroup.Item><strong>Assurance:</strong> {patientData["Informations du patient"].Assurance.Fournisseur}, Numéro de police: {patientData["Informations du patient"].Assurance["Numéro de police"]}, Numéro de groupe: {patientData["Informations du patient"].Assurance["Numéro de groupe"]}</ListGroup.Item>
                        </ListGroup>
                    </Card>
                    <Card className="mt-3">
                        <Card.Header className="bg-primary text-white">Dossiers médicaux</Card.Header>
                        <ListGroup variant="flush">
                            {patientData["Dossiers médicaux"].map((record, index) => (
                                <ListGroup.Item key={index}>
                                    <strong>Dossier {record.id}</strong>
                                    <br />
                                    <strong>Date:</strong> {record.date}
                                    <br />
                                    <strong>Diagnostic:</strong> {record.diagnosis}
                                    <br />
                                    <strong>Docteur:</strong> {record.doctor.name} ({record.doctor.speciality}) - {record.doctor.hospital}
                                    <br />
                                    <strong>Traitement:</strong>
                                    <ul>
                                        {record.treatment.medicines.map((medication, idx) => (
                                            <li key={idx}>
                                                {medication} - {record.treatment.dosage}, {record.treatment.frequency}
                                            </li>
                                        ))}
                                    </ul>
                                    <strong>Test:</strong> {record.test.done ? `Effectué le ${record.test.date}. Catégorie: ${record.test.category}, Résultat: ${record.test.result}` : 'Non effectué'}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Modal.Body>
                <Modal.Footer>

                    <Button variant="success" onClick={handleAchatMedicament}>
                        vérification d'achat de médicament
                    </Button>
                    {/*i wwant to make it desabled until an action */}
                    <Button variant="success" onClick={handleConfirmRefund} disabled={!prescriptionValid}>
                        Confirmer le remboursement
                    </Button>
                    <Button variant="danger" onClick={handleClose}  >
                        Fermer
                    </Button>
                </Modal.Footer>

            </Modal>
        </div>
    );
};

export default ClaimsDashboard;
