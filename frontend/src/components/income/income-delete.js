import {HttpUtils} from "../../utils/http-utils";
import {Income} from "./income";

export class IncomeDelete extends Income {
    constructor(openNewRoute) {
        super(openNewRoute);

        const urlParams = new URLSearchParams(window.location.search);

        this.id = urlParams.get('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.getIncomes().then();

        document.getElementById('deleteButton').addEventListener('click', this.deleteIncome.bind(this));
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