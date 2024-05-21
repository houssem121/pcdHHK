import React, { useState, useEffect } from 'react';
import { Table, Badge } from 'react-bootstrap';
import './Appointments.css'; // Importer le fichier de styles CSS personnalisé
import { Carousel } from 'react-bootstrap';
import { ContractPatient } from '../Contract';
const Appointments = (props) => {
    const [patients, setPatient] = useState({
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
    const [openAccordion, setOpenAccordion] = useState(null);



    const handleAccordionToggle = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);


    };
    const handleRowClick = (appointment) => {//this will deal with web3
        alert(`Rendez-vous confirmé : ${appointment.isConfirmed ? 'Oui' : 'Non'}`);
        console.log('Rendez-vous :', appointment);
    };



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

    const getRecord = async () => {
        try {
            const patientAddress = props.account;
            const contractpatient = await ContractPatient(props.web3);
            const patientDetails = await contractpatient.methods.getPatients(patientAddress).call();
            setPatients({
                record: patientDetails.record
            });
            setPatient({ Appointmentslist: patientDetails.Appointmentslist });
            console.log('Détails du patient :', patientDetails.record);
            console.log('Détails du patient :', patientDetails.Appointmentslist);
        } catch (error) {
            console.error('Erreur lors de la récupération des rendez-vous du patient :', error);
        }
    }
    useEffect(() => {
        getRecord();
    }, []);


    return (
        <div className="register-comp">





            <h2 className="register-title" >visite médicale</h2>
            <div className="carrousel-container">
                <Carousel activeIndex={index} onSelect={handleSelect}>
                    {patient.record.map((record, index) => (
                        <Carousel.Item key={index} >
                            <div className="carousel-item-content" style={{
                                backgroundColor: record.treatment.fullyPurchased ? '#d4edda' : '#f8d7da',
                                color: '#000', // Couleur du texte
                                fontSize: '0.9rem', // Adjust the font size here
                                padding: '20px', // Adjust the padding here
                            }}>
                                <h3 style={{ fontSize: '1.9rem' }}>{record.diagnosis}</h3> {/* Adjust the font size for the heading */}
                                <p style={{ fontSize: '1rem' }}><strong>Médecin</strong> : {record.doctor.name}</p>
                                <p style={{ fontSize: '1rem' }}><strong>Date</strong> : {new Date(record.timestamp * 1000).toLocaleDateString()}</p>
                                <p style={{ fontSize: '1rem' }}><strong>Médicaments</strong> : {record.treatment.medicines.join(", ")}</p>
                                <p style={{ fontSize: '1rem' }}><strong>Achats complétés</strong> : {record.treatment.fullyPurchased ? 'Oui' : 'Non'}</p>
                                <Badge bg="primary" style={{ fontSize: '1.5rem' }}>{record.doctor.speciality}</Badge>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>









            <h2 className="register-title"
                style={
                    {
                        padding: '10px', // Adjust the padding here
                    }
                }>Rendez-vous</h2>
            <div className="table-container">
                <Table striped bordered hover>
                    <thead className="sticky-header">
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
                        {patients.Appointmentslist.map((appointment, index) => (
                            <tr key={index} onClick={() => handleRowClick(appointment)}>
                                <td>{new Date(appointment.date * 1000).toLocaleDateString()}</td>
                                <td>{new Date(appointment.date * 1000).toLocaleTimeString()}</td>
                                <td>{appointment.doctorN.name}</td>
                                <td>
                                    <Badge bg="primary">{appointment.doctorN.speciality}</Badge>
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

        </div>
    );
}

export default Appointments;
