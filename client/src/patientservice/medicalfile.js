import React from 'react';
import uploadFileToIPFS from '../utils/ipfsconnections';
import { Form } from 'react-bootstrap';
import { EncrypteFile ,DecrypteFile,parseJSONWithLargeNumbers} from '../utils/UpDownIPFS';
const Medicalfile = (props) => {
  
  
  
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
       console.log('parseddata',parsedData);
      console.log('Encrypted File:', parsedData.encrypted_file);
      console.log('Capsule:', parsedData.capsule);
      // Decrypt the file
      const decryptedFile = await DecrypteFile(parsedData.encrypted_file,parsedData.capsule, props);
      console.log('Decrypted File:', decryptedFile);

      console.log('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  




  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const jsonData = JSON.parse(reader.result);
        console.log('JSON data:', jsonData);
        const encryptedData = await EncrypteFile(jsonData, props);
        const Enc = await JSON.stringify(encryptedData);
        const blob = new Blob([Enc], { type: 'text/plain' }); // Create Blob from string
        const result = await uploadFileToIPFS(blob);
        const ipfsHash = result.IpfsHash;
        const patientAddress = props.account;//ming patient address is passed as a parameter in the URL
        const patientDetails = await props.contractPatients.methods.getPatients(patientAddress).call();
        const pubkey = "patientDetails.PublicKey";
        const res = await props.contractPatients.methods.StorePatientFileHash(ipfsHash,pubkey).send({ from: props.account });
        console.log('res:',patientAddress);
        console.log('pubkey:', pubkey);
        console.log('ipfsHash:', ipfsHash);
        console.log('File uploaded:', result);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsText(file);

  };
  return (
    <Form>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload Medical File</Form.Label>
        <Form.Control type="file" onChange={handleFileUpload} />
      </Form.Group>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Download Medical File</Form.Label>
        <Form.Control type="button" onClick={downloadFile} value="Download" />
      </Form.Group>

    </Form>
  );

}
export default Medicalfile;
