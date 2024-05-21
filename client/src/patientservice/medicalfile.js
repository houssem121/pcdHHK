import React from 'react';
import uploadFileToIPFS from '../utils/ipfsconnections';
import { Form } from 'react-bootstrap';
import { EncrypteFile, DecrypteFile, parseJSONWithLargeNumbers, handleFileUpload ,generateReEncryptionKey} from '../utils/UpDownIPFS';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import closeModal from 'react-bootstrap/Modal';
import { Card, ListGroup } from 'react-bootstrap';
import Modals from './modals';
import { Accordion } from 'react-bootstrap';
import { useEffect } from 'react';
import { ContractDoctor } from '../Contract'; // Import unique suffisant
import './Appointments.css';
const Medicalfile = (props) => {
  const data = {

    "Informations du patient": {
      "ID du patient": "0x123456789abcdef",
      "Nom": "chakroun mohamed",
      "Date de naissance": "2002-04-15",
      "Sexe": "Hommes",
      "Adresse": "1234 Elm Street, YourCity, YC, 12345",
      "Contact": {
        "Téléphone": "555-123-4567",
        "Email": "johndoe@example.com"
      },
      "Contact d'urgence": {
        "Nom": "Jane Doe",
        "Relation": "Épouse",
        "Téléphone": "555-987-6543"
      },
      "Assurance": {
        "Fournisseur": "XYZ Insurance",
        "Numéro de police": "123456789",
        "Numéro de groupe": "ABC123"
      }
    },
    "Dossiers médicaux": [
      {
        "id": 1,
        "timestamp": 1620124800,
        "date": "2023-01-15",
        "diagnosis": "Grippe",
        "treatment": {
          "timestamp": 1620124800,
          "doctor": {
            "name": "Dr. Martin",
            "speciality": "Médecine générale"
          },
          "patient": "John Doe",
          "medicines": ["Paracétamol", "Ibuprofène"],
          "fullyPurchased": true
        },
        "test": {
          "timestamp": 1620124800,
          "category": "Taux de fièvre",
          "result": "38.5°C",
          "done": true
        },
        "doctor": {
          "name": "Dr. Martin",
          "speciality": "Médecine générale"
        }
      },
      {
        "id": 2,
        "timestamp": 1620124800,
        "date": "2023-03-10",
        "diagnosis": "Hypertension",
        "treatment": {
          "timestamp": 1620124800,
          "doctor": {
            "name": "Dr. Lefèvre",
            "speciality": "Cardiologie"
          },
          "patient": "John Doe",
          "medicines": ["Enalapril"],
          "fullyPurchased": true
        },
        "test": {
          "timestamp": 1620124800,
          "category": "Tension artérielle",
          "result": "130/80 mmHg",
          "done": true
        },
        "doctor": {
          "name": "Dr. Lefèvre",
          "speciality": "Cardiologie"
        }
      },
      {
        "id": 3,
        "timestamp": 1620124800,
        "date": "2023-03-10",
        "diagnosis": "Hypertension",
        "treatment": {
          "timestamp": 1620124800,
          "doctor": {
            "name": "Dr. Lefèvre",
            "speciality": "Cardiologie"
          },
          "patient": "John Doe",
          "medicines": ["Enalapril"],
          "fullyPurchased": true
        },
        "test": {
          "timestamp": 1620124800,
          "category": "Tension artérielle",
          "result": "130/80 mmHg",
          "done": true
        },
        "doctor": {
          "name": "Dr. Lefèvre",
          "speciality": "Cardiologie"
        }
      },
      {
        "id": 4,
        "timestamp": 1620124800,
        "date": "2023-03-10",
        "diagnosis": "Hypertension",
        "treatment": {
          "timestamp": 1620124800,
          "doctor": {
            "name": "Dr. Lefèvre",
            "speciality": "Cardiologie"
          },
          "patient": "John Doe",
          "medicines": ["Enalapril"],
          "fullyPurchased": true
        },
        "test": {
          "timestamp": 1620124800,
          "category": "Tension artérielle",
          "result": "130/80 mmHg",
          "done": true
        },
        "doctor": {
          "name": "Dr. Lefèvre",
          "speciality": "Cardiologie"
        }
      }
    ]

  }
  const [data1, setData1] = useState(data);

  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);



  const closeModal = () => {
    setShow(false);
  };



  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }



  const downloadFile = async (props) => {
    try {
      // Log the patient's Ethereum address
      const patientAddress = props.account;
      console.log('Patient Address:', patientAddress);

      // Retrieve patient details from a smart contract
      const patientDetails = await props.contractPatients.methods.getPatients(patientAddress).call();
      const ipfsHash = patientDetails.dossierHash;
      console.log('IPFS Hash:', ipfsHash);

      // Construct the URL to access the file via IPFS gateway
      const url = `https://ipfs.io/ipfs/${ipfsHash}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to download file: ${res.status} ${res.statusText}`);
      }
      // Parse the response into JSON
      const data = await res.json();

      // Parse the JSON string while preserving large numbers
      const parsedData = parseJSONWithLargeNumbers(data);
      console.log('parseddata', parsedData);
      console.log('Encrypted File:', parsedData.encrypted_file);
      console.log('Capsule:', parsedData.capsule);
      // Decrypt the file
      const decryptedData = await DecrypteFile(parsedData.encrypted_file, parsedData.capsule, props);
      console.log('Decrypted File:', decryptedData);
      setData1(decryptedData.decrypted_file);
      console.log('Decrypted File:', decryptedData.decrypted_file);
      console.log('File downloaded successfully');
      handleShow(true);
      console.log('File downloaded successfully', data1['Dossiers médicaux']);

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    getAllUsersFileAccessRequests(props);
  }, []);

  async function getAllUsersFileAccessRequests(props) {
    try {
      const contractDocteur = await ContractDoctor(props.web3);
      const events = await contractDocteur.getPastEvents('AccessRequestMade', {
        filter: { patient: props.account },
        fromBlock: 0,
        toBlock: 'latest'
      });

      // Créer une liste d'objets contenant les informations des utiliseteurss with this  event AccessRequestMade(address requester, address patient,string publicKey,string doctorname,string role ,uint256 date);

      const usersList = events.map(event => {
        return {
          requester: event.returnValues.requester,
          publicKey: event.returnValues.publicKey,
          doctorname: event.returnValues.doctorname,
          role: event.returnValues.role,
          date: new Date(event.returnValues.date * 1000).toLocaleDateString()
        };
      });


      if (usersList.length > 0) { setDemandes(usersList); }


      console.log('Liste des docteurs mise à jour:', usersList);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements doctoradded:', error);
      throw error;
    }
  }
  const [demandes, setDemandes] = useState([
    {
      requester: 'Mr.Mohamed Chakroun',
      role: 'Pharmacien',
      date: '2024-05-01'
    }
  ]);
  //this will be changed with fresh events from web3
  /* const demandes = [
     {
       id: 1,
       requester: 'Mr.Mohamed Chakroun',
       role: 'Pharmacien',
       date: '2024-05-01'
     },
     {
       id: 2,
       requester: 'Dr.Martin',
       role: 'Docteur',
       date: '2024-05-01'
     },
     {
       id: 3,
       requester: 'Mr. Lefèvre',
       role: 'Assurance',
       date: '2023-03-10'
     },
     {
       id: 4,
       requester: 'Mr. Lefèvre',
       role: 'Pharmacien',
       date: '2023-03-10'
     }
   ];
 */
  const [currentDemandeIndex, setCurrentDemandeIndex] = useState(0);

  const showNextDemande = () => {
    setCurrentDemandeIndex(prevIndex => prevIndex + 1);
  };

  const showPreviousDemande = () => {
    setCurrentDemandeIndex(prevIndex => prevIndex - 1);
  };

  const acceptDemande = () => {
    console.log('Demande accepted pour le docteur:', demandes[currentDemandeIndex].doctorname);
    generateReEncryptionKey(props, demandes[currentDemandeIndex].publicKey,props.account, demandes[currentDemandeIndex].requester);
    alert('Demande acceptée');
  }

  const rejectDemande = () => {
    console.log('Demande rejected');
    alert('Demande rejetée');
  }




  return (
    <div className="register-comp">
      <h2 className="register-title">Demandes d'accès au dossier médical</h2>
      <Card className="mb-3">
        <Card.Body>
          <div style={
            {
              color: 'black'

            }} >
            <strong >Dr.{demandes[currentDemandeIndex].doctorname}</strong> - {demandes[currentDemandeIndex].role} - {demandes[currentDemandeIndex].date}
          </div>
          <div className="d-flex mt-3 justify-content-center">
            <Button variant="success" onClick={acceptDemande} className="me-3">Accepter</Button>
            <Button variant="danger" onClick={rejectDemande} className="ms-3">Rejeter</Button>
          </div>

          <div className="d-flex justify-content-between mt-3">
            <Button variant="primary" onClick={showPreviousDemande} disabled={currentDemandeIndex === 0}>Précédent</Button>
            <Button variant="primary" onClick={showNextDemande} disabled={currentDemandeIndex === demandes.length - 1}>Suivant</Button>
          </div>
        </Card.Body>
      </Card>


      <h2 className="register-title">Dossier médical</h2>

      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label style={{
            color: 'black'

          }}>Upload Medical File</Form.Label>
          <Form.Control type="file" onChange={(event) => handleFileUpload(event, props)} className="custom-file-input"
          />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label style={{
            color: 'black'

          }}>Download Medical File</Form.Label>
          <Form.Control type="button" onClick={() => downloadFile(props)} value="Download"
            className="custom-download-button" />
        </Form.Group>

      </Form>


      <Modals data1={data1} show={show} handleClose={closeModal} />


    </div>



  );

}
export default Medicalfile;
