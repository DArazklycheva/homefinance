import {Main} from "./components/main";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {IncomeView} from "./components/income/income-view";
import {IncomeDelete} from "./components/income/income-delete";
import {IncomeCreate} from "./components/income/income-create";
import {IncomeEdit} from "./components/income/income-edit";
import {ExpensesView} from "./components/expenses/expenses-view";
import {ExpensesDelete} from "./components/expenses/expenses-delete";
import {ExpensesCreate} from "./components/expenses/expenses-create";
import {ExpensesEdit} from "./components/expenses/expenses-edit";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login();
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp();
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeView();
                }
            },
            {
                route: '/income/delete',
                title: 'Удалить доход',
                filePathTemplate: '/templates/pages/income/delete.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeDelete();
                }
            },
            {
                route: '/income/create',
                title: 'Создать доход',
                filePathTemplate: '/templates/pages/income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate();
                }
            },
            {
                route: '/income/edit',
                title: 'Редактировать доход',
                filePathTemplate: '/templates/pages/income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit();
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesView();
                }
            },
            {
                route: '/expenses/delete',
                title: 'Удалить расход',
                filePathTemplate: '/templates/pages/expenses/delete.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesDelete();
                }
            },
            {
                route: '/expenses/create',
                title: 'Создать расход',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesCreate();
                }
            },
            {
                route: '/expenses/edit',
                title: 'Редактировать расход',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesEdit();
                }
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            window.location = '/404';
        }
    }

}