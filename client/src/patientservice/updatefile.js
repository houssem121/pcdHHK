import React, { useState } from "react";
import { useEffect } from "react";
import { parseJSONWithLargeNumbers, DecrypteFile } from "../utils/UpDownIPFS";
import { Modal, Button } from "react-bootstrap";
import { Card, ListGroup } from "react-bootstrap";
import Modals from "./modals";
import { Table } from "react-bootstrap";
import { handleFileUpload ,handleFileUpdate} from "../utils/UpDownIPFS";


const UpdateFile = (props) => {
    const [patients, setPatients] = useState({});

    const patient = {
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
                    fullyPurchased: true
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
    };
    const downloadFile = async () => {
        try {
            // Log the patient's Ethereum address
            const patientAddress = props.account;
            console.log('Patient Address:', patientAddress);

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



    const [selectedRecords, setSelectedRecords] = useState([]);

    const handleRecordSelection = (recordId) => {
        const index = selectedRecords.indexOf(recordId);
        if (index === -1) {
            setSelectedRecords([...selectedRecords, recordId]);
        } else {
            const updatedRecords = [...selectedRecords];
            updatedRecords.splice(index, 1);
            setSelectedRecords(updatedRecords);
        }
    };

    const handleSaveSelectedRecords = () => {
        const selectedRecordsData = patient.record.filter(record => selectedRecords.includes(record.id));
        updateDecrypteddata(selectedRecordsData);
        console.log('Enregistrements sélectionnés :', selectedRecordsData);
    };


    return (
        <div>
            <h1>Modifier le fichier</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Sélectionner</th>
                        <th>Diagnostic</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {patient.record.map(record => (
                        <tr key={record.id}>
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
            <Button variant="primary" onClick={handleSaveSelectedRecords}>Enregistrer les enregistrements sélectionnés</Button>
         
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