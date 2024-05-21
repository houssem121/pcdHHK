import { Card, Form, Button, Message } from 'semantic-ui-react';
import React, { useState } from "react";
import '../patientservice/Appointments.css'; // Import unique suffisant
import { ContractPharmacist }  from '../Contract';
const PharmacistInfo = (props) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        location: '',
        phone: '',
        pharmacie: '',
        pharmacieid: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async () => {
        const ContractPharmacists = await ContractPharmacist(props.web3);
        setAlertMessage('');
        setStatus('');
        try {
            await ContractPharmacists.methods.registerPharmacist( formData.firstname, formData.lastname, formData.location, formData.phone, formData.pharmacie, formData.pharmacieid).send({ from: props.account });
            setAlertMessage('Détails du pharmacien enregistrés avec succès');
            setStatus('success');
        } catch (error) {
            setAlertMessage(error.message);
            setStatus('failed');
        }
    };
    const handleReset = () => {
        setFormData({
            doctorAddress: '',
            firstname: '',
            lastname: '',
            specialty: '',
            location: '',
            phone: '',
            pharmacie: '',
            pharmacieid: ''
        });
    };
    return (
        <div className="register-comp">
            <h2 className="register-title">Enregistrer un Pharmacien</h2>
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
                                    name='location'
                                    placeholder='Lieu de pratique'
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
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='pharmacie'
                                    placeholder='Nom de la pharmacie'
                                    value={formData.pharmacie}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='pharmacieid'
                                    placeholder="ID de l'agence"
                                    value={formData.pharmacieid}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Button type='submit' primary fluid size='large' onClick={onSubmit}>
                                    Enregistrer le Pharmacien
                                </Button>
                                <Button type='reset' color='red' fluid size='large' onClick={handleReset}>
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

export default PharmacistInfo;
