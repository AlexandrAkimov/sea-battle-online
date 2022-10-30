import React from 'react';

const CellComponent = ({cell, addMark}) => {
    
    return (
        <div className='cell' onClick={() => addMark(cell.x, cell.y)}>
            {cell.mark?.logo}
        </div>
    );
}

export default CellComponent;
