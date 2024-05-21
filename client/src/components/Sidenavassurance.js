
import React, { useEffect } from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faLineChart, faR, faUser, faFileMedicalAlt, faCalendarAlt, faCalendarCheck, faPaperclip, faUserMd, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import RegisterComp from '../patientservice/registercomp';
import ClaimsDashboard from '../assuranceservice/showmedicalfile';
import "../App.css";
import InsuranceAgent from '../assuranceservice/assuranceregister';
const Sidenavassurance = (props) => {
  return (
    <Router>
      <Route render={({ location, history }) => (
        <React.Fragment>
          <SideNav
            onSelect={(selected) => {
              const to = '/assurance/' + selected;
              // Replace the current entry in the history stack
              history.replace(to);
            }}
            defaultExpanded={true}
            style={{
              display: 'block',
              paddingTop: '57px',
              backgroundColor: '#60adff',


            }}
          >
            <SideNav.Toggle onClick={props.toggleSidebar} />
            <SideNav.Nav defaultSelected="register">
              <NavItem eventKey="register">
                <NavIcon>
                  <FontAwesomeIcon icon={faR} style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>
                  register
                </NavText>
              </NavItem>
    
              <NavItem eventKey="medicalfile">
                <NavIcon>
                  <FontAwesomeIcon icon={faFileMedicalAlt} style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>
                  medicalfile
                </NavText>
              </NavItem>
              <NavItem eventKey="events">
                <NavIcon>
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>
                  News & Events
                </NavText>
              </NavItem>
          


            </SideNav.Nav>
          </SideNav>
          <div id='content' className={props.isOpen ? 'content-open' : 'content-closed'}>

            <Route path="/assurance/register" render={(routeProps) => (
              <InsuranceAgent
                {...routeProps}
                contractPatients={props.contractPatients}
                isOpen={props.isOpen}
                toggleSidebar={props.toggleSidebar}
                web3={props.web3}
                contract={props.contract}
                account={props.account}
                signedUp={props.signedUp}
                userSignedIn={props.userSignedIn} />
            )} />

            <Route path="/assurance/medicalfile" render={(routeProps) => (
              <ClaimsDashboard
                {...routeProps}
                contractPatients={props.contractPatients}
                isOpen={props.isOpen}
                toggleSidebar={props.toggleSidebar}
                web3={props.web3}
                contract={props.contract}
                account={props.account}
                signedUp={props.signedUp}
                userSignedIn={props.userSignedIn}
                
                 />
            )} />







          </div>
        </React.Fragment>
      )}
      />
    </Router>
  );

};

export default Sidenavassurance;
