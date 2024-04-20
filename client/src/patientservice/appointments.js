import React, { useState, useEffect } from 'react';
import { Table, Badge } from 'react-bootstrap';
import './Appointments.css'; // Importer le fichier de styles CSS personnalisé

const Appointments = (props) => {
    const [patient, setPatient] = useState({
        Appointmentslist: [
            {
                date: 1620124800,
                doctorN: {
                    name: "Dr. Dupont",
                    specialty: "Cardiologie"
                },
                purpose: "Examen de routine",
                isConfirmed: true
            },
            {
                date: 1620345600,
                doctorN: {
                    name: "Dr. Martin",
                    specialty: "Pédiatrie"
                },
                purpose: "Vérification des vaccins",
                isConfirmed: false
            },
            {
                date: 1620883200,
                doctorN: {
                    name: "Dr. Garcia",
                    specialty: "Dermatologie"
                },
                purpose: "Traitement des allergies",
                isConfirmed: true
            }
        ]
    });
 
   /* useEffect(() => {
         const fetchAppointments = async () => {
             try {
                 const patientAddress = props.account;
                 const patientDetails = await props.contractPatients.methods.getPatients(patientAddress).call();
                 setPatient(patientDetails.Appointmentslist);
                 console.log('Détails du patient :', patientDetails);
             } catch (error) {
                 console.error('Erreur lors de la récupération des rendez-vous du patient :', error);
             }
         };
 
         fetchAppointments();
     }, [ props.account]);*/
     
    return (
        <div className="appointments-table">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Médecin</th>
                        <th>Spécialité</th>
                        <th>But</th>
                        <th>Confirmation</th>
                    </tr>
                </thead>
                <tbody>
                    {patient.Appointmentslist.map((appointment, index) => (
                        <tr key={index}>
                            <td>{new Date(appointment.date * 1000).toLocaleDateString()}</td>
                            <td>{new Date(appointment.date * 1000).toLocaleTimeString()}</td>
                            <td>{appointment.doctorN.name}</td>
                            <td>
                                <Badge bg="primary">{appointment.doctorN.specialty}</Badge>
                            </td>
                            <td>{appointment.purpose}</td>
                            <td>
                                {appointment.isConfirmed ? (
                                    <Badge bg="success">Confirmé</Badge>
                                ) : (
                                    <Badge bg="danger">Non confirmé</Badge>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Appointments;
  