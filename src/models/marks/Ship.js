import { Mark } from "./Mark";

export class Ship extends Mark {
    constructor(cell) {
        super(cell);
        this.logo = 'S';
        this.name = 'ship'
    }
}