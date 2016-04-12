var express = require('express');
var app = express();
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);
var Server = require('./lib/server');

httpServer.listen(3000);

app.use(express.static('static'));


var s = new Server(io);
s.init();
