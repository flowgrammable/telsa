var app = require('express')();
var http = require('http').Server(app);
var socket = require('socket.io-client')('http://localhost:8888');
var io = require('socket.io')(http);

var ovsdb = require('./ovsdb');

http.listen(8888, function(){
  console.log('listening on *:8888');
});

io.sockets.on('connected', function(d){
});


io.on('connection', function(socket) {
  socket.on('switch:add', function(switchConfig){
    socket.broadcast.emit('switchinfo', switchConfig);
  }); 

  socket.on('switch:connected', function(id){
    console.log('OVSDB connected', id);
    socket.broadcast.emit('ovsdb:connected', id); 
  });

  socket.on('ovsdb:request', function(d){
    console.log('Ovsdb request: ', d.id);
    socket.broadcast.emit('ovsdb:request', d);
  });

  socket.on('ovsdb:response', function(d){
    socket.broadcast.emit('ovsdb:response', d);
  });

  socket.on('switch:getdb', function(d){
    socket.broadcast.emit('switch:getdb', d);
  });
});

