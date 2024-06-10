import {HttpUtils} from "../../utils/http-utils";
import {Income} from "./income";

export class IncomeCreate extends Income {
    constructor(openNewRoute) {
        super(openNewRoute);
        document.getElementById('createButton').addEventListener('click', this.createIncome.bind(this));

        this.incomeCreateInputElement = document.getElementById('incomeCreateInput');
    }

    async createIncome(e) {
        e.preventDefault();

        if (this.validateForm(this.incomeCreateInputElement)) {
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