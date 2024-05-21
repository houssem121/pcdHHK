import Authentication from "./contracts/Authentication.json";
import Patients from "./contracts/Patients.json";
import DoctorContract from "./contracts/DoctorContract.json";
import Pharmacist from "./contracts/Pharmacist.json";
import Assurance from "./contracts/AgentAssurance.json";
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
const ContractDoctor = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = DoctorContract.networks[networkId];

    return new web3.eth.Contract(
        DoctorContract.abi,
        deployedNetwork && deployedNetwork.address
    );
}
const ContractPharmacist = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Pharmacist.networks[networkId];

    return new web3.eth.Contract(
        Pharmacist.abi,
        deployedNetwork && deployedNetwork.address
    );
}
const ContractAssurance = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Assurance.networks[networkId];

    return new web3.eth.Contract(
        Assurance.abi,
        deployedNetwork && deployedNetwork.address
    );
}





export { Contract, ContractPatient, ContractDoctor, ContractPharmacist, ContractAssurance };

