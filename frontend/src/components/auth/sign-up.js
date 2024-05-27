import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.userTokenKey)) {
            return this.openNewRoute('/');
        }

        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.nameSvgElement = document.getElementById('name-svg');
        this.lastNameSvgElement = document.getElementById('last-name-svg');
        this.emailSvgElement = document.getElementById('email-svg');
        this.passwordSvgElement = document.getElementById('password-svg');
        this.passwordRepeatSvgElement = document.getElementById('password-repeat-svg');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.nameElement.value && this.nameElement.value.match(/^[А-Я][а-я]+\s*$/)) {
            this.nameElement.classList.remove('is-invalid');
            this.nameSvgElement.classList.remove('error-input');
        } else {
            this.nameElement.classList.add('is-invalid');
            this.nameSvgElement.classList.add('error-input');
            isValid = false;
        }

        if (this.lastNameElement.value && this.lastNameElement.value.match(/^[А-Я][а-я]+\s*$/)) {
            this.lastNameElement.classList.remove('is-invalid');
            this.lastNameSvgElement.classList.remove('error-input');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            this.lastNameSvgElement.classList.add('error-input');
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailSvgElement.classList.remove('error-input');
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailSvgElement.classList.add('error-input');
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordSvgElement.classList.remove('error-input');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordSvgElement.classList.add('error-input');
            isValid = false;
        }

        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.passwordRepeatSvgElement.classList.remove('error-input');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            this.passwordRepeatSvgElement.classList.add('error-input');
            isValid = false;
        }

        return isValid;
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';

        if (this.validateForm()) {
            const result = await HttpUtils.request('/signup', 'POST', {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            });

            if (result.error || !result.response || (result.response && (!result.response.user))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(null, null, result.response.user);

            this.openNewRoute('/');
        }
    }
}