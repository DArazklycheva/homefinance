import {HttpUtils} from "../../utils/http-utils";
import {Expense} from "./expense";

export class ExpenseCreate extends Expense {
    constructor(openNewRoute) {
        super(openNewRoute);
        document.getElementById('createButton').addEventListener('click', this.createExpense.bind(this));

        this.expenseCreateInputElement = document.getElementById('expenseCreateInput');
    }

    async createExpense(e) {
        e.preventDefault();

        if (this.validateForm(this.expenseCreateInputElement)) {
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