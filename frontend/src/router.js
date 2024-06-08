import {Main} from "./components/main";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";
import {IncomeList} from "./components/income/income-list";
import {IncomeDelete} from "./components/income/income-delete";
import {IncomeCreate} from "./components/income/income-create";
import {IncomeEdit} from "./components/income/income-edit";
import {ExpenseList} from "./components/expense/expense-list";
import {ExpenseDelete} from "./components/expense/expense-delete";
import {ExpenseCreate} from "./components/expense/expense-create";
import {ExpenseEdit} from "./components/expense/expense-edit";
import {OperationList} from "./components/operation/operation-list";
import {OperationDelete} from "./components/operation/operation-delete";
import {OperationCreate} from "./components/operation/operation-create";
import {OperationEdit} from "./components/operation/operation-edit";
import {AuthUtils} from "./utils/auth-utils";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.userFullName = null;

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main(this.openNewRoute.bind(this));
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
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/delete',
                title: 'Удалить доход',
                filePathTemplate: '/templates/pages/income/delete.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/create',
                title: 'Создать доход',
                filePathTemplate: '/templates/pages/income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/edit',
                title: 'Редактировать доход',
                filePathTemplate: '/templates/pages/income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expense/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/delete',
                title: 'Удалить расход',
                filePathTemplate: '/templates/pages/expense/delete.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/create',
                title: 'Создать расход',
                filePathTemplate: '/templates/pages/expense/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/edit',
                title: 'Редактировать расход',
                filePathTemplate: '/templates/pages/expense/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operation',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operation/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operation/delete',
                title: 'Удалить доходы и расходы',
                filePathTemplate: '/templates/pages/operation/delete.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operation/create',
                title: 'Создать доходы и расходы',
                filePathTemplate: '/templates/pages/operation/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operation/edit',
                title: 'Редактировать доходы и расходы',
                filePathTemplate: '/templates/pages/operation/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationEdit(this.openNewRoute.bind(this));
                }
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const url = element.href.replace(window.location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            // console.log(currentRoute);
        }

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

                    this.profileNameElement = document.getElementById('profile-name');
                    if (!this.userFullName) {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userTokenKey);
                        if (userInfo) {
                            userInfo = JSON.parse(userInfo);
                            if (userInfo.name && userInfo.lastName) {
                                this.userFullName = userInfo.name + ' ' + userInfo.lastName;
                            }
                        }
                    }
                    this.profileNameElement.innerText = this.userFullName;

                    this.activateMenuItem(newRoute);
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute(null);
        }
    }

    activateMenuItem(route) {
        document.querySelectorAll('.nav .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        document.querySelectorAll('.dropdown-item').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}