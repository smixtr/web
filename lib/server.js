var Client = require('./client');

var Server = function(io) {

  this.io = io;
};

Server.prototype.init = function() {
  var self = this;

  self.io.on('connection', function(socket) {
    console.log('Client connected.');

    var c = new Client(socket);
    c.init();

    c.socket.on('disconnect', function() {
      console.log('Client disconnected.');
    });
  });
};

module.exports = Server;
