import React, { Component } from "react";
import web3Connection from './web3Connection';
import { Contract } from './Contract';

import 'semantic-ui-css/semantic.min.css'
import { Menu, Divider } from "semantic-ui-react";
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import Home from './components/Home';
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn"
import SignOut from "./components/SignOut";
import UserAccount from './components/UserAccount';
import Patient from './components/patient';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Stack, Nav, Navbar, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { DeletePublickey } from "./utils/localstorage";



const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [activeItem, setActiveItem] = useState('home');
  const [signedUp, setSignedUp] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = await web3Connection();
        const contract = await Contract(web3);
        const accounts = await web3.eth.getAccounts();

        setWeb3(web3);
        setContract(contract);
        setAccount(accounts[0]);
        console.log(accounts[0]);
        window.ethereum.on('accountsChanged', function (accounts) {
          DeletePublickey();
          setAccount(accounts[0]);
          setLoggedIn(false);

        });
      } catch (error) {
        alert(`Failed to load web3, accounts, and contract.`);
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const getAccount = async () => {
    if (web3 !== null || web3 !== undefined) {
      await window.ethereum.on('accountsChanged', async (accounts) => {
        DeletePublickey();
        setAccount(accounts[0]);
        setLoggedIn(false);


      });
    }
  }

  const accountCreated = async (signedUp) => {
    setSignedUp(signedUp);
  }

  const userSignedIn = async (loggedIn, username) => {
    setLoggedIn(loggedIn);
    setUsername(username);
  }

  const loggedOut = async (loggedIn) => {
    setLoggedIn(loggedIn);
  }

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="main_page">
      <header>

        <Navbar fixed="top" expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link
                  className="nav-link"
                  to="/"
                >
                  Home
                </Link>
                <Link
                  className="nav-link"
                  to="/help"
                >
                  Help
                </Link>
              </Nav>
              <Nav>
                {loggedIn &&
                  <Link
                    className="nav-link"
                    to="/user-account"
                  >
                    User Account
                  </Link>
                }
                {!loggedIn &&
                  <Link
                    className="nav-link"
                    to="/sign-in"
                  >
                    Sign In
                  </Link>
                }
                {loggedIn ?
                  <Link
                    className="nav-link"
                    to="/sign-out"
                  >
                    Sign Out
                  </Link>
                  :
                  <Link
                    className="nav-link"
                    to="/sign-up"
                  >
                    Sign Up
                  </Link>
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <main >
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/help">
            Help page
          </Route>
          {loggedIn ?
            <Route path="/user-account">
              <UserAccount account={account} username={username} />
            </Route>
            :
            <Route path="/user-account">
              You have been logged out
            </Route>
          }
          <Route path="/sign-in">
            {loggedIn ?
              <Redirect to='/patient' />
              :
              <SignIn
                web3={web3}
                contract={contract}
                account={account}
                signedUp={signedUp}
                userSignedIn={setLoggedIn}
              />
            }
          </Route>
          <Route path="/sign-up">
            <SignUp
              web3={web3}
              contract={contract}
              account={account}
              accountCreated={setSignedUp}
            />
          </Route>
          <Route path="/sign-out">
            {loggedIn ?
              <SignOut loggedOut={setLoggedIn} />
              :
              <Redirect to="/sign-in" />
            }
          </Route>
          <Route path="/patient">
            {!loggedIn ?
              <Patient
                web3={web3}
                contract={contract}
                account={account}
              // signedUp={signedUp}
              //userSignedIn={setLoggedIn}

              />
              :
              <Redirect to="/sign-in" />
            }
          </Route>
        </Switch>

      </main>
      <footer style={
        {
          position: 'fixed',
          left: '0',
          bottom: '0',
          width: '100%',
          backgroundColor: 'black',
          color: 'white',
          textAlign: 'center'
        }

      }>
        <div className="footer">
          <p>© 2021 All rights reserved.</p>

        </div>

      </footer>

    </div>
  );
}

export default App;






/*return (
  
  <div className="App">
    <BrowserRouter>
      <Navbar fixed="top" expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                name='home'
                active={activeItem === 'home'}
                onClick={(e) => handleItemClick(e, { name: 'home' })}
                as={Link}
                to='/'
              >
                Home
              </Nav.Link>
              <Nav.Link
                name='help'
                active={activeItem === 'help'}
                onClick={(e) => handleItemClick(e, { name: 'help' })}
                as={Link}
                to='/help'
              >
                Help
              </Nav.Link>
            </Nav>
            <Nav>
              {loggedIn &&
                <Nav.Link
                  name='user account'
                  active={activeItem === 'user account'}
                  onClick={(e) => handleItemClick(e, { name: 'user account' })}
                  as={Link}
                  to='/user-account'
                >
                  User Account
                </Nav.Link>
              }
              {!loggedIn &&
                <Nav.Link
                  name='sign in'
                  active={activeItem === 'sign in'}
                  onClick={(e) => handleItemClick(e, { name: 'sign in' })}
                  as={Link}
                  to='/sign-in'
                >
                  Sign In
                </Nav.Link>
              }
              {loggedIn ?
                <Nav.Link
                  name='sign out'
                  active={activeItem === 'sign out'}
                  onClick={(e) => handleItemClick(e, { name: 'sign out' } )}
                  as={Link}
                  to='/sign-out'
                >
                  Sign Out
                </Nav.Link>
                :
                <Nav.Link
                  name='sign up'
                  active={activeItem === 'sign up'}
                  onClick={(e) => handleItemClick(e, { name: 'sign up' })}
                  as={Link}
                  to='/sign-up'
                >
                  Sign Up
                </Nav.Link>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  
    
      
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/help">
          Help page
        </Route>
        {loggedIn ?
          <Route path="/user-account">
            <UserAccount account={account} username={username} />
          </Route>
          :
          <Route path="/user-account">
            You have been logged out
          </Route>
        }
        <Route path="/sign-in">
          {loggedIn ?
            <Redirect to='/user-account' />
            :
            <SignIn
              web3={web3}
              contract={contract}
              account={account}
              signedUp={signedUp}
              userSignedIn={setLoggedIn}
            />
          }
        </Route>
        <Route path="/sign-up">
          <SignUp
            web3={web3}
            contract={contract}
            account={account}
            accountCreated={setSignedUp}
          />
        </Route>
        <Route path="/sign-out">
          {loggedIn ?
            <SignOut loggedOut={setLoggedIn} />
            :
            <Redirect to="/sign-in" />
          }
        </Route>
        <Route path="/patient">
          <Patient />
        </Route>
      </Switch>
    </BrowserRouter>
  </div>
);*/



/*
class App extends Component {
  state = {
    web3: null,
    account: null,
    contract: null,
    balance: null,
    activeItem: 'home',
    signedUp: false,
    loggedIn: false,
    username: ''
    //color: 'teal'
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name, color: 'teal' })

  componentDidMount = async () => {
    try {
      const web3 = await web3Connection();
      const contract = await Contract(web3);
      const accounts = await web3.eth.getAccounts();

      this.setState({ web3, contract, account: accounts[0] }, this.start);
    } catch (error) {
      alert(
        `Failed to load web3`,
      );
      console.error(error);
    }

    await this.getAccount();
  };

  start = async () => {
    await this.getAccount();
    const { web3, contract, account } = this.state;

    console.log("web3 =", web3);
    console.log("Contract =", contract);
    console.log("Acoount =", account);
  };

  getAccount = async () => {
    if (this.state.web3 !== null || this.state.web3 !== undefined) {
      await window.ethereum.on('accountsChanged', async (accounts) => {
        this.setState({
          account: accounts[0],
          loggedIn: false
        });

        this.state.web3.eth.getBalance(accounts[0], (err, balance) => {
          if (!err) {
            this.setState({ balance: Formate(this.state.web3.utils.fromWei(balance, 'ether')) });
          }
        });
      });
    }
  }

  accountCreated = async (signedUp) => {
    this.setState({ signedUp });
  }

  userSignedIn = async (loggedIn, username) => {
    this.setState({ loggedIn, username });
  }

  loggedOut = async (loggedIn) => {
    this.setState({ loggedIn });
  }

  render() {
    const { activeItem, color } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="main-page">
          <BrowserRouter>
            <div className="home-nav">
              <Menu stackable inverted secondary size='small'>
                <Menu.Item
                  name='home'
                  color={color}
                  active={activeItem === 'home'}
                  onClick={this.handleItemClick}
                  as={Link}
                  to='/'
                />
                <Menu.Item
                  name='help'
                  color={color}
                  active={activeItem === 'help'}
                  onClick={this.handleItemClick}
                  as={Link}
                  to='/help'
                />
                {
                  this.state.loggedIn ?
                    <Menu.Item
                      position='right'
                      name='user account'
                      color={color}
                      active={activeItem === 'user account'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/user-account'
                    />
                    :
                    console.log('')
                }
                {
                  !this.state.loggedIn ?
                    <Menu.Item
                      position='right'
                      name='sign in'
                      color={color}
                      active={activeItem === 'sign in'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-in'
                    />
                    :
                    console.log('')
                }

                {
                  this.state.loggedIn ?
                    <Menu.Item
                      name='sign out'
                      color='red'
                      active={activeItem === 'sign out'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-out'
                    />
                    :
                    <Menu.Item
                      name='sign up'
                      color={color}
                      active={activeItem === 'sign up'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-up'
                    />
                }
              </Menu>
            </div>
            <Divider inverted />

            <Switch>
              <Route exact path='/' >
                <Home />
              </Route>
              <Route path='/help' >
                Help page
              </Route>
              {
                this.state.loggedIn ?
                  <Route path='/user-account' >
                    <UserAccount
                      account={this.state.account}
                      username={this.state.username}
                    />
                  </Route>
                  :
                  <Route path='/user-account'>
                    You have been logged out
                  </Route>
              }
              {
                <Route path='/sign-in' >
                  {
                    this.state.loggedIn ?
                      <Redirect to='/user-account' />
                      :
                      <SignIn
                        web3={this.state.web3}
                        contract={this.state.contract}
                        account={this.state.account}
                        signedUp={this.state.signedUp}
                        userSignedIn={this.userSignedIn}
                      />
                  }
                </Route>
              }
              {
                <Route path='/patient' >
                  <Patient />
                </Route>
              }

              {
                this.state.loggedIn ?
                  <Route path='/sign-out'>
                    <SignOut
                      loggedOut={this.loggedOut}
                    />
                    You've been logged out
                    <br></br>
                    Thank you
                  </Route>
                  :
                  <Route path='/sign-up' >
                    <SignUp
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state.account}
                      accountCreated={this.accountCreated}
                    />
                  </Route>
              }
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
*/