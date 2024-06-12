import {Expense} from "./expense";

export class ExpenseList extends Expense {
    constructor(openNewRoute) {
        super(openNewRoute);
        this.getExpenses().then();
    }
}