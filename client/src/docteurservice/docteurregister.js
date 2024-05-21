import { Card, Form, Button, Message } from 'semantic-ui-react';
import React, { useState } from "react";
import '../patientservice/Appointments.css'; // Import unique suffisant
const DocteruINFO = (props) => {
    const [formData, setFormData] = useState({
        doctorAddress: '',
        firstname: '',
        lastname: '',
        specialty: '',
        location: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async () => {
        setAlertMessage('');
        setStatus('');
        try {
            await props.ContractDoctor.methods.registerUserDetails( formData.firstname, formData.lastname, formData.specialty, formData.location).send({ from: props.account });    
            setAlertMessage('Détails du docteur enregistrés avec succès');
            setStatus('success');
        } catch (error) {
            setAlertMessage(error.message);
            setStatus('failed');
        }
    };

    return (
        <div className="register-comp">
            <h2 className="register-title">Enregistrer un Médecin</h2>
            <div className='signup-form'>
                <Card fluid centered className='signup-card'>
                    <Card.Content>
                        <Form size='large'>
                            {alertMessage && (
                                <Message negative={status === 'failed'} positive={status === 'success'}>
                                    {alertMessage}
                                </Message>
                            )}
                          
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='firstname'
                                    placeholder='Prénom'
                                    value={formData.firstname}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='lastname'
                                    placeholder='Nom de famille'
                                    value={formData.lastname}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='specialty'
                                    placeholder='Spécialité'
                                    value={formData.specialty}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='location'
                                    placeholder='Lieu de pratique'
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </Form.Field >
                            <Form.Field 
                             >
                            <Button type='submit' primary fluid size='large' onClick={onSubmit} > 
                                Enregistrer le Médecin
                            </Button>
                            <Button type='reset' color='red' fluid size='large'>
                                Réinitialiser
                            </Button>
                        </Form.Field>
                        </Form>
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
};

export default DocteruINFO;
