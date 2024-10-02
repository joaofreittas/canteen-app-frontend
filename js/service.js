const API = 'https://coherent-faith-picpay-54f767ac.koyeb.app/v1/account';

const getAllAccounts = async () => {
    const response = await fetch(API);
    return await response.json();
}

const getAccountReport = async (accountId) => {
    const response = await fetch(API + `/${accountId}`);
    return await response.json();
}

const createAccount = async (name, amount = 0) => {
    
}

const registerPurchase = async (accountId, amount) => {
        
}

const payBalance = async (accountId, amount) => {
    
}

export default { 
    getAllAccounts,
    getAccountReport, 
    createAccount, 
    registerPurchase, 
    payBalance 
}