#!/usr/bin/nodejs
(function(){

var requestHandler = function(req, cb){
  switch(req.method){
    case "echo":
      cb({result: [], error: null, id: req.id});
      break;
    default:
      cb();
      break;
  }
};

var rpc = require('./rpcclient.js');
var ovsdb = {requestHandler: requestHandler,
             responseHandler: responseHandler
};

var Ovsdb = function(config){
  this.port = config.port;
  this.ip = config.ip;
  this.cli = new rpc.Client(ovsdb);
  var that = this;
};


Ovsdb.prototype.listDB = function(){
  this.cli.send({method: "list_dbs", params: [], id: 0});
};

Ovsdb.prototype.connect = function(){
  this.cli.connect(this.port, this.ip);
};


module.exports.Ovsdb = Ovsdb;
})();
