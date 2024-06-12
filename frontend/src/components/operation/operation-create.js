import {HttpUtils} from "../../utils/http-utils";
import AirDatepicker from "air-datepicker";
import {Operation} from "./operation";

export class OperationCreate extends Operation {
    constructor(openNewRoute) {
        super(openNewRoute);
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
        this.getCategories(this.type, this.operationCreateSelectCategoryElement).then();
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
    async createOperation(e) {
        e.preventDefault();

        if (this.validateForm([
            this.operationCreateInputAmountElement,
            this.airDatepickerElement,
            this.operationCreateInputCommentElement
        ])) {
            const result = await HttpUtils.request('/operations', 'POST', true, {
                type: this.operationCreateSelectTypeElement.value,
                amount: parseInt(this.operationCreateInputAmountElement.value),
                date: this.airDatepickerElement.value,
                comment: this.operationCreateInputCommentElement.value,
                category_id: Number(this.operationCreateSelectCategoryElement.value)
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