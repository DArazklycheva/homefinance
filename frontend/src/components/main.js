import AirDatepicker from "air-datepicker";
import {HttpUtils} from "../utils/http-utils";
import Chart from 'chart.js/auto';

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getOperations('all').then();

        new AirDatepicker('#airDatepicker', {
            buttons: ['today', 'clear'],
            dateFormat: 'yyyy-MM-dd',
        });
        new AirDatepicker('#airDatepicker2', {
            buttons: ['today', 'clear'],
            dateFormat: 'yyyy-MM-dd',
        });

        this.dateFrom = null;
        this.dateTo = null;

        this.myIncomesChart = null;
        this.myExpenseChart = null;

        this.radioBtnTodayElement = document.getElementById('radioBtnToday');
        this.radioBtnWeekElement = document.getElementById('radioBtnWeek');
        this.radioBtnMonthElement = document.getElementById('radioBtnMonth');
        this.radioBtnYearElement = document.getElementById('radioBtnYear');
        this.radioBtnAllElement = document.getElementById('radioBtnAll');
        this.radioBtnIntervalElement = document.getElementById('radioBtnInterval');

        this.getIntervals();

        this.myIncomes = document.getElementById('myIncomes').getContext('2d');
        this.myExpense = document.getElementById('myExpense').getContext('2d');

        document.getElementById('airDatepicker').addEventListener('blur', (e) => {
            this.dateFrom = e.target.value;
            this.removeAttributedDisabled();
        })

        document.getElementById('airDatepicker2').addEventListener('blur', (e) => {
            this.dateTo = e.target.value;
            this.removeAttributedDisabled();
        })
    }

    removeAttributedDisabled() {
        if (this.dateFrom && this.dateTo) {
            this.radioBtnIntervalElement.removeAttribute('disabled');
        }
    }

    getIntervals() {
        const intervals = [
            this.radioBtnTodayElement,
            this.radioBtnWeekElement,
            this.radioBtnMonthElement,
            this.radioBtnYearElement,
            this.radioBtnAllElement,
            this.radioBtnIntervalElement
        ];

        for (let i = 0; i < intervals.length; i++) {
            intervals[i].onclick = (e) => {
                this.getOperations(e.target.getAttribute('data-interval'));
            };
        }
    }

    async getOperations(interval) {
        let currentInterval = interval;

        if (currentInterval === 'interval') {
            currentInterval += `&dateFrom=${this.dateFrom}&dateTo=${this.dateTo}`;
        }

        const result = await HttpUtils.request('/operations?period=' + currentInterval);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response))) {
            return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку.');
        }

        this.showScheduleIncome(result.response);
        this.showScheduleExpense(result.response);
    }

    showScheduleIncome(operations) {
        if (this.myIncomesChart) {
            this.myIncomesChart.destroy();
        }
        const operationsIncomeAmount = [];
        const operationsIncomeLabels = [];
        operations.forEach((element) => {
            if (element.type === 'income') {
                operationsIncomeAmount.push(element.amount);
                operationsIncomeLabels.push(element.category);
            }
        });

        this.myIncomesChart = new Chart(this.myIncomes, {
            type: 'pie',
            data: {
                labels: operationsIncomeLabels,
                datasets: [{
                    label: 'My Incomes',
                    data: operationsIncomeAmount,
                }]
            },
            options: {}
        });
    }

    showScheduleExpense(operations) {
        if (this.myExpenseChart) {
            this.myExpenseChart.destroy();
        }

        const operationsExpenseAmount = [];
        const operationsExpenseLabels = [];
        operations.forEach((element) => {
            if (element.type === 'expense') {
                operationsExpenseAmount.push(element.amount);
                operationsExpenseLabels.push(element.category);
            }
        });

        this.myExpenseChart = new Chart(this.myExpense, {
            type: 'pie',
            data: {
                labels: operationsExpenseLabels,
                datasets: [{
                    label: 'My Expense',
                    data: operationsExpenseAmount,
                }]
            },
            options: {}
        });
    }



}