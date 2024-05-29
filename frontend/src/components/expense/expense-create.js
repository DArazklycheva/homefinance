import {HttpUtils} from "../../utils/http-utils";

export class ExpenseCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('createButton').addEventListener('click', this.createExpense.bind(this));

        this.expenseCreateInputElement = document.getElementById('expenseCreateInput');
    }

    validateForm() {
        let isValid = true;

        if (this.expenseCreateInputElement.value) {
            this.expenseCreateInputElement.classList.remove('is-invalid');
        } else {
            this.expenseCreateInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async createExpense(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const result = await HttpUtils.request('/categories/expense', 'POST', true, {
                title: this.expenseCreateInputElement.value,
            });
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка при добавлении расхода. Обратитесь в поддержку.');
            }

            return this.openNewRoute('/expense');
        }

    }

}