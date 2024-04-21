import React, { useState } from 'react';
import { Tabs, Tab, Button, Table, DropdownButton, Dropdown } from 'react-bootstrap';

function Services(props) {
    const { contractPatients } = props;
    const [selectedRecordId, setSelectedRecordId] = useState('');
    //this will be replaced with real data from the blockchain
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
    const service = "serviceassurance";

    const timestamp = new Date().getTime();
    //prescriptionId shoudl be uint256 
    const prescriptionId = timestamp;
    const pharmacists = ['Pharmacien 1', 'Pharmacien 2', 'Pharmacien 3'];
    const doctors = [
        { name: 'Médecin 1', address: '0x02ecd02478634b0f1c44bd9a975fef0db8b4cbfc' },
        { name: 'Médecin 2', address: '0x02ecd02478634b0f1c44bd9a975fef0db8b4cbfc' },
        { name: 'Médecin 3', address: '0x02ecd02478634b0f1c44bd9a975fef0db8b4cbfc' }
    ];
    const insuranceAgents = ['Agent d\'assurance 1', 'Agent d\'assurance 2', 'Agent d\'assurance 3'];

    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedPharmacist, setSelectedPharmacist] = useState('');
    const [selectedInsuranceAgent, setSelectedInsuranceAgent] = useState('');

    const handleDoctorSelection = async () => {
        console.log('Médecin sélectionné :', selectedDoctor);
        await contractPatients.methods.notifierVisiteMedecin(props.account, selectedDoctor.address).send({ from: props.account });
        // Effectuez ici l'action associée à la sélection d'un médecin
    };

    const handlePharmacistSelection = async () => {
        console.log('Pharmacien sélectionné :', selectedPharmacist);
        // Effectuez ici l'action associée à la sélection d'un pharmacien
        await contractPatients.methods.notifierAchatOrdonnance(props.account, prescriptionId).send({ from: props.account });
    };

    const handleInsuranceAgentSelection = async () => {
        console.log('Agent d\'assurance sélectionné :', selectedInsuranceAgent);
        // Effectuez ici l'action associée à la sélection d'un agent d'assurance
        await contractPatients.methods.notifierDemandeRemboursement(props.account, service).send({ from: props.account });
    };

    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Sélectionner un enregistrement
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {patient.record.map((record, index) => (
                        <Dropdown.Item key={index} onClick={() => setSelectedRecordId(record.id)}>
                            {record.id}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            
            <Tabs defaultActiveKey="buyMedicine" id="uncontrolled-tab-example" className="custom-tabs" style={
                { paddingTop: '20px' }
            }   

            >
                <Tab eventKey="buyMedicine" title="Acheter des médicaments">
                    <div className="tab-content">
                        <h3>Liste des pharmaciens disponibles :</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sélectionner</th>
                                    <th>Nom du pharmacien</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pharmacists.map((pharmacist, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedPharmacist === pharmacist}
                                                onChange={() => setSelectedPharmacist(pharmacist)}
                                            />
                                        </td>
                                        <td>{pharmacist}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button onClick={handlePharmacistSelection}>Sélectionner ce pharmacien</Button>
                    </div>
                </Tab>
                <Tab eventKey="visitDoctor" title="Visiter un médecin">
                    <div className="tab-content">
                        <h3>Liste des médecins disponibles :</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sélectionner</th>
                                    <th>Nom du médecin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((doctor, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedDoctor === doctor}
                                                onChange={() => setSelectedDoctor(doctor)}
                                            />
                                        </td>
                                        <td>{doctor.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button onClick={handleDoctorSelection}>Prendre rendez-vous avec ce médecin</Button>
                    </div>
                </Tab>
                <Tab eventKey="requestRefund" title="Demander un remboursement">
                    <div className="tab-content">
                        <h3>Liste des agents d'assurance disponibles :</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sélectionner</th>
                                    <th>Nom de l'agent d'assurance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insuranceAgents.map((agent, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedInsuranceAgent === agent}
                                                onChange={() => setSelectedInsuranceAgent(agent)}
                                            />
                                        </td>
                                        <td>{agent}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button onClick={handleInsuranceAgentSelection}>Demander le remboursement à cet agent</Button>
                    </div>
                </Tab>

            </Tabs>

        </div>
    );
}

export default Services;
