#!/usr/local/bin/node
(function(){
var shortid = require('shortid');
var rpc = require('./rpcclient.js');

var Ovsdb = function(config, socket){
  var that = this;
  this.port = config.port;
  this.ip = config.ip;
  this.id = config.id;
  this.socket = socket;

  this.requestHandler = function(req){
    switch(req.method){
      case "echo":
        this.echo(); 
        break;
      default:
        break;
    }
  };
  
  // incoming data
  this.resHandler = function(res){
    if(res.method && res.method === 'echo'){
      that.echo();
    }
    that.socket.emit('ovsdb:response', {ovsdbId:that.id, res: res});
  };

  this.rpc = new rpc.Client({
    requestHandler: this.requestHandler,
    resHandler: this.resHandler
  });
};

Ovsdb.prototype.toString = function(){
  return "IP: " + this.ip + "\n" +
         "Port: " + this.port + "\n" +
         "ID: " + this.id;
};

Ovsdb.prototype.echo = function(){
  this.rpc.respond([] , null, 'echo'); 
};

Ovsdb.prototype.listDB = function(id){
  this.rpc.request("list_dbs", [], id);
};

Ovsdb.prototype.transact = function(params, id){
  this.rpc.request("transact", params, id);
};

Ovsdb.prototype.get_schema = function(dbName){
  this.rpc.request('get_schema', [dbName]);
};

Ovsdb.prototype.connect = function(cb){
  this.rpc.connect(this.port, this.ip, function(err){
    if(!err){
      cb(null);
    }
  });
};

module.exports.Ovsdb = Ovsdb;
})();
