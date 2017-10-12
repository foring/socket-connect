const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const app = express();
const server = http.createServer(app);
const session = require('express-session');
const appService = require('./app');
const sessionParser = session({
  saveUninitialized: false,
  secret: '$wss-secret',
  resave: false
});
const wss = new WebSocket.Server({
  server,
  verifyClient: (info, done) => {
    sessionParser(info.req, {}, () => {
      if (info.req.session.userId) {
        //available request;
        done();
      } else {
        done(info.req.session);
      }
    });
  }
});


app.use(sessionParser);
app.use('/dist', express.static(path.resolve(__dirname, '../dist')));

app.use('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

appService.collection(wss);

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});