import React, { useState } from 'react';
import { Badge, Accordion } from 'react-bootstrap';
import './Appointments.css'; // Importer le fichier de styles CSS personnalisé

const Records = (props) => {
    const [openAccordion, setOpenAccordion] = useState(null);

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
    };

    const handleAccordionToggle = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    return (
        
        <Accordion className="records-accordion">
            {patient.record.map((record, index) => (
                <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header onClick={() => handleAccordionToggle(index)}>
                        <span>{record.diagnosis}</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p>Médecin : {record.doctor.name}</p>
                        <p>Date : {new Date(record.timestamp * 1000).toLocaleDateString()}</p>
                        <p>Médicaments : {record.treatment.medicines.join(", ")}</p>
                        <p>Résultat du test : {record.test.result}</p>
                        <p>Achats complétés : {record.treatment.fullyPurchased ? 'Oui' : 'Non'}</p>
                        <Badge bg="primary">{record.doctor.speciality}</Badge> {/* Remplacez par la spécialité appropriée */}
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}

export default Records;

     /*
        const [patient, setPatient] = useState({ record: [] });
       
       useEffect(() => {
        const fetchPatient = async () => {
            try {
                const patientAddress = props.account;
                const patientDetails = await props.contractPatients.methods.getPatients(patientAddress).call();
                setPatient(patientDetails.record);
                console.log('Détails du patient :', patientDetails);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du patient :', error);
            }
        };

        fetchPatient();
    }, [props.contractPatients, props.account]);*/