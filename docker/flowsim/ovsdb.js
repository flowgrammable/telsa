#!/usr/bin/nodejs
(function(){

var rpc = require('./rpcclient.js');

var Ovsdb = function(config){
  var that = this;
  this.port = config.port;
  this.ip = config.ip;
  this.requestHandler = function(req){
    switch(req.method){
      case "echo":
        this.echo(); 
        break;
      default:
        break;
    }
  };
  this.resHandler = function(res){
    switch(res.method){
      case "echo":
        that.echo(); 
        break;
      default:
        cb();
        break;
    }
  };
  this.rpc = new rpc.Client({
    requestHandler: this.requestHandler,
    resHandler: this.resHandler
  });
};

Ovsdb.prototype.echo = function(){
  this.rpc.respond([] , null, 'echo'); 
};

Ovsdb.prototype.listDB = function(){
  return this.rpc.call("list_dbs", []);
};

Ovsdb.prototype.getSchema = function(dbName){
  console.log('dbname:', dbName);
};

Ovsdb.prototype.connect = function(){
  this.rpc.connect(this.port, this.ip);
};

module.exports.Ovsdb = Ovsdb;
})();
