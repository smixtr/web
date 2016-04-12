var events = require('events'),
  util = require('util');

var Client = function(socket) {
  this.socket = socket;
};

util.inherits(Client, events.EventEmitter);

Client.prototype.init = function() {
  var self = this;

  //self.socket.on('disconnect', function() {});
};

module.exports = Client;
