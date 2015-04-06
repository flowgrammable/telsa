var bunyan = require('bunyan');

function Logger(){
  this.log = bunyan.createLogger({name: 'jsonrpc'});
}

Logger.prototype.info = function(msg){
  this.log.info(msg);
}

Logger.prototype.error = function(msg){
  this.log.error(msg);
}

exports.Logger = Logger;
