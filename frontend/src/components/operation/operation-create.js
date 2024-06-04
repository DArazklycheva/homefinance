import {HttpUtils} from "../../utils/http-utils";
import AirDatepicker from "air-datepicker";

export class OperationCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('createButton').addEventListener('click', this.createOperation.bind(this));

        this.operationCreateSelectTypeElement = document.getElementById('operationCreateSelectType');
        this.operationCreateSelectCategoryElement = document.getElementById('operationCreateSelectCategory');
        this.operationCreateInputAmountElement = document.getElementById('operationCreateInputAmount');
        this.airDatepickerElement = document.getElementById('airDatepicker');
        this.operationCreateInputCommentElement = document.getElementById('operationCreateInputComment');

        new AirDatepicker('#airDatepicker', {
            buttons: ['today', 'clear'],
            dateFormat: 'yyyy-MM-dd',
        });

        const urlParams = new URLSearchParams(window.location.search);

        this.type = urlParams.get('type');
        if (!this.type) {
            return this.openNewRoute('/');
        }

        this.getTypes();
        this.getCategories().then();
    }

    getTypes() {
        if (this.type === 'expense') {
            const option = document.createElement('option');
            option.innerText = 'expense';
            this.operationCreateSelectTypeElement.appendChild(option);
        } else {
            const option = document.createElement('option');
            option.innerText = 'income';
            this.operationCreateSelectTypeElement.appendChild(option);
        }
    }
    async getCategories() {
        let result = null;
        if (this.operationCreateSelectTypeElement.value === 'expense') {
            result = await HttpUtils.request('/categories/expense');
        } else if (this.operationCreateSelectTypeElement.value === 'income') {
            result = await HttpUtils.request('/categories/income');
        }

        if (result) {
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
                return alert('Возникла ошибка при запросе доходов / расходов. Обратитесь в поддержку.');
            }

            const categories = result.response;
            for (let i = 0; i < categories.length; i++) {
                const option = document.createElement('option');
                option.value = categories[i].id;
                option.innerText = categories[i].title;
                this.operationCreateSelectCategoryElement.appendChild(option);
            }
        }
    }

    validateForm() {
        let isValid = true;

        const validations = [
            this.operationCreateInputAmountElement,
            this.airDatepickerElement,
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
                type: this.operationCreateSelectTypeElement.value,
                amount: parseInt(this.operationCreateInputAmountElement.value),
                date: this.airDatepickerElement.value,
                comment: this.operationCreateInputCommentElement.value,
                category_id: this.operationCreateSelectCategoryElement.value
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