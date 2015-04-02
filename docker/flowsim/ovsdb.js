#!/usr/local/bin/node
(function(){
var shortid = require('shortid');
var rpc = require('./rpcclient.js');

var Ovsdb = function(config){
  var that = this;
  this.port = config.port;
  this.ip = config.ip;
  this.id = shortid.generate();

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
    console.log('res: ', res);
    switch(res.method){
      case "echo":
        that.echo(); 
        break;
      default:
        break;
    }
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

Ovsdb.prototype.listDB = function(){
  this.rpc.request("list_dbs", []);
};

Ovsdb.prototype.getSchema = function(dbName){
  console.log('dbname:', dbName);
  this.rpc.request('get_schema', [dbName]);
};

Ovsdb.prototype.connect = function(){
  this.rpc.connect(this.port, this.ip);
};

module.exports.Ovsdb = Ovsdb;
})();
