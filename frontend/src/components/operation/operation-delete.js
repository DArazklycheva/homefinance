import {HttpUtils} from "../../utils/http-utils";
import {Operation} from "./operation";

export class OperationDelete extends Operation {
    constructor(openNewRoute) {
        super(openNewRoute);

        const urlParams = new URLSearchParams(window.location.search);

        this.id = urlParams.get('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.getOperations('today').then();

        this.radioBtnTodayElement = document.getElementById('radioBtnToday');
        this.radioBtnWeekElement = document.getElementById('radioBtnWeek');
        this.radioBtnMonthElement = document.getElementById('radioBtnMonth');
        this.radioBtnYearElement = document.getElementById('radioBtnYear');
        this.radioBtnAllElement = document.getElementById('radioBtnAll');
        this.radioBtnIntervalElement = document.getElementById('radioBtnInterval');

        this.getIntervals([
            this.radioBtnTodayElement,
            this.radioBtnWeekElement,
            this.radioBtnMonthElement,
            this.radioBtnYearElement,
            this.radioBtnAllElement,
            this.radioBtnIntervalElement
        ]);

        document.getElementById('deleteButton').addEventListener('click', this.deleteOperation.bind(this));
    }

    async deleteOperation() {
        const result = await HttpUtils.request('/operations/' + this.id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при удалении операции. Обратитесь в поддержку.');
        }

        return this.openNewRoute('/operation');
    }
}