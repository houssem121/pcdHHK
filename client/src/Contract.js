import Authentication from "./contracts/Authentication.json";
import Patients from "./contracts/Patients.json";
const Contract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Authentication.networks[networkId];

    return new web3.eth.Contract(
        Authentication.abi,
        deployedNetwork && deployedNetwork.address
    );
}


const ContractPatient = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Patients.networks[networkId];

    return new web3.eth.Contract(
        Patients.abi,
        deployedNetwork && deployedNetwork.address
    );
}


export { Contract, ContractPatient }; // Export both functions

