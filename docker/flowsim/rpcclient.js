#!/usr/local/bin/node
(function() {
var net = require('net');
var shortid = require('shortid');

var requests = {};

var Client = function(options) {
  this.requestHandler = options.requestHandler; 
  this.resHandler = options.resHandler;
  this.sock = new net.Socket();
  this.connected = false;
  var that = this;

  this.sock.on('connect', function(){
    that.connected = true;
  });

  this.sock.on('error', function(err){
    console.log('error', err);
  });

  this.sock.on('data', function(data){
    var msg = JSON.parse(data);
    that.resHandler(msg);
  });
};

Client.prototype.request = function(amethod, aparams){
  var rid = shortid.generate();
  this.send({method: amethod, params: aparams, id: rid});
};

Client.prototype.respond = function(res, err, id){
  this.send({result: res, error: err, id: id});
};

Client.prototype.connect = function(port, ip) {
   var that = this;
   this.sock.connect(port, ip, function(err, res){
     console.log('connected');
      if(err) { console.log('error:', err); }
   });
};

Client.prototype.send = function(data){
  this.sock.write(JSON.stringify(data));
};

module.exports.Client = Client;
})();


