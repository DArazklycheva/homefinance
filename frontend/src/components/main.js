import AirDatepicker from "air-datepicker";
import {HttpUtils} from "../utils/http-utils";
import Chart from 'chart.js/auto';

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getOperations('all').then();

        new AirDatepicker('#airDatepicker', {
            buttons: ['today', 'clear']
        });
        new AirDatepicker('#airDatepicker2', {
            buttons: ['today', 'clear']
        });

        this.radioBtnTodayElement = document.getElementById('radioBtnToday');
        this.radioBtnWeekElement = document.getElementById('radioBtnWeek');
        this.radioBtnMonthElement = document.getElementById('radioBtnMonth');
        this.radioBtnYearElement = document.getElementById('radioBtnYear');
        this.radioBtnAllElement = document.getElementById('radioBtnAll');
        this.radioBtnIntervalElement = document.getElementById('radioBtnInterval');

        this.getIntervals();

        this.myIncomes = document.getElementById('myIncomes').getContext('2d');
        this.myExpense = document.getElementById('myExpense').getContext('2d');
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
        const result = await HttpUtils.request('/operations?period=' + interval);
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
        const operationsIncomeAmount = [];
        operations.forEach((element) => {
            if (element.type === 'income') {
                operationsIncomeAmount.push(element.amount);
            }
        });

        let myIncomesChart = new Chart(this.myIncomes, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    label: 'My Incomes',
                    data: operationsIncomeAmount,
                    // backgroundColor: ['Red', 'Orange', 'Yellow', 'Green', 'Blue']
                }]
            },
            options: {}
        });
    }

    showScheduleExpense(operations) {
        const operationsExpenseAmount = [];
        operations.forEach((element) => {
            if (element.type === 'expense') {
                operationsExpenseAmount.push(element.amount);
            }
        });

        let myIncomesChart = new Chart(this.myExpense, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    label: 'My Incomes',
                    data: operationsExpenseAmount,
                    // backgroundColor: ['Red', 'Orange', 'Yellow', 'Green', 'Blue']
                }]
            },
            options: {}
        });
    }



}