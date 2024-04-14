import React from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNavBar from './Sidenav';
import { useEffect } from 'react';
import { ContractPatient } from '../Contract';
import "../App.css";
import { useState } from 'react';
const Patient = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [contractPatients, setContractPatients] = useState(null);
  useEffect(() => {
    const initContract = async () => {
      const contractPatients = await ContractPatient(props.web3);
      setContractPatients(contractPatients);
    };
    initContract();
  }, [props.web3]);
  return (
    <div id='wrapper'>
      <SideNavBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} web3={props.web3}
        contract={props.contract}
        account={props.account}
        signedUp={props.signedUp}
        userSignedIn={props.userSignedIn}
        contractPatients={contractPatients}
      />

    </div>
  );
};

export default Patient;










/*
    return (
        <div id='wrapper'>
<div id='sidebar'>
<SideNavBar />
</div>
<div id='content'>
    <h1 style={
        {
            color:'black',
            textAlign: 'center',
            marginTop: '20px'
        }
    
    }>Patient</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
    </div>
    );
}
*/