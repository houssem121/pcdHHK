import axios from 'axios';

const uploadFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append('file', file);
  console.log('data:', data);
  const apiKey = process.env.REACT_APP_PINATA_API_KEY
  const apiSecret = process.env.REACT_APP_PINATA_API_SECRET
  const res = await axios.post(url, data, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: '27d2cad0b9171ac68461',
      pinata_secret_api_key: 'af3207aa77546ab30c1713f23e92ea68c254c228a566a8f78ac4de2affdf42d9'
    }
  });

  return res.data;
};
export default uploadFileToIPFS;