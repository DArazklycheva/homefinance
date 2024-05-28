import {HttpUtils} from "../../utils/http-utils";

export class IncomeCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('createButton').addEventListener('click', this.createIncome.bind(this));

        this.incomeCreateInputElement = document.getElementById('incomeCreateInput');
    }

    validateForm() {
        let isValid = true;

        if (this.incomeCreateInputElement.value) {
            this.incomeCreateInputElement.classList.remove('is-invalid');
        } else {
            this.incomeCreateInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async createIncome(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const result = await HttpUtils.request('/categories/income', 'POST', true, {
                title: this.incomeCreateInputElement.value,
            });
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка при добавлении дохода. Обратитесь в поддержку.');
            }

            return this.openNewRoute('/income');
        }

    }

}