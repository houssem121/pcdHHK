import uploadFileToIPFS from '../utils/ipfsconnections';
import axios from 'axios';
const handleFileUpdate = async (patientsfile, props) => {
  const file = patientsfile;
  //no need to read the file just a normal json data is passed
  try {
    const jsonData = patientsfile;
    console.log('JSON data:', jsonData);
    const encryptedData = await EncrypteFile(jsonData, props);
    const Enc = await JSON.stringify(encryptedData);
    const blob = new Blob([Enc], { type: 'text/plain' }); // Create Blob from string
    const result = await uploadFileToIPFS(blob);
    const ipfsHash = result.IpfsHash;
    const patientAddress = props.account;//ming patient address is passed as a parameter in the URL
    const patientDetails = await props.contractPatients.methods.getPatients(patientAddress).call();
    const pubkey = "patientDetails.PublicKey";
    const res = await props.contractPatients.methods.StorePatientFileHash(ipfsHash, pubkey).send({ from: props.account });
    console.log('res:', patientAddress);
    console.log('pubkey:', pubkey);
    console.log('ipfsHash:', ipfsHash);
    console.log('File uploaded:', result);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
};
const handleFileUpload = async (event, props) => {
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
      const res = await props.contractPatients.methods.StorePatientFileHash(ipfsHash, pubkey).send({ from: props.account });
      console.log('res:', patientAddress);
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
const EncrypteFile = async (fileData, props) => {
  try {
    const requestData = {
      blockchain_address: props.account, // Replace 'add' with the actual blockchain address
      file_to_be_encrypted: fileData
    };
    console.log('address:', props.account);

    const response = await axios.post('http://localhost:8083/uploadfile', requestData, {
      // Prevent automatic conversion of response data
      transformResponse: [data => data]
    });

    const encryptedData = response.data;
    const capsule = response.data.capsule;
    //make it a string
    console.log('Encrypted data:', encryptedData);
    JSON.stringify(encryptedData);
    console.log('Encrypted data:', encryptedData);

    console.log('Capsule:', capsule);
    return encryptedData;

  } catch (error) {
    console.error('Error encrypting file:', error);
    throw error;
  }
};


const DecrypteFile = async (fileData, capsule, props) => {
  try {
    const requestData = {
      blockchain_address: props.account, // Replace 'add' with the actual blockchain address
      encrypted_file: fileData,
      capsule: capsule
    };
    console.log('request data:', requestData);
    const response = await axios.post('http://localhost:8083/downloadfile', requestData);

    const decryptedData = response.data;
    console.log('Decrypted data:', decryptedData);

    return decryptedData;

  } catch (error) {
    console.error('Error decrypting file:', error);
    throw error;
  }
}
function parseJSONWithLargeNumbers(jsonString) {
  // Regular expression to match scientific notation numbers
  const scientificNotationRegex = /(?<=\":)(-?\d+(\.\d*)?([eE][+\-]?\d+)?)(?=\s*[,\}\]])/g;

  // Replace scientific notation numbers with their string representation
  const fixedJSONString = jsonString.replace(scientificNotationRegex, (match) => `"${match}"`);

  // Parse the JSON string
  return JSON.parse(fixedJSONString);
}
export { EncrypteFile, DecrypteFile, parseJSONWithLargeNumbers, handleFileUpload, handleFileUpdate };