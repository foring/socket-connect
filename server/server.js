const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use('/dist', express.static(path.resolve(__dirname, '../dist')));
app.use('/', function (req, res) {
  res.send('<html>' +
          '<head>' +
          '<script src="../dist/bundle.js"></script>' +
          '</head>' +
          '<body>' +
          '</body>' +
          '</html>');
});


const server = http.createServer(app);
const wss = new WebSocket.Server({server});


wss.on('connection', function connection(ws, req) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const location = url.parse(req.url, true);

  ws.on('pong', function heartbeat() {
    ws.isAlive = true;
  });
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  //ws.send('something');
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    //if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.send('ping', false, true);
  });
}, 3000);

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});