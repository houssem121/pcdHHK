import React, { useEffect } from 'react';
import { Card, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faPhone, faFileMedicalAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import './Appointments.css';
import { Image } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
function DetailComp(props) {
    const [patient, setPatient] = useState({
        age: "",
        authorizedUsers: [],
        dossierHash: "",
        firstname: "",
        lastname: "",
        location: "",
        phone: "",
        PublicKey: "",
        record: [],
        Appointmentslist: []
    });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const patientAddress = props.account;
                const patientDetails = await props.contractPatients.methods.getPatients(patientAddress).call();
                setPatient(patientDetails);
                console.log('Détails du patient:', patientDetails);
                console.log('Adresse du patient:', patientDetails.record);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du patient:', error);
            }
        };

        fetchPatient();
    }, [props.contractPatients, props.account]);
    
    return (
        <div className="register-comp">
            <h2 className="register-title">Détails du patient</h2>
            

            <Card>
                <Card.Header className="card-header">
                    <h2 className="card-title">Détails du patient</h2>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td className="info-label">
                                    <FontAwesomeIcon icon={faUser} className="icon" /> Prénom :
                                </td>
                                <td className="info-value">{patient.firstname}</td>
                            </tr>
                            <tr>
                                <td className="info-label">
                                    <FontAwesomeIcon icon={faUser} className="icon" /> Nom de famille :
                                </td>
                                <td className="info-value">{patient.lastname}</td>
                            </tr>
                            <tr>
                                <td className="info-label">
                                    <FontAwesomeIcon icon={faUser} className="icon" /> Âge :
                                </td>
                                <td className="info-value">{patient.age}</td>
                            </tr>
                            <tr>
                                <td className="info-label">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> Emplacement :
                                </td>
                                <td className="info-value">{patient.location}</td>
                            </tr>
                            <tr>
                                <td className="info-label">
                                    <FontAwesomeIcon icon={faPhone} className="icon" /> Téléphone :
                                </td>
                                <td className="info-value">{patient.phone}</td>
                            </tr>
                            <tr>
                                <td className="info-label">
                                    <FontAwesomeIcon icon={faFileMedicalAlt} className="icon" /> Hash du dossier :
                                </td>
                                <td className="info-value">{patient.dossierHash}</td>
                            </tr>
                            <tr>
                                <td className="info-label">
                                    <FontAwesomeIcon icon={faKey} className="icon" /> Clé publique :
                                </td>
                                <td className="info-value">{patient.PublicKey}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default DetailComp;
