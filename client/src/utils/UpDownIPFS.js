
import axios from 'axios';

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


const DecrypteFile = async (fileData,capsule,props) => {
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
  export { EncrypteFile, DecrypteFile, parseJSONWithLargeNumbers} ;