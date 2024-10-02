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

        const detailsContainer = document.getElementById('account-details');
        detailsContainer.innerHTML = `
            <h2>${account.owner.name}</h2>
            <p><strong>Saldo Total:</strong> R$ ${account.totalBalance}</p>
            <h3>Compras Recentes:</h3>
            <ul id="purchases-list">
                ${account.purchases.map(purchase => `
                    <li>
                        Valor: R$ ${purchase.amount} - Data: ${new Date(purchase.purchasedIn).toLocaleDateString()}
                    </li>
                `).join('')}
            </ul>
        `;
    } catch (error) {
        console.error('Erro ao buscar os detalhes da conta:', error);
        document.getElementById('account-details').textContent = 'Erro ao carregar os detalhes da conta';
    }
}

// Função para chamar a API PATCH para pagar saldo ou registrar compra
async function patchAccountOperation(accountId, amount, operation) {
    const url = `https://api.exemplo.com/contas/${accountId}/${operation}`;
    
    const data = {
        amount: amount
    };

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(`${operation === 'pagar' ? 'Saldo pago' : 'Compra registrada'} com sucesso!`);
            window.location.reload();  // Atualiza a página para refletir as mudanças
        } else {
            alert('Erro ao realizar a operação.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao realizar a operação.');
    }
}

// Função para abrir e fechar modais
function setupModal(modalId, closeModalId, confirmBtnId, operation) {
    const modal = document.getElementById(modalId);
    const closeModal = document.getElementById(closeModalId);
    const confirmBtn = document.getElementById(confirmBtnId);

    console.log(operation);
    console.log(document.getElementById(`${operation}-btn`));

    // Abre o modal
    document.getElementById(`${operation}-btn`).onclick = () => {
        modal.style.display = 'block';
    };

    // Fecha o modal
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Confirma a operação
    confirmBtn.onclick = () => {
        const accountId = getQueryParameter('id');
        const amount = document.getElementById(`${operation}-amount`).value;
        patchAccountOperation(accountId, parseFloat(amount), operation);
        modal.style.display = 'none';
    };

    // Fecha o modal se clicar fora do conteúdo
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Carregar detalhes da conta ao abrir a página
window.onload = () => {
    fetchAccountDetails();

    // Configurar modais
    setupModal('pay-modal', 'close-pay-modal', 'confirm-pay-btn', 'pay-balance');
    setupModal('purchase-modal', 'close-purchase-modal', 'confirm-purchase-btn', 'register-purchase');
};