import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (localStorage.getItem(AuthUtils.userTokenKey)) {
            return this.openNewRoute('/');
        }

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.emailSvgElement = document.getElementById('email-svg');
        this.passwordSvgElement = document.getElementById('password-svg');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.emailElement.value && this.emailElement.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailSvgElement.classList.remove('error-input');
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailSvgElement.classList.add('error-input');
            isValid = false;
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordSvgElement.classList.remove('error-input');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordSvgElement.classList.add('error-input');
            isValid = false;
        }

        return isValid;
    }

    async login() {
        this.commonErrorElement.style.display = 'none';

        if (this.validateForm()) {

            const result = await HttpUtils.request('/login', 'POST', {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            });

            if (result.error || !result.response || (result.response && (!result.response.tokens || !result.response.user))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            localStorage.setItem(AuthUtils.tokensKey, JSON.stringify(result.response.tokens));
            localStorage.setItem(AuthUtils.userTokenKey, JSON.stringify(result.response.user));

            this.openNewRoute('/');
        }
    }
}