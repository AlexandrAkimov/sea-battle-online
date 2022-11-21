import React from 'react';
import CellComponent from './CellComponent';

const BoardComponent = ({ board, setBoard, shipsReady, isMyBoard, canShoot, shoot }) => {
    const boardClasses = ['board']
    if (canShoot) {
        boardClasses.push('active-shoot')
    }
    function addMark(x, y) {
        console.log(shipsReady, isMyBoard);
        if (!shipsReady && isMyBoard) {
            board.addShip(x, y);
        } else if (canShoot && !isMyBoard) {
            shoot(x, y)
        }
        updateBoard()
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();

        setBoard(newBoard)
    }

    return (
        <div className={boardClasses.join(' ')}>
            {board.cells.map((row, index) =>
                <React.Fragment key={index}>
                    {row.map(cell =>
                        <CellComponent key={cell.id} cell={cell} addMark={addMark} />
                    )}
                </React.Fragment>
            )}
        </div>
    );
}

export default BoardComponent;
