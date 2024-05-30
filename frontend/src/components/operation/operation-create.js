import {HttpUtils} from "../../utils/http-utils";

export class OperationCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('createButton').addEventListener('click', this.createOperation.bind(this));

        this.operationCreateInputNameElement = document.getElementById('operationCreateInputName');
        this.operationCreateInputCategoryElement = document.getElementById('operationCreateInputCategory');
        this.operationCreateInputAmountElement = document.getElementById('operationCreateInputAmount');
        this.operationCreateInputDateElement = document.getElementById('operationCreateInputDate');
        this.operationCreateInputCommentElement = document.getElementById('operationCreateInputComment');
    }

    validateForm() {
        let isValid = true;

        const validations = [
            this.operationCreateInputNameElement,
            this.operationCreateInputCategoryElement,
            this.operationCreateInputAmountElement,
            this.operationCreateInputDateElement,
            this.operationCreateInputCommentElement
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

    async createOperation(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const result = await HttpUtils.request('/operations', 'POST', true, {
                type: this.operationCreateInputCategoryElement.value,
                amount: this.operationCreateInputAmountElement.value,
                date: this.operationCreateInputDateElement.value,
                comment: this.operationCreateInputCommentElement.value,
            });
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка при добавлении операции. Обратитесь в поддержку.');
            }

            return this.openNewRoute('/operation');
        }

    }

}