import {HttpUtils} from "../../utils/http-utils";
import {Expense} from "./expense";

export class ExpenseDelete extends Expense {
    constructor(openNewRoute) {
        super(openNewRoute);

        const urlParams = new URLSearchParams(window.location.search);

        this.id = urlParams.get('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.getExpenses().then();

        document.getElementById('deleteButton').addEventListener('click', this.deleteExpense.bind(this));
    }

    async deleteExpense() {
        const result = await HttpUtils.request('/categories/expense/' + this.id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при удалении расхода. Обратитесь в поддержку.');
        }

        return this.openNewRoute('/expense');
    }
}