import React, { useEffect } from 'react';
import { Card, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faPhone, faFileMedicalAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Toast from 'react-bootstrap/Toast'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

function DetailComp(props) {
    // Define a function to extract the desired part of the key from session storage
const extractKeyPart = () => {
    // Retrieve the key from session storage
    const key = sessionStorage.getItem('publicKey');
    if (!key) {
      // Key not found in session storage
      return null;
    }
    
    // Split the key by whitespace
    const parts = key.split(' ');
    // remove the } from the last part
    parts[2] = parts[2].replace('}', '');
    // Check if the key has the desired parts
    if (parts.length !== 3) {
      // Key format is incorrect
      return null;
    }
    
    // Extract and return the desired parts
    return `${parts[2]}`;
  };
  
  
  
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
                const patientAddress = props.account;//ming patient address is passed as a parameter in the URL
                const patientDetails = await props.contractPatients.methods.getPatients(patientAddress).call();
                setPatient(patientDetails);
                console.log('Patient details:', patientDetails);
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        };

        fetchPatient();
    }, [props.contractPatients, props.account]);

    return (
       <div style={{ paddingTop: '120px' }}>

            <Card>
                <Card.Header style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                    <h2 style={{ fontFamily: 'Arial, sans-serif', fontSize: '1.5rem', color: '#495057', margin: '0' }}>Patient Details</h2>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} /> First Name:
                                </td>
                                <td style={{ fontSize: '1.2rem' }}>{patient.firstname}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} /> Last Name:
                                </td>
                                <td style={{ fontSize: '1.2rem' }}>{patient.lastname}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} /> Age:
                                </td>
                                <td style={{ fontSize: '1.2rem' }}>{patient.age}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '5px' }} /> Location:
                                </td>
                                <td style={{ fontSize: '1.2rem' }}>{patient.location}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '5px' }} /> Phone:
                                </td>
                                <td style={{ fontSize: '1.2rem' }}>{patient.phone}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <FontAwesomeIcon icon={faFileMedicalAlt} style={{ marginRight: '5px' }} /> Dossier Hash:
                                </td>
                                <td style={{ fontSize: '1.2rem' }}>{patient.dossierHash}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <FontAwesomeIcon icon={faKey} style={{ marginRight: '5px' }} /> Public Key:
                                </td>
                                <td style={{ fontSize: '1.2rem' }}>{patient.PublicKey}</td>
                            </tr>

                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>


    );
   
}

export default DetailComp;
