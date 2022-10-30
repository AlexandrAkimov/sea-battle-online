const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 }, () =>
  console.log('Server started on port 4000')
);
const clients = new Set();
const readyClients = new Set();
let gamePlayId = 0;
let adminName = ''

wss.on('connection', (wsClient) => {
  clients.add(wsClient);

  wsClient.on('message', (message) => {
    const req = JSON.parse(message.toString());
    wsClient.nickname = req.payload.username
    if (clients.size < 2) adminName = req.payload.username
    broadcast(req);
  });

  wsClient.on('close', () => {
    clients.delete(wsClient);
    //broadcast({ event: 'logout', payload: { data: 'logout' } });
  });
});

function broadcast(params) {
  let res;
  const {username, gameId} = params.payload
  if (params.event === 'ready') {
    readyClients.add(Date.now())
  }
  console.log('Size clients', clients.size);
  clients.forEach((client) => {
    switch (params.event) {
      case 'connect':
        if(clients.size < 2) gamePlayId = gameId;
        let rivalName = ''
        if (clients.size === 2) {
          rivalName = [...clients][0]?.nickname
        }
        res = { 
          type: 'connectToPlay', 
          payload: {success: gamePlayId === gameId || adminName === client.nickname, rivalName, username }};
        break;
      case 'ready':
        res = { type: 'readyToPlay', payload: {canStart: readyClients.size === 2, username} };
        break;
      case 'shoot':
          res = {type: 'afterShootByMe', payload: params.payload}
          break;
      case 'checkShoot':
          res = {type: 'isPerfectHit', payload: params.payload}
        break
      default:
        res = { type: 'logout', payload: params.payload };
        break;
    }
    client.send(JSON.stringify(res));
  });
}
