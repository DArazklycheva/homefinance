import {HttpUtils} from "../../utils/http-utils";
import {Income} from "./income";

export class IncomeEdit extends Income{
    constructor(openNewRoute) {
        super(openNewRoute);

        const urlParams = new URLSearchParams(window.location.search);

        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateIncome.bind(this));

        this.incomeEditInputElement = document.getElementById('incomeEditInput');

        this.getIncome(id).then();
    }

    async getIncome(id) {
        const result = await HttpUtils.request('/categories/income/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе дохода. Обратитесь в поддержку.');
        }

        this.incomeOriginalData = result.response;
        this.showIncome(result.response);
    }

    showIncome(income) {
        this.incomeEditInputElement.value = income.title;
    }

    async updateIncome(e) {
        e.preventDefault();

        if (this.validateForm(this.incomeEditInputElement)) {

            const changedData = {};
            if (this.incomeEditInputElement.value !== this.incomeOriginalData.title) {
                changedData.title = this.incomeEditInputElement.value;
            }

            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/categories/income/' + this.incomeOriginalData.id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message);
                    return alert('Возникла ошибка при редактировании дохода. Обратитесь в поддержку.');
                }

                return this.openNewRoute('/income');
            }
        }
    }
}