
import React, { useEffect } from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faLineChart, faR, faUser, faFileMedicalAlt, faCalendarAlt, faCalendarCheck, faPaperclip, faUserMd, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import RegisterComp from '../patientservice/registercomp';
import "../App.css";
import DetailComp from '../patientservice/details';
import Medicalfile from '../patientservice/medicalfile';
import Appointments from '../patientservice/appointments';
import Records from '../patientservice/seemedrecords';
import UpdateFile from '../patientservice/updatefile';
import Services from '../patientservice/services';
import Events from '../patientservice/events';
const SideNavBar = (props) => {
  
  return (
    <Router>
      <Route render={({ location, history }) => (
        <React.Fragment>
          <SideNav
            onSelect={(selected) => {
              const to = '/patient/' + selected;
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
              <NavItem eventKey="detail">
                <NavIcon>
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>
                  detail
                </NavText>
              </NavItem>
              <NavItem eventKey="medicalfile">
                <NavIcon>
                  <FontAwesomeIcon icon={faFileMedicalAlt} style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>
                  Dossiers médicaux
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
              <NavItem eventKey="appointments">
                <NavIcon>
                  <FontAwesomeIcon icon={
                    faCalendarCheck} style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>
                  Rendez-vous
                </NavText>
              </NavItem>
         
              <NavItem eventKey="services">
                <NavIcon>
                  <FontAwesomeIcon icon={faUserMd} style={{ fontSize: '1.75em' }} />

                </NavIcon>
                <NavText>
                  services
                </NavText>
              </NavItem>
              <NavItem eventKey="updatefil">
                <NavIcon>
                  <FontAwesomeIcon icon={faUserEdit} style={{ fontSize: '1.75em' }} />

                </NavIcon>
                <NavText>
                    Mise à jour du dossier
                  </NavText>
              </NavItem>




            </SideNav.Nav>
          </SideNav>
          <div id='content' className={props.isOpen ? 'content-open' : 'content-closed'}>

            <Route path="/patient/register" render={(routeProps) => (
              <RegisterComp
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

            <Route path="/patient/detail" render={(routeProps) => (
              <DetailComp
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

            <Route path="/patient/medicalfile" render={(routeProps) => (
              <Medicalfile
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
            <Route path="/patient/appointments" render={(routeProps) => (
              <Appointments {...routeProps} 
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
            <Route  path="/patient/records" render={(routeProps) => (
              <Records {...routeProps} 
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
            <Route path="/patient/updatefil" render={(routeProps) => (
              <UpdateFile {...routeProps}
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

            <Route path="/patient/services" render={(routeProps) => (
              <Services {...routeProps}
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
            <Route path="/patient/events" render={(routeProps) => (
             <Events {...routeProps}
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


export default SideNavBar;





/*return (
  <SideNav expanded={isOpen} 
  style={{ paddingTop: '57px' ,
  display : 'block',
  backgroundColor: 'BLACK',
  
  }}>
    <Toggle onClick={toggleSidebar} />
    <Nav defaultSelected="home">
      <NavItem eventKey="home">
        <NavIcon>
          <FontAwesomeIcon icon={faHome} style={{ fontSize: '1.75em' }} />
        </NavIcon>
        <NavText>Home</NavText>
      </NavItem>
      <NavItem eventKey="placed orders">
        <NavIcon>
          <FontAwesomeIcon icon={faLineChart} style={{ fontSize: '1.75em' }} />
        </NavIcon>
        <NavText>Placed Orders</NavText>
      </NavItem>
    </Nav>
  </SideNav>
);*/



/* const [isVisible, setIsVisible] = useState(true);
 
  return (
    <SideNav expanded={isVisible} style={{
        display : 'block',
        paddingTop: '57px',
 
}}>  
      <Toggle
        onClick={() => {
          setIsVisible(!isVisible);
        }}
      />
      <Nav defaultSelected="home">
        <NavItem eventKey="home">
          <NavIcon>
            <FontAwesomeIcon icon={faHome} style={{ fontSize: '1.75em' }} />
          </NavIcon>
          <NavText>Home</NavText>
        </NavItem>
        <NavItem eventKey="placed orders">
          <NavIcon>
            <FontAwesomeIcon icon={faLineChart} style={{ fontSize: '1.75em' }} />
          </NavIcon>
          <NavText>Placed Orders</NavText>
        </NavItem>
      </Nav>
    </SideNav>
 
       
  );
};*/