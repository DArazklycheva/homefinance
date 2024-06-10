import {Income} from "./income";

export class IncomeList extends Income{
    constructor(openNewRoute) {
        super(openNewRoute);
        this.getIncomes().then();
    }
}