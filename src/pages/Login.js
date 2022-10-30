import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
    const [invitationGame, setTypeEnter] = useState(false)
    const [gameId, setGameId] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate()
    const startPlay = (e) => {
        e.preventDefault();
        if (nickname && gameId) {
            localStorage.nickname = nickname
            navigate('/chat/' + gameId);    
        }
        
    }
    return (
        <div>
            <p>Authorization</p>
            <form onSubmit={startPlay}>
                <fieldset>
                    <label htmlFor="nickname">Nickname</label>
                    <input 
                        type="text" 
                        name="nickname" 
                        id="nickname" 
                        onChange={e => setNickname(e.target.value)}/>
                </fieldset>
                <div onChange={(e) => setTypeEnter(e.target.id === 'ingame')}>
                    <input 
                        type="radio" 
                        name="typeEnter" 
                        id="gen" 
                        value={!invitationGame}
                        defaultChecked={!invitationGame}

                    />
                    <label htmlFor="gen">Создать игру</label>
                    <input 
                        type="radio" 
                        name="typeEnter" 
                        id="ingame" 
                        value={invitationGame}
                        defaultChecked={invitationGame}
                    />
                    <label htmlFor="ingame">Войти в игру по идентификатору</label>
                </div>
                <fieldset>
                    {invitationGame ? (
                        <>
                            <label htmlFor="gameId">Введите идентификатор игры</label>
                            <input 
                                type="text" 
                                name="gameId" 
                                defaultValue="" 
                                id="gameId" 
                                onChange={e => setGameId(e.target.value)}/>
                        </>
                        
                    ) : (
                        <>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault()
                                    setGameId(Date.now())
                                }}>
                                    Сгенерировать идентификатор игры
                            </button>
                            <p>{gameId}</p>
                        </>
                        
                    )}
                </fieldset>
                {!invitationGame ? (
                    <div><input type="text" defaultValue={gameId}/></div>
                ) : (<></>)
                    
                }
                <button type="submit">ИГРАТЬ</button>
            </form>
        </div>
    );
}

export default Login;