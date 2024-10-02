import apiService from './service.js';

async function fetchAccounts() {
    try {
        const accounts = await apiService.getAllAccounts();
        const accountList = document.getElementById('account-list');

        accountList.innerHTML = '';

        accounts.forEach(account => {
            const listItem = document.createElement('li');
            const accountLink = document.createElement('a');
            accountLink.href = `./pages/relatorio.html?id=${account.id}`;
            accountLink.textContent = `${account.owner.name}  R$ ${account.totalBalance}`;
            listItem.appendChild(accountLink);
            accountList.appendChild(listItem);
        });
    } catch (error) {
        console.error('erro ao buscar as contas:', error);
    }
}

document.getElementById('home-link').addEventListener('click', (event) => {
    event.preventDefault();
    fetchAccounts();
});

window.onload = fetchAccounts;

const toggleButton = document.querySelector('.toggle');
const menu = document.querySelector('.menu');

toggleButton.addEventListener('click', () => {
    menu.classList.toggle('active');
});