import {HttpUtils} from "../../utils/http-utils";

export class IncomeDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);

        this.id = urlParams.get('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.getIncomes().then();

        document.getElementById('deleteButton').addEventListener('click', this.deleteIncome.bind(this));
    }

    async getIncomes() {
        const result = await HttpUtils.request('/categories/income');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе доходов. Обратитесь в поддержку.');
        }

        this.showIncomes(result.response);
    }

    showIncomes(incomes) {
        const recordsElement = document.getElementById('incomes');
        for (let i = 0; i < incomes.length; i++) {
            const divCardElement = document.createElement('div');
            divCardElement.className = 'card me-3 mt-3';
            divCardElement.style.width = '348px';

            const divCardBodyElement = document.createElement('div');
            divCardBodyElement.className = 'card-body';
            divCardElement.appendChild(divCardBodyElement);

            const h5Element = document.createElement('h5');
            h5Element.className = 'card-title';
            h5Element.innerText = incomes[i].title;
            divCardBodyElement.appendChild(h5Element);

            const editButtonElement = document.createElement('a');
            editButtonElement.className = 'btn btn-primary me-2';
            editButtonElement.innerText = 'Редактировать';
            editButtonElement.setAttribute('href', '/income/edit?id=' + incomes[i].id);
            divCardBodyElement.appendChild(editButtonElement);

            const deleteButtonElement = document.createElement('a');
            deleteButtonElement.className = 'btn btn-danger';
            deleteButtonElement.innerText = 'Удалить';
            deleteButtonElement.setAttribute('href', '/income/delete?id=' + incomes[i].id);
            divCardBodyElement.appendChild(deleteButtonElement);

            recordsElement.appendChild(divCardElement);
        }

        const divCardElement = document.createElement('div');
        divCardElement.className = 'card me-3 mt-3';
        divCardElement.style.width = '348px';
        divCardElement.style.height = '102px';
        divCardElement.innerHTML = '<a href="/income/create" class="card-body d-flex align-items-center justify-content-center">\n' +
                        '                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                        '                    <path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z"\n' +
                        '                          fill="#CED4DA"/>\n' +
                        '                </svg>\n' +
                        '            </a>';

        recordsElement.appendChild(divCardElement);
    }

    async deleteIncome() {
        const result = await HttpUtils.request('/categories/income/' + this.id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при удалении дохода. Обратитесь в поддержку.');
        }

        return this.openNewRoute('/income');
    }
}