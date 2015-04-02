#!/usr/local/bin/node
(function(){
var socket = require('socket.io-client')('http://localhost:8888');
var ovsdb = require('./ovsdb');

var ovsdbs = {};
socket.on('connect', function(){
  console.log('Connected to socket.io server');
});

socket.on('switchinfo', function(d){
  var ovsdb1 = new ovsdb.Ovsdb({port:d.port, ip: d.ip}, socket);
  ovsdbs[ovsdb1.id] = ovsdb1;
  ovsdb1.connect(function(err){
    if(!err){
      console.log('OVSDB connected to service...');
      socket.emit('switch:connected', ovsdb1.id)
    }
  });
});

socket.on('ovsdb:request', function(d){
  console.log('requesting...', d.method);
  ovsdbs[d.id][d.method](d.params);
});

})();
