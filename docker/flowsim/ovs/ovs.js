#!/usr/local/bin/node
(function(){
var socket = require('socket.io-client')('http://localhost:8888');
var ovsdb = require('./ovsdb');

var ovsdbs = {};
socket.on('connect', function(){
  console.log('Connected to socket.io server');
});

socket.on('ovsdb:connect', function(d){
  // create ovsdb instance and attempt to connect to it
  var ovsdb1 = new ovsdb.Ovsdb({port:d.port, ip: d.ip, id: d.id}, socket);
  // track it
  ovsdbs[ovsdb1.id] = ovsdb1;
  ovsdb1.connect(function(err){
    if(!err){
     console.log('OVSDB connected to service...');
     // publish successful connection
      socket.emit('ovsdb:connected', ovsdb1.id)
    }
  });
});

socket.on('ovsdb:request', function(d){
  console.log('Request: ', d.method, d.params);
  // d.ovsdbId - ovsdb instance id
  ovsdbs[d.ovsdbId][d.method](d.id , d.params);
});

socket.on('ovsdb:response', function(d){
  console.log('response...', d);
});

})();
