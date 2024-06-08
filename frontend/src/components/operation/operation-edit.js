import {HttpUtils} from "../../utils/http-utils";
import AirDatepicker from "air-datepicker";

export class OperationEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);

        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateOperation.bind(this));

        this.operationEditSelectTypeElement = document.getElementById('operationEditSelectType');
        // this.operationEditInputCategoryElement = document.getElementById('operationEditInputCategory');
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
    }

    showOperation(operation) {
        console.log(operation)
        this.operationEditSelectTypeElement.value = operation.type;

        const option = document.createElement('option');
        option.innerText = operation.category;
        option.value = operation.id;
        this.operationEditSelectCategoryElement.appendChild(option);
        // this.operationEditSelectCategoryElement.value = operation.category;

        this.operationEditInputAmountElement.value = operation.amount;
        this.airDatepickerElement.value = operation.date;
        this.operationEditInputCommentElement.value = operation.comment;
    }

    validateForm() {
        let isValid = true;

        const validations = [
            // this.operationEditInputCategoryElement,
            this.operationEditInputAmountElement,
            this.airDatepickerElement,
            this.operationEditInputCommentElement
        ];

        for (let i = 0; i < validations.length; i++) {
            if (validations[i].value) {
                validations[i].classList.remove('is-invalid');
            } else {
                validations[i].classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid;
    }

    async updateOperation(e) {
        e.preventDefault();

        if (this.validateForm()) {

            const changedData = {
                type: this.operationEditSelectTypeElement.value,
                category_id: this.operationEditSelectCategoryElement.value,
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