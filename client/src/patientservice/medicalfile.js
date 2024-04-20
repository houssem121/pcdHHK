import React from 'react';
import uploadFileToIPFS from '../utils/ipfsconnections';
import { Form } from 'react-bootstrap';
import { EncrypteFile, DecrypteFile, parseJSONWithLargeNumbers, handleFileUpload } from '../utils/UpDownIPFS';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import closeModal from 'react-bootstrap/Modal';
import { Card, ListGroup } from 'react-bootstrap';
import Modals from './modals';
import { useEffect } from 'react';
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



  const downloadFile = async () => {
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
      console.log('File downloaded successfully', data1);

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };




  return (
    <><Form>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload Medical File</Form.Label>
        <Form.Control type="file" onChange={(event) => handleFileUpload(event, props)} />
      </Form.Group>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Download Medical File</Form.Label>
        <Form.Control type="button" onClick={downloadFile} value="Download" />
      </Form.Group>

    </Form>

      <Modals data1={data1} show={show} handleClose={closeModal} />


    </>

  );

}
export default Medicalfile;
