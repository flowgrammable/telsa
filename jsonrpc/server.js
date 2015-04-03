#!/usr/bin/env node

var net = require('net');
var jrpc = require('./jsonrpc');

net.createServer(function(sk) {
  var state = new jrpc.State();

  sk.on('data', function(data) {
    try {
      state.read(data);
    } catch (e) {
      console.log(e);
      sk.destroy();
    }
  });

  sk.on('end', function() {
    console.log('close');
  });

}).listen(5060, 'localhost');

