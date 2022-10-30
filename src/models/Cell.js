export class Cell {
    constructor(board, x, y, mark) {
        this.x = x;
        this.y = y;
        this.board = board;
        this.mark = mark;
        this.id = Math.random()
    }
}