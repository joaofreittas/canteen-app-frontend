import apiService from './service.js';

function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function fetchAccountDetails() {
    const accountId = getQueryParameter('id');
    if (!accountId) {
        document.getElementById('account-details').textContent = 'Conta não encontrada';
        return;
    }

    try {
        const account = await apiService.getAccountReport(accountId);
        const purchases = account.purchases;
        purchases.map(purchase => {
            purchase.purchasedIn = formatDateToBrazilian(purchase.purchasedIn);
        });

        const detailsContainer = document.getElementById('account-details');
        detailsContainer.innerHTML = `
            <h2>${account.owner.name}</h2>
            <p><strong>Saldo Total:</strong> R$ ${account.totalBalance}</p>
            <h3>Compras Recentes:</h3>
            <ul id="purchases-list">
                ${account.purchases.map(purchase => `
                    <li>
                        Valor: R$ ${purchase.amount} - Data: ${purchase.purchasedIn}
                    </li>
                `).join('')}
            </ul>
        `;
    } catch (error) {
        console.error('Erro ao buscar os detalhes da conta:', error);
        document.getElementById('account-details').textContent = 'Erro ao carregar os detalhes da conta';
    }
}

async function payBalance(accountId, amount, operation) {
    try {
        await apiService.payBalance(accountId, amount);
        alert('Saldo pago com sucesso!');
        window.location.reload();
    } catch (error) {
        console.error('erro ao pagar saldo:', error);
        alert('Erro ao realizar a operação.');
    }
}

async function registerPurchase(accountId, amount, operation) {
    try {
        await apiService.registerPurchase(accountId, amount);
        alert('Compra registrada com sucesso!');
        window.location.reload();
    } catch (error) {
        console.error('erro ao registrar compra:', error);
        alert('Erro ao realizar a operação.');
    }
}

function setupPayBalanceModal(modalId, closeModalId, confirmBtnId, operation) {
    const modal = document.getElementById(modalId);
    const closeModal = document.getElementById(closeModalId);
    const confirmBtn = document.getElementById(confirmBtnId);

    document.getElementById(`${operation}-btn`).onclick = () => {
        modal.style.display = 'block';
    };

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    confirmBtn.onclick = () => {
        const accountId = getQueryParameter('id');
        const amount = document.getElementById(`${operation}-amount`).value;
        payBalance(accountId, parseFloat(amount), operation);
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function setupRegisterPurchaseModal(modalId, closeModalId, confirmBtnId, operation) {
    const modal = document.getElementById(modalId);
    const closeModal = document.getElementById(closeModalId);
    const confirmBtn = document.getElementById(confirmBtnId);

    document.getElementById(`${operation}-btn`).onclick = () => {
        modal.style.display = 'block';
    };

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    confirmBtn.onclick = () => {
        const accountId = getQueryParameter('id');
        const amount = document.getElementById(`${operation}-amount`).value;
        registerPurchase(accountId, parseFloat(amount), operation);
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function formatDateToBrazilian(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

window.onload = () => {
    fetchAccountDetails();

    setupPayBalanceModal('pay-modal', 'close-pay-modal', 'confirm-pay-btn', 'pay-balance');
    setupRegisterPurchaseModal('purchase-modal', 'close-purchase-modal', 'confirm-purchase-btn', 'register-purchase');
};