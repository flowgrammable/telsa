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
    console.log('something connected...');
    that.connected = true;
  });

  this.sock.on('error', function(err){
    console.log('error', err);
  });

  // incoming data
  var open = 0;
  var close = 0; 
  var msg = ''; 
  var jmsg = '';
  this.sock.on('data', function(data){
    for(var i = 0; i < data.length; i++){
      if(data[i] === 123){
        open++;
      } else if(data[i] === 125){
        close++;
      }
      if(open > close || close === 0){
       msg += String.fromCharCode(data[i]);
      } else {
       msg += String.fromCharCode(data[i]);
       jmsg = JSON.parse(msg);
       msg = '';
       open = 0;
       close = 0;
      } 
    }
    if(jmsg){
      that.resHandler(jmsg);
      jmsg = '';
    }
  });
};

Client.prototype.request = function(amethod, aparams, id){
  if(!id){
    var id = shortid.generate();
  }
  this.send({method: amethod, params: aparams, id: id});
};

Client.prototype.respond = function(res, err, id){
  this.send({result: res, error: err, id: id});
};

Client.prototype.connect = function(port, ip, cb) {
   var that = this;
   this.sock.connect(port, ip, function(err, res){
     console.log('connected');
      if(err) { console.log('error:', err); }
      else { 
        that.connected = true;
        cb(null) 
      }
   });
};

Client.prototype.send = function(data){
  this.sock.write(JSON.stringify(data));
};

module.exports.Client = Client;
})();


