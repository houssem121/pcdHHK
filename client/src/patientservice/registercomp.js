import { Card, Form, Button, Message } from 'semantic-ui-react';
import React from "react";
import { useState } from 'react';
import { ContractPatient } from '../Contract';
import { useEffect } from 'react';
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
    /* const [contractPatients, setContractPatients] = useState(null);
     useEffect(() => {
         const initContract = async () => {
             const contractPatients = await ContractPatient(props.web3);
             setContractPatients(contractPatients);
         };
         initContract();
     }, [props.web3]);*/


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };






    const onSignUps = async () => {
        setAlertMessage('');
        setStatus('');
        try {
            await props.contractPatients.methods.registerUserDetails(formData.firstname, formData.lastname, formData.age, formData.dossierHash, formData.location, formData.phone).send({ from: props.account });

            setAlertMessage('User details saved successfully');
            setStatus('success');
        } catch (error) {
            setAlertMessage(error.message);
            setStatus('failed');
        }
    };
    /*   const onclikk = async () => {
           setAlertMessage('');
           setStatus('');
       
           try {
               // Call the function
               await contractPatients.methods.demanderemboursement().send({ from: props.account });
       
               // Subscribe to the event
               contractPatients.events.ReimbursementRequested({}, (error, event) => {
                   if (error) {
                       console.error("Error in event subscription:", error);
                   } else {
                       console.log("Event received:", event);
                       // Process the event data here
                       setAlertMessage('Reimbursement requested successfully');
                       setStatus('success');
                   }
               });
           } catch (error) {
               setAlertMessage(error.message);
               setStatus('failed');
           }
       };*/ //events testing 
    return (
        <div className="save-up">
            Save Patient details
            <div className='signup-form'>
                <Card fluid centered>
                    <Card.Content>
                        <Form size='large'>
                            {alertMessage && (
                                <Message negative={status === 'failed'} positive={status === 'success'}>
                                    {alertMessage}
                                </Message>
                            )}
                            {/* Input for firstname, lastname, etc. */}
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='firstname'
                                    placeholder='First Name'
                                    value={formData.firstname}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='lastname'
                                    placeholder='Last Name'
                                    value={formData.lastname}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='number'
                                    name='age'
                                    placeholder='Age'
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='dossierHash'
                                    placeholder='Dossier Hash'
                                    value={formData.dossierHash}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='location'
                                    placeholder='Location'
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='phone'
                                    placeholder='Phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Button type='submit' primary fluid size='large' onClick={onSignUps}>
                                Save User Details
                            </Button>

                        </Form>
                    </Card.Content>
                </Card>

            </div>
        </div>
    );
};

export default RegisterComp;