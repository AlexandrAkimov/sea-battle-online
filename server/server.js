const WebSocket = require('ws');

const games = {}

function start() {
  const wss = new WebSocket.Server({ port: 4000 }, () =>
    console.log('WebSocket Server started on port 4000')
  );

  wss.on('connection', (wsClient) => {
    wsClient.on('message', async (message) => {
      const req = JSON.parse(message.toString());
      wsClient.nickname = req.payload.username
      if (req.event == 'connect') {
        initGames(wsClient, req.payload.gameId)
      }

      broadcast(req);
    });
  });

  /* 
    {
      '34546565464': [
        ws1: {......},
        ws2: {......}
      ],
      '54543252435': [
        ws3: {......},
        ws4: {......}
      ]
    }
  */

  function initGames(ws, gameId) {
    if (!games[gameId]) {
      games[gameId] = [ws]
    }

    if (games[gameId] && games[gameId]?.length < 2) {
      games[gameId] = [...games[gameId], ws]
    }

    if (games[gameId] && games[gameId].length === 2) {
      games[gameId] = games[gameId].filter(wsc => wsc.nickname !== ws.nickname)
      games[gameId] = [...games[gameId], ws]
    }
  }

  function broadcast(params) {
    let res;
    const { username, gameId } = params.payload
    games[gameId].forEach((client) => {
      switch (params.event) {
        case 'connect':
          res = {
            type: 'connectToPlay',
            payload: {
              success: true,
              rivalName: games[gameId].find(user => user.nickname !== client.nickname)?.nickname,
              username: client.nickname
            }
          };
          break;
        case 'ready':
          res = { type: 'readyToPlay', payload: { canStart: games[gameId].length > 1, username } };
          break;
        case 'shoot':
          res = { type: 'afterShootByMe', payload: params.payload }
          break;
        case 'checkShoot':
          res = { type: 'isPerfectHit', payload: params.payload }
          break
        default:
          res = { type: 'logout', payload: params.payload };
          break;
      }
      client.send(JSON.stringify(res));
    });
  }
}

start()
