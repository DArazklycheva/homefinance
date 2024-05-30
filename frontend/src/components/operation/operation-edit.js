import {HttpUtils} from "../../utils/http-utils";

export class OperationEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);

        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateOperation.bind(this));

        this.operationEditInputNameElement = document.getElementById('operationEditInputName');
        this.operationEditInputCategoryElement = document.getElementById('operationEditInputCategory');
        this.operationEditInputAmountElement = document.getElementById('operationEditInputAmount');
        this.operationEditInputDateElement = document.getElementById('operationEditInputDate');
        this.operationEditInputCommentElement = document.getElementById('operationEditInputComment');

        this.getOperation(id).then();
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
        this.operationEditInputNameElement.value = operation.category;
        this.operationEditInputCategoryElement.value = operation.type;
        this.operationEditInputAmountElement.value = operation.amount;
        this.operationEditInputDateElement.value = operation.date;
        this.operationEditInputCommentElement.value = operation.comment;
    }

    validateForm() {
        let isValid = true;

        const validations = [
            this.operationEditInputNameElement,
            this.operationEditInputCategoryElement,
            this.operationEditInputAmountElement,
            this.operationEditInputDateElement,
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

            const changedData = {};
            if (this.operationEditInputNameElement.value !== this.operationOriginalData.category) {
                changedData.category = this.operationEditInputNameElement.value;
            }
            if (this.operationEditInputCategoryElement.value !== this.operationOriginalData.type) {
                changedData.type = this.operationEditInputCategoryElement.value;
            }
            if (this.operationEditInputAmountElement.value !== this.operationOriginalData.amount) {
                changedData.amount = this.operationEditInputAmountElement.value;
            }
            if (this.operationEditInputDateElement.value !== this.operationOriginalData.date) {
                changedData.date = this.operationEditInputDateElement.value;
            }
            if (this.operationEditInputCommentElement.value !== this.operationOriginalData.comment) {
                changedData.comment = this.operationEditInputCommentElement.value;
            }

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