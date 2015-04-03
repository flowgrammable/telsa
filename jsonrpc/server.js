#!/usr/bin/env node

var net = require('net');
var ovsdb = require('./ovsdb/ovsdb');

net.createServer(function(sk) {
  var state = new jrpc.State();

  sk.on('data', function(data) {
    try {
      _(state.read(data)).each(function(req) {
        console.log(req);
      });
    } catch (e) {
      console.log(e);
      sk.destroy();
    }
  });

  sk.on('end', function() {
    console.log('close');
  });

}).listen(5060, 'localhost');

