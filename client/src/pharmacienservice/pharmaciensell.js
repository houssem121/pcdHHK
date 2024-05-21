import React, { useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { Card, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContractPatient, ContractPharmacist } from '../Contract';
import { useEffect } from 'react';
const PharmacistDashboard = (props) => {
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    const [requests, setRequests] = useState([]);
    const [prescriptions, setPrescriptions] = useState([

        {
            id: 1,
            date: '2021-08-01',
            diagnosis: 'Douleur au dos',
            doctor: {
                name: 'Dr. John Doe',
                speciality: 'Orthopédiste'
            },
            treatment: {
                patient: 'Alice',
                patientAddress: '0x1234567890abcdef',
                medicines: ['Paracétamol', 'Ibuprofène', 'Diazépam']
            }
        }

    ]);

    async function getAllRequestsfrompatient() {
        try {
            const contractPharmacist = await ContractPatient(props.web3);
            const events = await contractPharmacist.getPastEvents('OrdonnanceAchete', {
                //filter with the pharmacist address
                fromBlock: 0,
                toBlock: 'latest'
            });

            // Événement OrdonnanceAchete(address indexed patient, uint256 recordId, uint256 timestamp, string firstname, string lastname);

            const requests = events.map((event) => {
                return {
                    patient: event.returnValues.patient,
                    recordId: event.returnValues.recordId,
                    timestamp: event.returnValues.timestamp,
                    firstname: event.returnValues.firstname,
                    lastname: event.returnValues.lastname
                };
            });
            console.log("requests:", requests);
            setRequests(requests);

            const prescriptions = await Promise.all(requests.map(async (request) => {
                const patientDetails = await contractPharmacist.methods.getPatients(request.patient).call();
                const record = patientDetails.record.find(r => r.id === request.recordId); // Assurez-vous que la méthode `find` fonctionne correctement.
                return {
                    id: request.recordId,
                    date: new Date(request.timestamp * 1000).toISOString().split('T')[0], // Convertir le timestamp en format date
                    diagnosis: record.diagnosis, // Utiliser le diagnostic du dossier médical récupéré
                    doctor: {
                        name: record.doctor.name, // Utiliser le nom du médecin du dossier médical récupéré
                        speciality: record.doctor.speciality // Utiliser la spécialité du médecin du dossier médical récupéré
                    },
                    treatment: {
                        id: record.treatment.id, // Utiliser l'ID du traitement du dossier médédical récupéré
                        timestamp: record.treatment.timestamp, // Utiliser le timestamp du traitement du dossier médical récupéré
                        doctor: record.treatment.doctor, // Utiliser le médecin du traitement du dossier médical récupéré
                        patient: record.treatment.patient, // Utiliser le nom du patient du dossier médical récupéré
                        medicines: record.treatment.medicines // Utiliser les médicaments du traitement du dossier médical récupéré
                    }
                };
            }));

            console.log("Ordonnances mises à jour:", prescriptions);
            setPrescriptions(prescriptions); // Mettre à jour l'état avec les nouvelles prescriptions
        } catch (error) {
            console.error("Erreur lors de la récupération des ordonnances:", error);
        }
    }

    useEffect(() => {
        getAllRequestsfrompatient();

    }, []);

    const handleShowPrescriptionModal = async (prescription) => {
        setSelectedPrescription(prescription);

        setShowPrescriptionModal(true);
    };



    const [filterDate, setFilterDate] = useState('');


    const filteredPrescriptions = prescriptions.filter((prescription) => {
        //how to get the date from the prescription
        

        return prescription.date && prescription.date.split('T')[0].includes(filterDate);
    });

    const handleConfirmPurchase = async () => {
        console.log('Achat confirmé avec succès:', selectedPrescription.id);
        const contractPharmacist = await ContractPharmacist(props.web3);
        const pharmacienordonnace = await contractPharmacist.methods.validatePrescriptionPurchase(selectedPrescription.treatment.patient, selectedPrescription.id).send({ from: props.account });
        console.log('pharmacienordonnace:', pharmacienordonnace);
        alert('Achat confirmé avec succès');
    }



    return (
        <div className="register-comp">
            <h2>Tableau de bord du Pharmacien</h2>

            <Form.Group controlId="filterDate" style={{ marginBottom: '20px' }}>
                <Form.Label>Filtrer par Date:</Form.Label>
                <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </Form.Group>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Diagnostic</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPrescriptions.map((prescription) => (
                        <tr key={prescription.id}>
                            <td>{prescription.id}</td>
                            <td>{prescription.date}</td>
                            <td>{prescription.diagnosis}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleShowPrescriptionModal(prescription)}>
                                    Voir
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showPrescriptionModal} onHide={() => setShowPrescriptionModal(false)} className="prescription-modal">
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title className="modal-title">Détails de la Prescription</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    {selectedPrescription && (
                        <div>
                            <Card className="general-info-card">
                                <Card.Header className="bg-primary text-white">Informations générales</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <p><strong>ID:</strong> {selectedPrescription.id}</p>
                                        <p><strong>Date:</strong> {selectedPrescription.date}</p>
                                        <p><strong>Diagnostic:</strong> {selectedPrescription.diagnosis}</p>
                                        <p><strong>Docteur:</strong> {selectedPrescription.doctor.name} ({selectedPrescription.doctor.speciality})</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="medicine-card mt-3">
                                <Card.Header className="bg-primary text-white">Médicaments</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <p><strong>Médicaments:</strong></p>
                                        <ul>
                                            {selectedPrescription.treatment.medicines.map((medicine, index) => (
                                                <li key={index}>{medicine}</li>
                                            ))}
                                        </ul>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="patient-info-card mt-3">
                                <Card.Header className="bg-primary text-white">Patient</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <p><strong>Patient:</strong> {selectedPrescription.treatment.patient}</p>
                                        <p><strong>Adresse du Patient:</strong> {selectedPrescription.treatment.patientAddress}</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </div>

                    )}
                    <Button variant="success" onClick={handleConfirmPurchase} className="mt-3">Confirmer l'achat</Button>
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <Button variant="secondary" onClick={() => setShowPrescriptionModal(false)}>Fermer</Button>
                </Modal.Footer>
            </Modal>




        </div>
    );
};

export default PharmacistDashboard;
