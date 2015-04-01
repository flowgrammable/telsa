#!/usr/bin/nodejs 
(function() {
var net = require('net');

var requests = {};

var Client = function(options) {
  this.requestHandler = options.requestHandler; 
  this.sock = new net.Socket();
  var that = this;

  this.sock.on('connect', function(){
    console.log('connected');
  });

  this.sock.on('error', function(err){
    console.log('error', err);
  });

  this.sock.on('data', function(data){
    var msg = JSON.parse(data);
    if(!msg.method){
      console.log('response ', msg);
    } else {
      that.requestHandler(msg, function(data){
        if(data){
          that.send(data);
        }
      });
    }
  });
};

Client.prototype.connect = function(port, ip) {
   var that = this;
   this.sock.connect(port, ip, function(err, res){
      if(err) { console.log('error:', err); }
   });
};

Client.prototype.send = function(data){
  this.sock.write(JSON.stringify(data));
};

module.exports.Client = Client;
})();


