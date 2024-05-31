import AirDatepicker from "air-datepicker";

export class Main {
    constructor() {
        console.log('MAIN');

        new AirDatepicker('#airDatepicker', {
            buttons: ['today', 'clear']
        });
        new AirDatepicker('#airDatepicker2', {
            buttons: ['today', 'clear']
        });
    }
}