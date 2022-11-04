import React from 'react';

const ActionsInfo = ({shipsReady, canShoot, ready}) => {
    console.log(shipsReady);
    if (!shipsReady) {
       return <button className="btn-ready" onClick={ready}>Корабли готовы</button>
    }
    return (
        <div>
            {canShoot 
                ? <p>Стреляй</p> : <p>Выстрел соперника</p>
            }
        </div>
    );
}

export default ActionsInfo;
