import {HttpUtils} from "../../utils/http-utils";
import AirDatepicker from "air-datepicker";
import {Operation} from "./operation";

export class OperationEdit extends Operation {
    constructor(openNewRoute) {
        super(openNewRoute);

        const urlParams = new URLSearchParams(window.location.search);

        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateOperation.bind(this));

        this.operationEditSelectTypeElement = document.getElementById('operationEditSelectType');
        this.operationEditSelectCategoryElement = document.getElementById('operationEditSelectCategory');
        this.operationEditInputAmountElement = document.getElementById('operationEditInputAmount');
        this.airDatepickerElement = document.getElementById('airDatepicker');
        this.operationEditInputCommentElement = document.getElementById('operationEditInputComment');

        this.getOperation(id).then();

        new AirDatepicker('#airDatepicker', {
            buttons: ['today', 'clear'],
            dateFormat: 'yyyy-MM-dd',
        });

    }

    async getOperation(id) {
        const result = await HttpUtils.request('/operations/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку.');
        }

        this.operationOriginalData = result.response;
        this.showOperation(result.response);
        this.getCategories(result.response.type, this.operationEditSelectCategoryElement, result.response.category).then();
    }

    showOperation(operation) {
        this.operationEditSelectTypeElement.value = operation.type;

        const option = document.createElement('option');
        option.innerText = operation.category;
        option.value = operation.id;

        this.operationEditInputAmountElement.value = operation.amount;
        this.airDatepickerElement.value = operation.date;
        this.operationEditInputCommentElement.value = operation.comment;
    }

    async updateOperation(e) {
        e.preventDefault();

        if (this.validateForm([
            this.operationEditInputAmountElement,
            this.airDatepickerElement,
            this.operationEditInputCommentElement
        ])) {

            const changedData = {
                type: this.operationEditSelectTypeElement.value,
                category_id: Number(this.operationEditSelectCategoryElement.value),
                amount: parseInt(this.operationEditInputAmountElement.value),
                date: this.airDatepickerElement.value,
                comment: this.operationEditInputCommentElement.value,
            };

            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/operations/' + this.operationOriginalData.id, 'PUT', true, changedData);

                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message);
                    return alert('Возникла ошибка при редактировании операции. Обратитесь в поддержку.');
                }

                return this.openNewRoute('/operation');
            }
        }
    }
}