#!/usr/bin/env node

var net = require('net');
var  _ = require('underscore');
var jrpc = require('./jsonrpc');

function Server(sk) {
  var that = this;
  this.peer = new jrpc.Peer(sk, 
    function(msg) {
      that.requestCB(msg);
    }, 
    function(msg) {
      that.notifyCB(msg);
    }, 10000, 
    function() {
      that.destroy();
    });

  this.timer = setInterval(function() {
    that.peer.request('echo', [], function(err, result) {
      if(err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  }, 10000);

  this.peer.request('stuff', [], function(err, result) {
    if(err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });

}

Server.prototype.requestCB = function(msg) {
  console.log('request');
  console.log(msg);
};

Server.prototype.notifyCB = function(msg) {
  console.log('notify');
  console.log(msg);
};

Server.prototype.destroy = function() {
  clearInterval(this.timer);
};

net.createServer(function(sk) {
  var server = new Server(sk);
}).listen(5060);

