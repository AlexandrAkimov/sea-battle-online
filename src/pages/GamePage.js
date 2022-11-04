import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import ActionsInfo from '../components/ActionsInfo';
import BoardComponent from '../components/BoardComponent';
import { Board } from '../models/Board';

const wss = new WebSocket('ws://localhost:4000')

const GamePage = () => {
    const [myBoard, setMyBoard] = useState(new Board());
    const [hisBoard, setHisBoard] = useState(new Board());
    const [rivalName, setRivalName] = useState('')
    const [shipsReady, setShipReady] = useState(false);
    const [canShoot, setCanShoot] = useState(false)
    
    const {gameId} = useParams();
    const navigate = useNavigate()

    wss.onmessage = function(response) {
        const {type, payload} = JSON.parse(response.data)
        const {username, x, y, canStart, rivalName, success} = payload
        switch (type) {
            case 'connectToPlay':
                if (!success) {
                    navigate('/')
                }
                if (rivalName) {
                    setRivalName(rivalName)
                }
                if (rivalName === localStorage.nickname) {
                    setRivalName(username)
                }
                break;
            case 'readyToPlay':
                if (payload.username === localStorage.nickname && canStart) {
                    setCanShoot(true)
                }
                break;
            case 'afterShootByMe':
                if (username !== localStorage.nickname) {
                    const isPerfectHit = myBoard.cells[y][x].mark?.name === 'ship'
                    changeBoardAfterShoot(myBoard, setMyBoard, x, y, isPerfectHit)
                    wss.send(JSON.stringify({event: 'checkShoot', payload: {...payload, isPerfectHit}}))
                    if (!isPerfectHit) {
                        setCanShoot(true)
                    }
                }
            case 'isPerfectHit':
                if (username === localStorage.nickname) {
                    changeBoardAfterShoot(hisBoard, setHisBoard, x, y, payload.isPerfectHit);
                    payload.isPerfectHit ? setCanShoot(true) : setCanShoot(false)
                }
                break;
            default:
                break;
        }
    }

    function changeBoardAfterShoot(board, setBoard, x, y, isPerfectHit) {
        isPerfectHit ? board.addDamage(x, y) : board.addMiss(x, y)
        const newBoard = board.getCopyBoard()
        setBoard(newBoard)
    }

    function restart() {
        const newMyBoard = new Board()
        const newHisBoard = new Board()
        newMyBoard.initCells();
        newHisBoard.initCells();
        setMyBoard(newMyBoard);
        setHisBoard(newHisBoard)
    }

    function ready() {
        wss.send(JSON.stringify({event: 'ready', payload: {username: localStorage.nickname}}))
        setShipReady(true)
    }

    function shoot(x, y) {
        wss.send(JSON.stringify({event: 'shoot', payload: {username: localStorage.nickname, x, y}}))
    }

    useEffect(() => {
        wss.send(JSON.stringify({event: 'connect', payload: {username: localStorage.nickname, gameId}}));
        restart()
    }, []);
    return (
        <div>
            WELCOME TO GAME
            <div className='boards-container'>
                <div>
                    <p className='nick'>{localStorage.nickname}</p>
                    <BoardComponent 
                        board={myBoard} 
                        setBoard={setMyBoard} 
                        shipsReady={shipsReady} 
                        isMyBoard
                        canShoot={false}
                    />

                </div>
                <div>
                    <p className='nick'>{rivalName || 'Ваш соперник пока не вошел.'}</p>
                    <BoardComponent 
                        board={hisBoard} 
                        setBoard={setHisBoard} 
                        shipsReady={shipsReady} 
                        canShoot={canShoot}
                        shoot={shoot}
                    />       

                </div>
            </div>
            <ActionsInfo ready={ready} canShoot={canShoot} shipsReady={shipsReady}/>
        </div>
    );
}

export default GamePage;
