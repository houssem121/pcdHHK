import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthValidation from '../utils/AuthValidation';
import "../App.css";

const SignIn = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [digicode, setDigicode] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const onSignIn = async () => {
        if (username !== '' && password !== '' && digicode !== '') {
            let usernameTrimmed = username.trim();
            let passwordTrimmed = password.trim();
            let digicodeTrimmed = digicode.trim();

            if (passwordTrimmed.length < 8) {
                setAlertMessage("at least 8 characters for password");
                setStatus('failed');
                setPassword('');
                setDigicode('');
                return;
            } else if (digicodeTrimmed.length !== 6) {
                setAlertMessage("6 digit required for digicode");
                setStatus('failed');
                setDigicode('');
                return;
            } else {
                let userAddress = await props.contract.methods.getUserAddress()
                    .call({ from: props.account });

                if (userAddress === '0x0000000000000000000000000000000000000000') {
                    setAlertMessage('Account does not exists');
                    setStatus('failed');
                    setUsername('');
                    setPassword('');
                    setDigicode('');
                    return;
                } else {
                    let validated = await AuthValidation(
                        usernameTrimmed,
                        props.account,
                        passwordTrimmed, digicodeTrimmed,
                        props.web3,
                        props.contract
                    );

                    if (!validated) {
                        setAlertMessage('Incorrect log in');
                        setStatus('failed');
                        setUsername('');
                        setPassword('');
                        setDigicode('');
                        return;
                    } else {
                        setAlertMessage("Sign in successful");
                        setStatus('success');
                        setLoggedIn(true);
                        props.userSignedIn(true, usernameTrimmed);
                        // Resetting fields here might not be necessary since we're likely navigating away on success
                        setUsername('');
                        setPassword('');
                        setDigicode('');
                        return;
                    }
                }
            }
        }
    };

    return (
        <div className="sign-up">
            {/*en francais  */}
            Connectez-vous à votre compte
            <div className='signup-form'>
                <Card fluid centered>
                    <Card.Content>
                        <Form size='large'>
                            {
                                alertMessage !== '' && status === 'failed' ?
                                    <Message negative>
                                        {alertMessage}
                                    </Message> :
                                    alertMessage !== '' && status === 'success' ?
                                        <Message positive>
                                            {alertMessage}
                                        </Message> : null
                            }
                            <Form.Field required>
                                <input
                                    type='text'
                                    placeholder='username'
                                    value={username}
                                    autoComplete="username"
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </Form.Field>
                            <Form.Field required>
                                <input
                                    type='password'
                                    placeholder='password'
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Form.Field>
                            <Form.Field required>
                                <input
                                    type='text'
                                    placeholder='6 digit code'
                                    value={digicode}
                                    autoComplete="digicode"
                                    onChange={e => setDigicode(e.target.value)}
                                />
                            </Form.Field>
                            <Form.Field 
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}
                            
                            >
                                <Button type='button' primary fluid size='large' onClick={onSignIn}>
                                    Se connecter
                                </Button>
                                <Button type='reset' variant='danger' size='large' color='red' >
                                Effacer
                                </Button>

                            </Form.Field>
                        </Form>
                    </Card.Content>
                </Card>
                {
                    props.signedUp ? null :
                        <div className="signin-onUp">
                            Vous n'avez pas de compte? <Link to='/sign-up'>S'inscrire</Link>
                        </div>
                }
            </div>
        </div>
    );
};

export default SignIn;

/*import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthValidation from '../utils/AuthValidation';
import "../App.css";

class SignIn extends Component {
    state = {
        username: '',
        password: '',
        digicode: '',
        alertMessage: '',
        status: '',
        loggedIn: false
    }

    onSignIn = async () => {

        if (this.state.username !== '' && this.state.password !== '' && this.state.digicode !== '') {
            let username = this.state.username.trim();
            let password = this.state.password.trim();
            let digicode = this.state.digicode.trim();

            let usernameToSend = username;

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

                if (userAddress === '0x0000000000000000000000000000000000000000') {
                    this.setState({
                        alertMessage: 'Account does not exists',
                        status: 'failed',
                        username: '',
                        password: '',
                        digicode: '',
                    });
                    return;
                } else {
                    let validated = await
                        AuthValidation(
                            username,
                            this.props.account,
                            password, digicode,
                            this.props.web3,
                            this.props.contract
                        );

                    if (!validated) {
                        this.setState({
                            alertMessage: 'Incorrect log in',
                            status: 'failed',
                            username: '',
                            password: '',
                            digicode: '',
                        });
                        return
                    } else {
                        this.setState({
                            username: '',
                            password: '',
                            digicode: '',
                            status: 'success',
                            alertMessage: "Sign in successful",
                            loggedIn: true
                        });

                        this.props.userSignedIn(
                            this.state.loggedIn,
                            usernameToSend
                        );

                        return;
                    }
                }
            }
        }


        this.setState({
            username: '',
            password: '',
            digicode: ''
        })
    }
    render() {
        return (
            <div className="sign-up">
                Sign in to your account
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
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='username'
                                        value={this.state.username}
                                        autoComplete="username"
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='password'
                                        placeholder='password'
                                        value={this.state.password}
                                        autoComplete="current-password"
                                        onChange={e => this.setState({ password: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='6 digit code'
                                        value={this.state.digicode}
                                        autoComplete="digicode"
                                        onChange={e => this.setState({ digicode: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignIn}>
                                        Sign in
                                    </Button>
                                </Form.Field>

                            </Form>
                        </Card.Content>
                    </Card>
                    {
                        this.props.signedUp ?
                            console.log() :
                            <div className="signin-onUp">
                                Don't have an account? <Link to='/sign-up'>Sign up</Link>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default SignIn
*/