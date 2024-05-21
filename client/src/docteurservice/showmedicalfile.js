import React, { useState } from 'react';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import { Tabs, Tab } from 'react-bootstrap';
import { ContractDoctor, ContractPatient } from '../Contract';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCheck, faPrescriptionBottleAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { DecryptFileParSante, parseJSONWithLargeNumbers } from '../utils/UpDownIPFS';
import { List } from 'semantic-ui-react';
const PrescriptionForm = (props) => {
    //all data later will be fetched from the blockchain 
    const [patients, setPatients] = useState([
        {
            "Informations du patient": {
                "ID du patient": "0xabcdef9876543211",
                "Nom": "Fatima Ben Salah",
                "Date de naissance": "1990-06-25",
                "Sexe": "Femme",
                "Adresse": "Rue des Jasmins, Tunis",
                "Contact": {
                    "Téléphone": "987-654-3210",
                    "Email": "fatimabensalah@example.com"
                },
                "Contact d'urgence": {
                    "Nom": "Mohamed Ben Salah",
                    "Relation": "Frère",
                    "Téléphone": "123-456-7890"
                },
                "Assurance": {
                    "Fournisseur": "Assurance Santé Tunisie",
                    "Numéro de police": "555666777",
                    "Numéro de groupe": "ABCDEF"
                }
            },
            "Dossiers médicaux": []
        },
        {
            "Informations du patient": {
                "ID du patient": "0xabcdef9876543211",
                "Nom": "Fatima Ben Salah",
                "Date de naissance": "1990-06-25",
                "Sexe": "Femme",
                "Adresse": "Rue des Jasmins, Tunis",
                "Contact": {
                    "Téléphone": "987-654-3210",
                    "Email": "fatimabensalah@example.com"
                },
                "Contact d'urgence": {
                    "Nom": "Mohamed Ben Salah",
                    "Relation": "Frère",
                    "Téléphone": "123-456-7890"
                },
                "Assurance": {
                    "Fournisseur": "Assurance Santé Tunisie",
                    "Numéro de police": "555666777",
                    "Numéro de groupe": "ABCDEF"
                }
            },
            "Dossiers médicaux": []
        }
    ]);

    const appointments = [
        {
            doctorN: {
                name: 'Dr. John Doe',
                speciality: 'Cardiologue'
            },
            date: 1630514400,
            patient: 'Jean Dupont',
            purpose: 'Consultation de suivi'
        },
        {
            doctorN: {
                name: 'Dr. Jane Smith',
                speciality: 'Dentiste'
            },
            date: 1630514400,
            patient: 'Marie Martin',
            purpose: 'Extraction de dent'
        },


    ]

    const [showModal1, setShowModal1] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState({
        "Informations du patient": {
            "ID du patient": "0x123456789abcdef1",
            "Nom": "Jean Dupont",
            "Date de naissance": "1990-05-20",
            "Sexe": "Homme",
            "Adresse": "123 rue de la Santé, Paris",
            "Contact": {
                "Téléphone": "123-456-7890",
                "Email": "jeandupont@example.com"
            },
            "Contact d'urgence": {
                "Nom": "Marie Dupont",
                "Relation": "Conjoint",
                "Téléphone": "987-654-3210"
            },
            "Assurance": {
                "Fournisseur": "Assurance Santé XYZ",
                "Numéro de police": "987654321",
                "Numéro de groupe": "ABC123"
            }
        },
        "Dossiers médicaux": []
    });
    const [Appointments, setAppointments] = useState([]);
    const handleConfirmAppointment = (appointment) => {
        console.log('Confirmation du rendez-vous...');
        // Implémentez ici la logique pour confirmer le rendez-vous
        console.log('Liste des patients récupérée avec succès biglis:', patientlist);

    };

    const [medicines, setMedicines] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [fullyPurchased, setFullyPurchased] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

 

    const handleCreatePrescription = async () => {
        // Validez les champs obligatoires
        console.log('Création de l\'ordonnance...');
        console.log('Patient:', selectedPatient);
        console.log('Médicaments:', medicineList );
        console.log('Dosage:', dosage);
        console.log('Fréquence:', frequency);
        console.log('Achat complet:', fullyPurchased);
        // Réinitialiser les champs après la création de la prescription
        console.log('Patient:', patientlist[0]);
       const preID =  await props.ContractDoctor.methods.createPrescription(patientlist[0], medicineList, fullyPurchased).send({ from: props.account });
        // Afficher un message de confirmation
        setConfirmationMessage('L\'ordonnance a été créée avec succès.');
        await props.ContractDoctor.methods.createMedicalRecord(patientlist[0],dosage+frequency,todaydate).send({ from: props.account });
        // Fermer le modal
        console.log('prescription ID:', preID.newPrescriptionId);
        setShowModal(false);
    };
    //normal date like 2021-09-01T10:00
    const todaydate = new Date().toISOString().slice(0, 16);


    const confirmationMessages = () => {
        console.log(selectedPatient["Informations du patient"].Nom);
        console.log(selectedPatient["Informations du patient"]["Date de naissance"]);
        console.log(selectedPatient["Informations du patient"].Adresse);

    }
    const  [medicineList, setMedicineList] = useState([]);
    const handleAddMedicine = () => {
        if (medicines.trim() !== '') {
            setMedicineList(prevList => [...prevList, medicines]);
            setMedicines('');
        }
    };



    const [appointments1, setAppointments1] = useState([]);
    async function getAllRequestAppointments() {
        try {
            const contractpatient = await ContractPatient(props.web3);

            const events = await contractpatient.getPastEvents('VisiteMedecinEffectuee', {
                filter: { doctor: props.account }, // Filtrer les événements pour le médecin actuel
                fromBlock: 0,
                toBlock: 'latest'
            });
            const initcontract = await ContractDoctor(props.web3);

            const precriptionevent=await initcontract.getPastEvents('PrescriptionCreated', {
                filter: { doctor: props.account }, // Filtrer les événements pour le médecin actuel
                fromBlock: 0,
                toBlock: 'latest'
            });
            console.log('Liste des prescription:', precriptionevent);
            // Créer une liste d'objets contenants les informations des patients from event event VisiteMedecinEffectuee(address indexed patient, address indexed doctor, uint256 timestamp,string firstname,string lastname);

            const patientList1 = events.map((event) => {
                return {
                    patient: event.returnValues.patient,
                    doctor: event.returnValues.doctor,
                    timestamp: event.returnValues.timestamp,
                    firstname: event.returnValues.firstname,
                    lastname: event.returnValues.lastname
                };
            });
            // Mettre à jour l'état avec les nouveaux docteurs récupérés
            setAppointments1(patientList1);
            console.log('Liste des patients récupérée avec succès:', patientList1);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements doctoradded:', error);
            throw error;
        }
    }
   

    const [patientlist, setPatientlistsss] = useState(
      []
    );

    
    useEffect(() => {
        getAllRequestAppointments();
        downloadFile();


    }, [props.account]);



    const [formData, setFormData] = useState({
        doctorName: '',
        doctorSpeciality: '',
        appointmentDate: '',
        appointmentPurpose: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const [selectedPatientR, setSelectedPatientR] = useState([]);
    const transformeDateToTimestamp = (date) => {//this type of date is 2021-09-01T10:00
        const dateArray = date.split('T');
        const datePart = dateArray[0].split('-');
        const timePart = dateArray[1].split(':');
        const timestamp = new Date(datePart[0], datePart[1] - 1, datePart[2], timePart[0], timePart[1]).getTime() / 1000;
        return timestamp;
    };

    const handleCreateAppointment = async (e) => {
        try {
            e.preventDefault();
            console.log('Création du rendez-vous...pour patient :', selectedPatientR.firstname, selectedPatientR.lastname, selectedPatientR.timestamp);
            console.log(formData);
            await props.ContractDoctor.methods.scheduleAppointment(selectedPatientR.patient, transformeDateToTimestamp(formData.appointmentDate), formData.appointmentPurpose).send({ from: props.account });
            await props.ContractDoctor.methods.requestAccess(selectedPatientR.patient).send({ from: props.account });//request access to the patient file

            setShowModal1(false);

        }
        catch (error) {
            console.error('Erreur lors de la création du rendez-vous:', error);
            throw error;
        }


    };



    const downloadFile = async () => {
        try {
            const initcontracts = await ContractDoctor(props.web3);
            const doctorpatientlist = await initcontracts.methods.getPatientlist().call({ from: props.account });
    
            console.log('Liste des patients récupérée avec succès :', doctorpatientlist);
    
            // Créer un ensemble pour stocker les adresses uniques
            const adressesUniques = new Set(doctorpatientlist);
    
            // Convertir l'ensemble en tableau
            const tableauAdressesUniques = Array.from(adressesUniques);
    
            console.log('Liste des adresses uniques des patients :', tableauAdressesUniques);
    
            tableauAdressesUniques.forEach((adresse) => {
                setPatientlistsss((prevList) => {
                    // Vérifier si l'adresse n'est pas déjà présente dans la liste
                    if (!prevList.includes(adresse)) {
                        return [...prevList, adresse]; // Ajouter l'adresse à la liste existante
                    } else {
                        return prevList; // Si l'adresse est déjà présente, retourner la liste sans modification
                    }
                });
            });
            console.log('Liste des patients récupérée avec succès :', patientlist);



            
            // Log the patient's Ethereum address
            const DoctorAddress = props.account;
            console.log('Doctor address:', DoctorAddress);

            // Retrieve patient details from a smart contract
            const initcontract = await ContractDoctor(props.web3);
            
            const patientDetails = await initcontract.methods.getFileHashFP(tableauAdressesUniques[0]).call({ from: DoctorAddress });

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
            const decryptedData = await DecryptFileParSante(parsedData.encrypted_file, parsedData.capsule, tableauAdressesUniques[0], DoctorAddress);
            console.log('Decrypted File:', decryptedData);

            // Ajouter les détails du patient à la structure de données des patients
            setPatients([decryptedData.decrypted_file]);
            console.log('Détails du patient ajoutés :', decryptedData.decrypted_file);


        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className="register-comp">
            <h2 className="text-center">Services Docteur</h2>
            <Tabs defaultActiveKey="patients" id="prescription-tabs" className="custom-tabs">
                {/* Onglet pour afficher la liste des patients */}
                <Tab eventKey="patients" title="Ordonnances">
                    <div className='table-container-patient'>
                        <Table striped bordered hover responsive="md" className="custom-table">
                            <thead className='sticky-header'>
                                <tr>
                                    <th>Nom du patient</th>
                                    <th>Date de naissance</th>
                                    <th>Adresse</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient, index) => (
                                    <tr key={index}>
                                        <td>{patient["Informations du patient"].Nom}</td>
                                        <td>{patient["Informations du patient"]["Date de naissance"]}</td>
                                        <td>{patient["Informations du patient"].Adresse}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => { setSelectedPatient(patient); setShowModal(true); confirmationMessages(); }}>
                                                <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="mr-2" />
                                                Créer Ordonnance
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </div>
                </Tab>
                {/* Onglet pour afficher la liste des prochains rendez-vous */}
                {  /*<Tab eventKey="nextAppointments" title="Prochains rendez-vous">
                   
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date et heure</th>
                                <th>Patient</th>
                                <th>Motif</th>

                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{new Date(appointment.date * 1000).toLocaleString()}</td>
                                    <td>{appointment.patient}</td>
                                    <td>{appointment.purpose}</td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>*/}

                <Tab eventKey="FixAppointment" title="Fixer un rendez-vous">
                    {/* Affichez la liste des prochains rendez-vous */}
                    <h2>les demandes de rendez-vous</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date et heure</th>
                                <th>Patient</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>{/*this will be fetched from the blockchain as event of request for appointment from the patient*/}
                            {appointments1.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{new Date(appointment.timestamp * 1000).toLocaleString()}</td>
                                    <td>{appointment.firstname} {appointment.lastname}</td>
                                    <td>

                                        <Button variant="primary" onClick={() => { setSelectedPatientR(appointment); handleConfirmAppointment(appointment); setShowModal1(true); }}>  <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="mr-2" /> Fixer rendez-vous</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </Table>
                </Tab>

            </Tabs>



            <Modal show={showModal1} onHide={() => setShowModal1(false)}>
                <Modal.Header closeButton className="bg-info text-dark">
                    <Modal.Title><FontAwesomeIcon icon={faCalendar} className="mr-2" /> Créer un rendez-vous</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateAppointment}>
                        <Form.Group controlId="doctorName">
                            <Form.Label>Nom du médecin</Form.Label>
                            <Form.Control
                                type="text"
                                name="doctorName"
                                placeholder="Entrez le nom du médecin"
                                value={formData.doctorName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="doctorSpeciality">
                            <Form.Label>Spécialité du médecin</Form.Label>
                            <Form.Control
                                type="text"
                                name="doctorSpeciality"
                                placeholder="Entrez la spécialité du médecin"
                                value={formData.doctorSpeciality}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="appointmentDate">
                            <Form.Label>Date et heure du rendez-vous</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="appointmentDate"//i want it timestamp
                                value={formData.appointmentDate}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="appointmentPurpose">
                            <Form.Label>Motif du rendez-vous</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="appointmentPurpose"
                                placeholder="Entrez le motif du rendez-vous"
                                value={formData.appointmentPurpose}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal1(false)}>
                                <FontAwesomeIcon icon={faTimes} className="mr-2" /> Annuler
                            </Button>
                            <Button type="submit" variant="success">
                                <FontAwesomeIcon icon={faCheck} className="mr-2" /> Créer Rendez-vous
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal pour créer une nouvelle ordonnance */}
           
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton className="bg-info text-light">
                    <Modal.Title><FontAwesomeIcon icon={faPrescriptionBottleAlt} className="mr-2" /> Créer une nouvelle ordonnance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreatePrescription}>
                        <Form.Group controlId="selectPatient">
                            <Form.Label>Patient sélectionné :</Form.Label>
                            <Form.Control type="text" value={selectedPatient["Informations du patient"].Nom} readOnly />
                        </Form.Group>
                        <Form.Group controlId="medicines">
                            <Form.Label>Médicaments prescrits :</Form.Label>
                            <div>
                                <Form.Control type="text" placeholder="Paracétamol, Ibuprofène, ..." value={medicines} onChange={(e) => setMedicines(e.target.value)} />
                                <Button variant="primary" onClick={handleAddMedicine}>Ajouter</Button>
                            </div>
                        </Form.Group>
                        <div style={{ display: 'flex' }}>
                            {medicineList.map((medicine, index) => (
                                <div key={index}>{medicine},</div>
                            ))}
                        </div>
                        <Form.Group controlId="dosage">
                            <Form.Label>Dosage :</Form.Label>
                            <Form.Control type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="frequency">
                            <Form.Label>Fréquence :</Form.Label>
                            <Form.Control type="text" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="fullyPurchased">
                            <Form.Check type="checkbox" label="Achat complet" checked={fullyPurchased} onChange={(e) => setFullyPurchased(e.target.checked)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        <FontAwesomeIcon icon={faTimes} className="mr-2" /> Annuler
                    </Button>
                    <Button type="submit" variant="success" onClick={handleCreatePrescription}>
                        <FontAwesomeIcon icon={faCheck} className="mr-2" /> Créer Ordonnance
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default PrescriptionForm;
