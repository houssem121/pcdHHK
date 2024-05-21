import React, { useState, useEffect } from "react";
import { Modal, Button, Card, ListGroup, Table } from "react-bootstrap";
import { parseJSONWithLargeNumbers, DecrypteFile } from "../utils/UpDownIPFS";
import { handleFileUpdate } from "../utils/UpDownIPFS";
import {ContractDoctor, ContractPatient} from "../Contract";
const UpdateFile = (props) => {
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        getAllEvents();   getRecord();
    }, []);
    /*const patient = {
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
                doctor: {
                    name: "Dr. Martin",
                    speciality: "Médecine générale"
                }
            },
            // Ajoutez les autres enregistrements ici
            {
                id: 2,
                timestamp: 1620124800,
                date: "2024-05-01",
                diagnosis: "Fracture",
                treatment: {
                    timestamp: 1620124800,
                    doctor: props.doctorAddress,
                    patient: props.patientAddress,
                    medicines: ["Paracétamol", "Ibuprofène"],
                    fullyPurchased: true
                },
                test: {
                    timestamp: 1620124800,
                    category: "Radiographie",
                    result: "Fracture de l'humérus",
                    done: true
                },
                doctor: {
                    name: "Dr. Garcia",
                    speciality: "Orthopédie"
                }
            },
            {
                id: 3,
                timestamp: 1620124800,
                date: "2024-05-01",
                diagnosis: "Rhume des foins",
                treatment: {
                    timestamp: 1620124800,
                    doctor: props.doctorAddress,
                    patient: props.patientAddress,
                    medicines: ["Loratadine", "Cétirizine"],
                    fullyPurchased: false
                },
                test: {
                    timestamp: 1620124800,
                    category: "Test d'allergie",
                    result: "Positif",
                    done: true
                },
                doctor: {
                    name: "Dr. Leroy",
                    speciality: "Allergologie"
                }
            },
            {
                id: 4,
                timestamp: 1620124800,
                date: "2024-05-01",
                diagnosis: "Rhume des foins",
                treatment: {
                    timestamp: 1620124800,
                    doctor: props.doctorAddress,
                    patient: props.patientAddress,
                    medicines: ["Loratadine", "Cétirizine"],
                    fullyPurchased: false
                },
                test: {
                    timestamp: 1620124800,
                    category: "Test d'allergie",
                    result: "Positif",
                    done: true
                },
                doctor: {
                    name: "Dr. Leroy",
                    speciality: "Allergologie"
                }
            }
        ]
    };*/
    const [patient, setPatientss] = useState({
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
    const getRecord = async () => {
        try {
            const patientAddress = props.account;
            const contractPatient = await ContractPatient(props.web3);
            const patientDetails = await contractPatient.methods.getPatients(patientAddress).call();
    
            // Assuming patientDetails.record is an array of objects matching the Solidity struct
            const record = patientDetails.record.map((item) => ({
                id: item.id,
                timestamp: item.timestamp,
                date: item.date,
                diagnosis: item.diagnosis,
                treatment: {
                    id: item.treatment.id,
                    timestamp: item.treatment.timestamp,
                    doctor: item.treatment.doctor,
                    patient: item.treatment.patient,
                    medicines: item.treatment.medicines,
                    fullyPurchased: item.treatment.fullyPurchased
                },
                test: {
                    patient: item.test.patient,
                    timestamp: item.test.timestamp,
                    category: item.test.category,
                    result: item.test.result,
                    done: item.test.done
                },
                doctor: {
                    name: item.doctor.name,
                    speciality: item.doctor.speciality
                }
            }));
    
            setPatientss({ record });
    
            console.log('Patient Details:', patientDetails.record);
            console.log('Patient Appointments:', patientDetails.Appointmentslist);
        } catch (error) {
            console.error('Error fetching patient appointments:', error);
        }
    };



    const handleRecordSelection = (recordId) => {
        const index = selectedRecords.indexOf(recordId);
        if (index === -1) {
            setSelectedRecords([...selectedRecords, recordId]);
            setSelectedRecord(patient.record.find(record => record.id === recordId));
            setShowModal(true);
        } else {
            const updatedRecords = [...selectedRecords];
            updatedRecords.splice(index, 1);
            setSelectedRecords(updatedRecords);
            setSelectedRecord(null);
            setShowModal(false);
        }
    };

    const handleSaveSelectedRecords = () => {
        const selectedRecordsData = patient.record.filter(record => selectedRecords.includes(record.id));
        updateDecrypteddata(selectedRecordsData);
        console.log('Selected Records:', selectedRecordsData);
    };

    async function getAllEvents() {
        try {
          
            const  contractDocteur  = await ContractDoctor(props.web3);
            const events = await contractDocteur.getPastEvents('doctoradded', {
                fromBlock: 0,
                toBlock: 'latest'
            });
            // Traiter les événements récupérés
            events.forEach(event => {
                // Afficher les détails de chaque événement
                console.log('Nom de l\'événement :', event.event);
                console.log('Paramètres :', event.returnValues);
                console.log('Bloc :', event.blockNumber);
                console.log('Transaction :', event.transactionHash);
                console.log('----------------------------------');
            });

            return events; // Retourner la liste des événements
        } catch (error) {
            console.error('Erreur lors de la récupération des événements :', error);
            throw error;
        }
    }

    const downloadFile = async () => {
        try {
            // Log the patient's Ethereum address
            const patientAddress = props.account;
            console.log('Patient Address:', patientAddress);
            console.log('Contract Patients:', props.contractPatients);
            // Retrieve patient details from a smart contract


            getAllEvents();
            // Retrieve patient details from a smart contract
            const patientDetails = await props.contractPatients.methods.getPatients(patientAddress).call();
            const ipfsHash = patientDetails.dossierHash;
            console.log('IPFS Hash:', ipfsHash);

            // Construct the URL to access the file via IPFS gateway
            const url = `https://ipfs.io/ipfs/${ipfsHash}`;
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
            const decryptedData = await DecrypteFile(parsedData.encrypted_file, parsedData.capsule, props);
            console.log('Decrypted File:', decryptedData);
            return decryptedData;
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const updateDecrypteddata = async (selectedRecordsData) => {
        try {
            downloadFile().then((data) => {
                setPatients(data.decrypted_file);
                console.log('data', patients);
                console.log('selectedRecordsData', selectedRecordsData);
                const updatedPatients = { ...data.decrypted_file };

                if (!Array.isArray(updatedPatients["Dossiers médicaux"])) {
                    updatedPatients["Dossiers médicaux"] = []; // Initialize the array if it doesn't exist
                }

                updatedPatients["Dossiers médicaux"].push(...selectedRecordsData);

                console.log('updatedPatients', updatedPatients);
                console.log('patients', patients);
                handleFileUpdate(updatedPatients, props);

            });
        } catch (error) {
            console.error('Error updating decrypted data:', error);
        }
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRecord(null);
    };
    const [patients, setPatients] = useState({});




    
        return (
        <div className="services-container">
            <h1>Modify File</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Diagnosis</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {patient.record.map(record => (
                        <tr key={record.id} onClick={() => handleRecordSelection(record.id)}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRecords.includes(record.id)}
                                    onChange={() => handleRecordSelection(record.id)}
                                />
                            </td>
                            <td>{record.diagnosis}</td>
                            <td>{record.date}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button variant="primary" onClick={handleSaveSelectedRecords}>Save Selected Records</Button>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Patient Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRecord && (
                        <>
                            <Card>
                                <Card.Header className="bg-primary text-white">General Information</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>Prescription ID:</strong> {selectedRecord.id}</ListGroup.Item>
                                    <ListGroup.Item><strong>Date:</strong> {selectedRecord.date}</ListGroup.Item>
                                    <ListGroup.Item><strong>Diagnosis:</strong> {selectedRecord.diagnosis}</ListGroup.Item>
                                    <ListGroup.Item><strong>Doctor:</strong> {selectedRecord.doctor.name} ({selectedRecord.doctor.speciality})</ListGroup.Item>
                                </ListGroup>
                            </Card>
                            <Card className="mt-3">
                                <Card.Header className="bg-primary text-white">Medical Records</Card.Header>
                                <ListGroup variant="flush">
                                    {selectedRecord.treatment && (
                                        <ListGroup.Item>
                                            <strong>Treatment:</strong>
                                            <ul>
                                                {selectedRecord.treatment.medicines.map((medication, idx) => (
                                                    <li key={idx}>{medication}</li>
                                                ))}
                                            </ul>
                                        </ListGroup.Item>
                                    )}
                                    {selectedRecord.test && (
                                        <ListGroup.Item>
                                            <strong>Test:</strong> {selectedRecord.test.done ? `Done on ${selectedRecord.test.date}. Category: ${selectedRecord.test.category}, Result: ${selectedRecord.test.result}` : 'Not done'}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UpdateFile;

/*
     const [patient, setPatient] = useState({ record: [] });
    
    useEffect(() => {
     const fetchPatient = async () => {
         try {
             const patientAddress = props.account;
             const patientDetails = await props.contractPatients.methods.getPatients(patientAddress).call();
             setPatient(patientDetails.record);
             console.log('Détails du patient :', patientDetails);
             //then delete the record from the blockchain
                // const res = await props.contractPatients.methods.deletePatientRecord(patientAddress).send({ from: props.account });
         } catch (error) {
             console.error('Erreur lors de la récupération des détails du patient :', error);
         }
     };

     fetchPatient();
 }, [props.contractPatients, props.account]);*/