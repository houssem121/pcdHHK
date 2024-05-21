import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationHash from '../utils/AuthenticationHash';
import "../App.css";
import { useState } from 'react';
import { SavePublicKey } from '../utils/localstorage';

const SignUp = ({ contract, account, web3, accountCreated }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        Role: '',
        digicode: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [status, setStatus] = useState('');
    const [signedUp, setSignedUp] = useState(false);

    //call the server to genkey  
    async function callKeyGenServerPatient(blockchainAddress) {
        try {
            const response = await fetch('http://localhost:8083/keygen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    blockchain_address: blockchainAddress
                })
            });

            if (!response.ok) {
                throw new Error('Failed to call server');
            }

            const data = await response.json();
            console.log('Server response:', data.public_key);
            return data.public_key;
        } catch (error) {
            console.error('Error calling server:', error);
        }
    }

    async function callKeyGenServerNoPatient(blockchainAddress) {
        try {
            const response = await fetch('http://localhost:8084/saveUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    blockchain_address: blockchainAddress
                })
            });

            if (!response.ok) {
                throw new Error('Failed to call server');
            }

            const data = await response.json();
            console.log('Server response:', data.public_key);
            return data.public_key;
        } catch (error) {
            console.error('Error calling server:', error);
        }
    }





    const onSignUp = async () => {
        const { username, password, Role, digicode } = formData;

        if (username && password && digicode) {
            let trimmedUsername = username.trim();
            let trimmedPassword = password.trim();
            let trimmedRole = Role.trim();
            let trimmedDigicode = digicode.trim();

            if (trimmedPassword.length < 8) {
                setFormData({ ...formData, password: '', digicode: '' });
                setAlertMessage("at least 8 characters for password");
                setStatus('failed');
                return;
            }

            if (trimmedDigicode.length !== 6) {
                setFormData({ ...formData, digicode: '' });
                setAlertMessage("6 digit required for digicode");
                setStatus('failed');
                return;
            }

            let userAddress = await contract.methods.getUserAddress()
                .call({ from: account });

            if (userAddress !== '0x0000000000000000000000000000000000000000') {
                setFormData({ username: '', password: '', digicode: '', Role: '' });
                setAlertMessage('this account already exists');
                setStatus('failed');
                return;
            } else {
                let hash = await AuthenticationHash(trimmedUsername, account, trimmedPassword, trimmedDigicode, web3);
                if (trimmedRole === '0') {
                    const pubkey = await callKeyGenServerPatient(account);//if patients 
                    await contract.methods.register(hash, trimmedRole, pubkey).send({ from: account });
                    await SavePublicKey(pubkey);
                    console.log(pubkey);
                } else {
                    const pubkey1 = await callKeyGenServerNoPatient(account);
                    await contract.methods.register(hash, trimmedRole,pubkey1).send({ from: account });
                }





                setFormData({ username: '', password: '', Role: '', digicode: '' });

                setAlertMessage("Signup successful");
                setStatus('success');
                setSignedUp(true);

                accountCreated(true);
                return;
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    //make the text frensh 
    return (
        <div className="sign-up">
            créé un compte
            <div className='signup-form'>
                <Card fluid centered>
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
                                    name='username'
                                    placeholder='username'
                                    value={formData.username}
                                    autoComplete="username"
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='password'
                                    name='password'
                                    placeholder='password'
                                    value={formData.password}
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <select
                                    required
                                    name='Role'
                                    value={formData.Role}
                                    onChange={handleChange}
                                >
                                    <option value="">choisir le role</option>
                                    <option value="0">patient</option>
                                    <option value="1">doctor</option>
                                    <option value="2">researcher</option>
                                    <option value="3">pharmacist</option>
                                    <option value="4">labAgent</option>
                                    <option value="5">insuranceemployee</option>
                                </select>
                            </Form.Field>
                            <Form.Field>
                                <input
                                    required
                                    type='text'
                                    name='digicode'
                                    placeholder='6 digit code'
                                    value={formData.digicode}
                                    autoComplete="digicode"
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <Button type='submit' primary fluid size='large' onClick={onSignUp}>
                                    Céer un compte
                                </Button>
                                <Button type='reset' variant='danger' size='lg' color='red' >
                                    Effacer
                                </Button>

                            </Form.Field>
                        </Form>
                    </Card.Content>
                </Card>
                <div className="signin-onUp">
                    Vous avez déjà un compte? <Link to='/sign-in'>Connectez-vous</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

/*
class SignUp extends Component {
    state = {
        username: '',
        password: '',
        Role: '',
        digicode: '',
        alertMessage: '',
        status: '',
        signedUp: false
    }

    onSignUp = async () => {
        //this.setState({ signedUp: false });

        if (this.state.username !== '' && this.state.password !== '' && this.state.digicode !== '') {
            let username = this.state.username.trim();
            let password = this.state.password.trim();
            let Role = this.state.Role.trim();
            let digicode = this.state.digicode.trim();

            //===
            if (password.length < 8) {
                this.setState({
                    alertMessage: "at least 8 characters for password",
                    status: 'failed',
                    password: '',
                    digicode: '',
                });
                return;
            } else {

            } if (digicode.length !== 6) {
                this.setState({
                    alertMessage: "6 digit required for digicode",
                    status: 'failed',
                    digicode: ''
                });
                return
            } else {
                let userAddress = await this.props.contract.methods.getUserAddress()
                    .call({ from: this.props.account });

                if (userAddress !== '0x0000000000000000000000000000000000000000') {
                    this.setState({
                        alertMessage: 'this account already exists',
                        status: 'failed',
                        username: '',
                        password: '',
                        digicode: '',
                    });

                    return;
                } else {
                    let hash = await AuthenticationHash(username, this.props.account, password, digicode, this.props.web3);

                    await this.props.contract.methods.register(hash,this.state.Role).send({ from: this.props.account });

                    this.setState({
                        username: '',
                        password: '',
                        Role: '',
                        digicode: '',
                        status: 'success',
                        alertMessage: "Signup successful",
                        signedUp: true
                    });

                    this.props.accountCreated(this.state.signedUp);
                    return;
                }
            }
        }

    }

    render() {
        return (
            <div className="sign-up">
                Create an account
                <div className='signup-form'>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large'>
                                {
                                    this.state.alertMessage !== '' && this.state.status === 'failed' ?
                                        <Message negative>
                                            {this.state.alertMessage}
                                        </Message> :
                                        this.state.alertMessage !== '' && this.state.status === 'success' ?
                                            <Message positive>
                                                {this.state.alertMessage}
                                            </Message> :
                                            console.log('')
                                }
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='username'
                                        value={this.state.username}
                                        autoComplete="username"
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='password'
                                        placeholder='password'
                                        value={this.state.password}
                                        autoComplete="current-password"
                                        onChange={e => this.setState({ password: e.target.value })}
                                    />
                                </Form.Field>
                               <Form.Field>
                               <select
                                required
                                value={this.state.Role}
                                onChange={e => this.setState({ Role: e.target.value })}
                                >
                                 <option value="">Select Role</option>
                                 <option value="0">patient</option>
                                  <option value="1">doctor</option>
                                 <option value="2">researcher</option>
                                <option value="3">pharmacist</option>
                                 <option value="4">labAgent</option>
                                <option value="5">insuranceemployee</option>
                                   </select>
                               </Form.Field>

                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='6 digit code'
                                        value={this.state.digicode}
                                        autoComplete="digicode"
                                        onChange={e => this.setState({ digicode: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignUp}>
                                        Create account
                                    </Button>
                                </Form.Field>
                            </Form>
                        </Card.Content>
                    </Card>
                    <div className="signin-onUp">
                        Already have an account? <Link to='/sign-in'>Sign in</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp*/
