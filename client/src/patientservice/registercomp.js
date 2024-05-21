import { Card, Form, Button, Message } from 'semantic-ui-react';
import React, { useState } from "react";
import './Appointments.css';
const RegisterComp = (props) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        age: '',
        dossierHash: '',
        location: '',
        phone: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSignUps = async () => {
        setAlertMessage('');
        setStatus('');
        try {
            await props.contractPatients.methods.registerUserDetails(formData.firstname, formData.lastname, formData.age, formData.dossierHash, formData.location, formData.phone).send({ from: props.account });
            setAlertMessage('Détails du patient enregistrés avec succès');
            setStatus('success');
        } catch (error) {
            setAlertMessage(error.message);
            setStatus('failed');
        }
    };

    return (
        <div className="register-comp">
            <h2 className="register-title">Enregistrer les détails du patient</h2>
            <div className='signup-form'>
                <Card fluid centered className='signup-card'>
                    <Card.Content>
                        <Form size='large' style={{
                              
                                gap: '0.4rem'
                            }}>
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
                                    type='number'
                                    name='age'
                                    placeholder='Âge'
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='dossierHash'
                                    placeholder='Hash du dossier'
                                    value={formData.dossierHash}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='location'
                                    placeholder='Emplacement'
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='phone'
                                    placeholder='Téléphone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Button type='submit' primary fluid size='large' onClick={onSignUps}>
                                Enregistrer les détails du patient
                            </Button>
                            <Button type='reset' variant='danger' size='lg' color='red' >
                                    Reset
                                </Button>
                        </Form>
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
};

export default RegisterComp;
