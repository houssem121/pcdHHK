import React, { useState } from 'react';
import { Tabs, Tab, Button, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import './Appointments.css';
import { Modal, Card, ListGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { DecrypteFile, parseJSONWithLargeNumbers, handleFileUpload,generateReEncryptionKey } from '../utils/UpDownIPFS';
import { useEffect } from 'react';
import { ContractDoctor } from '../Contract'; // Import unique suffisant
import { ContractPatient, ContractPharmacist,ContractAssurance } from '../Contract'; // Import unique suffisant

function Services(props) {
    //all data later will be fetched from the blockchain 

    const { contractPatients } = props;
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedPharmacist, setSelectedPharmacist] = useState('');
    const [selectedInsuranceAgent, setSelectedInsuranceAgent] = useState('');

  
    const [patient, setPatients] = useState({
        record: [
            {
                id: 1,
                timestamp: 1620124800,
                date: "2024-05-01",
                diagnosis: "Grippe",
                treatment: {
                    timestamp: 1620124800,
                    doctor: props.doctorAddress,
                    patient: props.patientAddress,
                    medicines: ["Paracétamol", "Ibuprofène"],
                    fullyPurchased: true
                },
                test: {
                    timestamp: 1620124800,
                    category: "Taux de fièvre",
                    result: "38.5°C",
                    done: true
                },
                doctor: {
                    name: "Dr. Martin",
                    speciality: "Médecine générale"
                }
            }
        ]
    });

    const getRecord= async()=>{
        try {
            const patientAddress = props.account;
            const contractpatient = await ContractPatient(props.web3);
            const patientDetails = await contractpatient.methods.getPatients(patientAddress).call();
            setPatients({
                record: patientDetails.record
            });
            console.log('Détails du patient :', patientDetails.record);
        } catch (error) {
            console.error('Erreur lors de la récupération des rendez-vous du patient :', error);
        }
    }
    useEffect(() => {
        getRecord();
    }, [ ]);




    const service = "serviceassurance";

    const prescriptionId = new Date().getTime();




    /* //const [doctors, setDoctors] = useState([]);
     const doctors = [
         { name: 'patrivk', address: '0x02ecd02478634b0f1c44bd9a975fef0db8b4cbfc', region: 'Paris' },
         { name: 'mohesen', address: '0x02ecd02478634b0f1c44bd9a975fef0db8b4cbfc', region: 'Lyon' },
         { name: 'chokri', address: '0x02ecd02478634b0f1c44bd9a975fef0db8b4cbfc', region: 'Marseille' }
 
     ];*/
    const [doctors, setDoctors] = useState([]);

    // Fonction pour récupérer et filtrer les événements doctoradded
    const selectedDoctors = (doctor) => {
        setSelectedDoctor(doctor);
    };
    const setselectedfake = (selectedDoctor) => {
        console.log('selectedDoctor', selectedDoctor);
    }
    async function getAllDoctorAddedEvents() {
        try {
            const contractDocteur = await ContractDoctor(props.web3);
            const events = await contractDocteur.getPastEvents('doctoradded', {
                fromBlock: 0,
                toBlock: 'latest'
            });

            // Créer une liste d'objets contenant les informations des docteurs
            const doctorsList = events.map(event => ({
                address: event.returnValues._newEmployee,
                name: event.returnValues._department,
                region: event.returnValues._location,

            }));

            // Mettre à jour l'état avec les nouveaux docteurs récupérés
            setDoctors(doctorsList);

            console.log('Liste des docteurs mise à jour:', doctorsList);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements doctoradded:', error);
            throw error;
        }
    }
    //event pharmaciensadded(address indexed _newEmployee, string  _firstname,string _lastname,string _location,string _pharmacie,string _pharmacieid);
    const [pharmacists, setPharmacistss] = useState([]);
    async function getAllPharmacistAddedEvents() {
        try {
            const contractPharmacist = await ContractPharmacist(props.web3);
            const events = await contractPharmacist.getPastEvents('pharmaciensadded', {
                fromBlock: 0,   
                toBlock: 'latest'
            });

            // Créer une liste d'objets contenant les informations des pharmaciens
            const pharmacistsList = events.map(event => ({
                address: event.returnValues._newEmployee,
                name: event.returnValues._firstname,
                region: event.returnValues._location,
                pharmacy: event.returnValues._pharmacie,
                pharmacyID: event.returnValues._pharmacieid
            }));

            // Mettre à jour l'état avec les nouveaux pharmaciens récupérés
            setPharmacistss(pharmacistsList);

            console.log('Liste des pharmaciens mise à jour:', pharmacistsList);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements pharmaciensadded:', error);
            throw error;
        }
    }








    // Appeler getAllDoctorAddedEvents au montage du composant
    useEffect(() => {
        getAllDoctorAddedEvents();
        getAllPharmacistAddedEvents();
        getAllAssuranceAddedEvents();
    }, []);

   
//    event EmployeAssuranceAjoute(address indexed _nouvelEmploye, string _agenceAssurance, string _prenom, string _nom, string _region);
const [insuranceAgents, setInsuranceAgents] = useState([]);

async function getAllAssuranceAddedEvents() {
    try {
        const contractAssurance = await ContractAssurance(props.web3);
        const events = await contractAssurance.getPastEvents('EmployeAssuranceAjoute', {
            fromBlock: 0,
            toBlock: 'latest'
        });

        // Créer une liste d'objets contenant les informations des agents d'assurance
        const assuranceList = events.map(event => ({
            address: event.returnValues._nouvelEmploye,
            name: event.returnValues._prenom + ' ' + event.returnValues._nom,
            region: event.returnValues._region,
            agency: event.returnValues._agenceAssurance,

        }));

        // Mettre à jour l'état avec les nouveaux agents d'assurance récupérés
        setInsuranceAgents(assuranceList);

        console.log('Liste des agents d\'assurance mise à jour:', assuranceList);
    } catch (error) {
        console.error('Erreur lors de la récupération des événements EmployeAssuranceAjoute:', error);
        throw error;
    }
}





    const handleDoctorSelection = async () => {
        try {
            console.log('Médecin sélectionné :', selectedDoctor);
            await contractPatients.methods.notifierVisiteMedecin(props.account, selectedDoctor.address).send({ from: props.account });
            await contractPatients.methods.AuthorizeUser(selectedDoctor.address).send({ from: props.account });
        
            console.log('Demande de visite de médecin notifiée avec succès');

        }

        catch (error) {
            console.error('Erreur lors de la notification de la visite de médecin :', error);
        }


    };

    const handlePharmacistSelection = async () => {
        console.log('Pharmacien sélectionné :', selectedPharmacist);
        try {
        
            await contractPatients.methods.notifierAchatOrdonnance(props.account, selectedRecordId,selectedPharmacist.address).send({ from: props.account });
            await contractPatients.methods.AuthorizeUser(selectedPharmacist.address).send({ from: props.account });
            console.log('Demande d\'achat d\'ordonnance notifiée avec succès');
        } catch (error) {
            console.error('Erreur lors de la notification de l\'achat d\'ordonnance :', error);
        }
    };

    const handleInsuranceAgentSelection = async () => {
        console.log('Agent d\'assurance sélectionné :', selectedInsuranceAgent);//function notifierDemandeRemboursement(address _patient, uint256 recordId, string memory _service) external {//i will add prescription id here 
        try {
            const assuranced=await  props.contract.methods.getUser(selectedInsuranceAgent.address).call();
            console.log('assuranced',assuranced);
            generateReEncryptionKey(props, assuranced.pubkey,props.account, selectedInsuranceAgent.address);

            await contractPatients.methods.notifierDemandeRemboursement(props.account, selectedRecordId, selectedInsuranceAgent.agency).send({ from: props.account });
            await contractPatients.methods.AuthorizeUser(selectedInsuranceAgent.address).send({ from: props.account });
            console.log('Demande de remboursement notifiée avec succès');
        } catch (error) {
            console.error('Erreur lors de la notification de la demande de remboursement :', error);
        }

    };




    //modal


    const handleSelectRecord = (recordId) => {
        setSelectedRecordId(recordId);
        const record = patient.record.find((record) => record.id === recordId);
        setSelectedRecord(record);
        setShowModal(true);
        console.log('Enregistrement sélectionné :', record);
    };

    const handleCloseModal = () => {
        setShowModal(false);

        console.log('Fermeture de la fenêtre modale');
    };




    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPharmacists, setFilteredPharmacists] = useState([]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filter pharmacists based on search query
        const filtered = pharmacists.filter(pharmacist =>
            pharmacist.region.toLowerCase().includes(query.toLowerCase()) ||
            pharmacist.pharmacyID.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredPharmacists(filtered);
    };
    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.region.toLowerCase().includes(searchQuery.toLowerCase())
    );



    // Filter insurance agents based on search query
    const filteredInsuranceAgents = insuranceAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.address.toLowerCase().includes(searchQuery.toLowerCase())
    );



    return (
        <div className="services-container">

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Détails du patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRecord && (
                        <>
                            <Card>
                                <Card.Header className="bg-primary text-white">Informations générales</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>ID du prescription:</strong> {selectedRecord.id}</ListGroup.Item>
                                    <ListGroup.Item><strong>Date:</strong> {selectedRecord.date}</ListGroup.Item>
                                    <ListGroup.Item><strong>Diagnostic:</strong> {selectedRecord.diagnosis}</ListGroup.Item>
                                    <ListGroup.Item><strong>Docteur:</strong> {selectedRecord.doctor.name} ({selectedRecord.doctor.speciality})</ListGroup.Item>
                                </ListGroup>
                            </Card>
                            <Card className="mt-3">
                                <Card.Header className="bg-primary text-white">Dossiers médicaux</Card.Header>
                                <ListGroup variant="flush">
                                    {selectedRecord.treatment && (
                                        <ListGroup.Item>
                                            <strong>Traitement:</strong>
                                            <ul>
                                                {selectedRecord.treatment.medicines.map((medication, idx) => (
                                                    <li key={idx}>
                                                        {medication}
                                                    </li>
                                                ))}
                                            </ul>
                                        </ListGroup.Item>
                                    )}
                                    {selectedRecord.test && (
                                        <ListGroup.Item>
                                            <strong>Test:</strong> {selectedRecord.test.done ? `Effectué le ${selectedRecord.test.date}. Catégorie: ${selectedRecord.test.category}, Résultat: ${selectedRecord.test.result}` : 'Non effectué'}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            <Tabs defaultActiveKey="buyMedicine" id="uncontrolled-tab-example" className="custom-tabs">
                <Tab eventKey="buyMedicine" title="Acheter des médicaments">



                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Sélectionner un enregistrement
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {patient.record.map((record, index) => (
                                <Dropdown.Item key={index} onClick={() => handleSelectRecord(record.id)}>
                                    {record.id}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="show-selected-record">
                        <h3 style={{ color: 'black' }}>Enregistrement sélectionné :</h3>
                        <p>{selectedRecordId}</p>
                    </div>

                    <div className="tab-content1">
                        <h3 style={{
                            padding:
                                '10px 0px 10px 0px', color: 'black'
                        }}>Liste des pharmaciens disponibles :</h3>
                        <FormControl
                            style={
                                { marginBottom: '10px' }
                            }
                            type="text"
                            placeholder="Rechercher par région ou ID de pharmacie"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <Table striped bordered hover className="pharmacist-table">
                            <thead>
                                <tr>
                                    <th>Sélectionner</th>
                                    <th>Nom du pharmacien</th>
                                    <th>Région</th>
                                    <th>ID de la pharmacie</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPharmacists.map((pharmacist, index) => (
                                    <tr key={index} className="pharmacist-row">
                                        <td className="radio-cell">
                                            <input
                                                type="radio"
                                                id={`pharmacist${index}`}
                                                checked={selectedPharmacist === pharmacist}
                                                onChange={() => setSelectedPharmacist(pharmacist)}
                                            />
                                            <label htmlFor={`pharmacist${index}`} className="radio-label"></label>
                                        </td>
                                        <td>{pharmacist.name}</td>
                                        <td>{pharmacist.region}</td>
                                        <td>{pharmacist.pharmacyID}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </div>
                    <Button disabled={!selectedPharmacist} onClick={handlePharmacistSelection}>Select this pharmacist</Button>

                </Tab>




                <Tab eventKey="visitDoctor" title="Visiter un médecin">
                    <div className="tab-content">
                        <h3 style={{
                            padding:
                                '10px 0px 10px 0px', color: 'black'
                        }}>Liste des médecins disponibles :</h3>
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou région..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="form-control mb-3"
                        />

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sélectionner</th>
                                    <th>specialité</th>
                                    <th>Région</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors.map((doctor, index) => (
                                    <tr key={index} className='doctor-row'>
                                        <td className="radio-cell">
                                            <input
                                                type="checkbox"
                                                checked={selectedDoctor === doctor}
                                                onChange={() => { setselectedfake(doctor.name); selectedDoctors(doctor); }}
                                            />
                                        </td>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.region}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <Button disabled={!selectedDoctor} onClick={handleDoctorSelection}>Prendre rendez-vous avec ce médecin</Button>

                </Tab>


                <Tab eventKey="requestRefund" title="Demander un remboursement">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Sélectionner un enregistrement
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {patient.record.map((record, index) => (
                                <Dropdown.Item key={index} onClick={() => handleSelectRecord(record.id)}>
                                    {record.id}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="show-selected-record">
                        <h3 style={{ color: 'black' }}>Enregistrement sélectionné :</h3>
                        <p>{selectedRecordId}</p>
                    </div>
                    <div className="tab-content">
                        <h3 style={{
                            padding:
                                '10px 0px 10px 0px', color: 'black'
                        }}>Liste des agents d'assurance disponibles :</h3>
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou adresse..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="form-control mb-3"
                        />
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sélectionner</th>
                                    <th>Nom de l'agent d'assurance</th>
                                    <th>Nom d'agence </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInsuranceAgents.map((agent, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="radio"
                                                checked={selectedInsuranceAgent && selectedInsuranceAgent.address === agent.address}
                                                onChange={() => setSelectedInsuranceAgent({ name: agent.name, address: agent.address , agency: agent.agency})}
                                            />
                                        </td>
                                        <td>{agent.name}</td>
                                        <td>{agent.agency}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <Button disabled={!selectedInsuranceAgent} onClick={handleInsuranceAgentSelection}>Demander le remboursement à cet agent</Button>

                </Tab>

            </Tabs >
        </div >
    );
}

export default Services;
