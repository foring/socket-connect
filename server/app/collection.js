let clients = {};
module.exports = function (wss) {
  wss.on('connection', function connection(ws, req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    clients[ip] = {};
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
    ws.send('connected');
  });
}