import {HttpUtils} from "../../utils/http-utils";
import {Expense} from "./expense";

export class ExpenseEdit extends Expense {
    constructor(openNewRoute) {
        super(openNewRoute);

        const urlParams = new URLSearchParams(window.location.search);

        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateExpense.bind(this));

        this.expenseEditInputElement = document.getElementById('expenseEditInput');

        this.getExpense(id).then();
    }

    async getExpense(id) {
        const result = await HttpUtils.request('/categories/expense/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе расхода. Обратитесь в поддержку.');
        }

        this.expenseOriginalData = result.response;
        this.showExpense(result.response);
    }

    showExpense(expense) {
        this.expenseEditInputElement.value = expense.title;
    }

    async updateExpense(e) {
        e.preventDefault();

        if (this.validateForm(this.expenseEditInputElement)) {

            const changedData = {};
            if (this.expenseEditInputElement.value !== this.expenseOriginalData.title) {
                changedData.title = this.expenseEditInputElement.value;
            }

            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/categories/expense/' + this.expenseOriginalData.id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message);
                    return alert('Возникла ошибка при редактировании расхода. Обратитесь в поддержку.');
                }

                return this.openNewRoute('/expense');
            }
        }
    }
}