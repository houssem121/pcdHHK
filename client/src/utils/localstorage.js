
//save pub key in seesion storage
const SavePublicKey = async (publicKey) => {
    sessionStorage.setItem('publicKey', publicKey);
}
const DeletePublickey = async () => {
    sessionStorage.removeItem('publicKey');
}

export { SavePublicKey, DeletePublickey };