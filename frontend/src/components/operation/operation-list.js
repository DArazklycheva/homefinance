import AirDatepicker from "air-datepicker";
import {Operation} from "./operation";

export class OperationList extends Operation{
    constructor(openNewRoute, dateFrom, dateTo) {
        super(openNewRoute, dateFrom, dateTo);
        this.getOperations('today').then();

        new AirDatepicker('#airDatepicker', {
            buttons: ['today', 'clear'],
            dateFormat: 'yyyy-MM-dd',
        });
        new AirDatepicker('#airDatepicker2', {
            buttons: ['today', 'clear'],
            dateFormat: 'yyyy-MM-dd',
        });

        this.radioBtnTodayElement = document.getElementById('radioBtnToday');
        this.radioBtnWeekElement = document.getElementById('radioBtnWeek');
        this.radioBtnMonthElement = document.getElementById('radioBtnMonth');
        this.radioBtnYearElement = document.getElementById('radioBtnYear');
        this.radioBtnAllElement = document.getElementById('radioBtnAll');
        this.radioBtnIntervalElement = document.getElementById('radioBtnInterval');

        document.getElementById('airDatepicker').addEventListener('blur', (e) => {
            this.dateFrom = e.target.value;
            this.removeAttributedDisabled();
        })

        document.getElementById('airDatepicker2').addEventListener('blur', (e) => {
            this.dateTo = e.target.value;
            this.removeAttributedDisabled();
        })

        this.getIntervals([
            this.radioBtnTodayElement,
            this.radioBtnWeekElement,
            this.radioBtnMonthElement,
            this.radioBtnYearElement,
            this.radioBtnAllElement,
            this.radioBtnIntervalElement
        ]);
    }

    removeAttributedDisabled() {
        if (this.dateFrom && this.dateTo) {
            this.radioBtnIntervalElement.removeAttribute('disabled');
        }
    }
}