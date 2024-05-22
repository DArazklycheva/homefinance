export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

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
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                })
            });

            const result = await response.json();

            if (result.error || !result.tokens || !result.user) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            localStorage.setItem('tokens', JSON.stringify(result.tokens));
            localStorage.setItem('user', JSON.stringify(result.user));

            this.openNewRoute('/');
        }
    }
}