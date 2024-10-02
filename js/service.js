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
    await fetch(API + `/${accountId}/register-purchase`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amount
        })
    });
        
}

const payBalance = async (accountId, amount) => {
    await fetch(API + `/${accountId}/pay-balance`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amount
        })
    });
}

export default { 
    getAllAccounts,
    getAccountReport, 
    createAccount, 
    registerPurchase, 
    payBalance 
}