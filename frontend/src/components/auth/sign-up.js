export class SignUp {
    constructor() {
        this.nameElement = document.getElementById('name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.nameSvgElement = document.getElementById('name-svg');
        this.emailSvgElement = document.getElementById('email-svg');
        this.passwordSvgElement = document.getElementById('password-svg');
        this.passwordRepeatSvgElement = document.getElementById('password-repeat-svg');
        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        if (this.nameElement.value && this.nameElement.value.match(/^[А-Я][а-я]+\s*$/)) {
            this.nameElement.classList.remove('is-invalid');
            this.nameSvgElement.classList.remove('error-input');
        } else {
            this.nameElement.classList.add('is-invalid');
            this.nameSvgElement.classList.add('error-input');
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailSvgElement.classList.remove('error-input');
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailSvgElement.classList.add('error-input');
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordSvgElement.classList.remove('error-input');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordSvgElement.classList.add('error-input');
        }

        if(this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.passwordRepeatSvgElement.classList.remove('error-input');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            this.passwordRepeatSvgElement.classList.add('error-input');
        }
    }

    signUp() {
        this.validateForm();
    }
}