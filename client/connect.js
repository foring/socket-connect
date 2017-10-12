//const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = function open() {
  ws.send('something');
};

ws.onmessage = function incoming(res) {
  console.log(res.data);
};