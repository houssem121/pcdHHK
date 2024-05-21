import { Card, Form, Button, Message } from 'semantic-ui-react';
import React, { useState } from "react";
import '../patientservice/Appointments.css';
import '../patientservice/Appointments.css';
import { ContractAssurance }  from '../Contract';
const InsuranceAgent = (props) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        emailid: '',
        phonenumber: '',
        region: '',
        insuranceagency: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async () => {
        setAlertMessage('');
        setStatus('');
        console.log(formData);
        try {
            const ContractAssurances = await ContractAssurance(props.web3);
            await ContractAssurances.methods.enregistrerEmploye(
                formData.firstname,
                formData.lastname,
                formData.emailid,
                formData.phonenumber,
                formData.region,
                formData.insuranceagency
            ).send({ from: props.account });

            setAlertMessage('Détails de l\'agent d\'assurance enregistrés avec succès');
            setStatus('success');
        } catch (error) {
            setAlertMessage(error.message);
            setStatus('failed');
        }
    };

    return (
        <div className="register-comp">
            <h2 className="register-title">Enregistrer un Agent d'Assurance</h2>
            <div className='signup-form'>
                <Card fluid centered className='signup-card'>
                    <Card.Content>
                        <Form size='large' style={{ gap: '0.4rem' }}>
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
                                    type='email'
                                    name='emailid'
                                    placeholder='Email'
                                    value={formData.emailid}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='phonenumber'
                                    placeholder='Numéro de téléphone'
                                    value={formData.phonenumber}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='region'
                                    placeholder='Région'
                                    value={formData.region}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='insuranceagency'
                                    placeholder="Agence d\'assurance"
                                    value={formData.insuranceagency}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Button type='submit' primary fluid size='large' onClick={onSubmit}>
                                Enregistrer l'Agent d'Assurance
                            </Button>
                            <Button type='reset' variant='danger' size='lg' color='red'>
                                Réinitialiser
                            </Button>
                        </Form>
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
};

export default InsuranceAgent;
