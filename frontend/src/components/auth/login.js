export class Login {
    constructor() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.emailSvgElement = document.getElementById('email-svg');
        this.passwordSvgElement = document.getElementById('password-svg');
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        if (this.emailElement.value && this.emailElement.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailSvgElement.classList.remove('error-input');
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailSvgElement.classList.add('error-input');
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordSvgElement.classList.remove('error-input');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordSvgElement.classList.add('error-input');
        }
    }
    login() {
        this.validateForm();
    }
}