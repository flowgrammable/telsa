var app = require('express')();
var http = require('http').Server(app);
var socket = require('socket.io-client')('http://localhost:8888');
var io = require('socket.io')(http);
var shortid = require('shortid');
var ovsdb = require('./ovs/ovsdb');

http.listen(8888, function(){
  console.log('listening on *:8888');
});

io.sockets.on('connected', function(d){
});


io.on('connection', function(socket) {
  socket.on('ovsdb:import', function(ovsdbConfig){ 
    // associate the ovsdb instance with an id
    ovsdbConfig.id = shortid.generate();
    // publish incoming message
    // maybe associate ovsdb instance with user/organization
    socket.broadcast.emit('ovsdb:connect', ovsdbConfig);
  }); 

  socket.on('ovsdb:connected', function(ovsdbId){
    // send msg back to user browser
    // maybe store somewhere
    socket.broadcast.emit('ovsdb:connected', ovsdbId); 
  });

  socket.on('ovsdb:request', function(d){
    // d.id       - JSON RPC request id
    // d.params   - JSON RPC params
    // d.method   - JSON RPC method
    // d.ovsdbId  - ovsdb instance id
    console.log('OVSDB request: ', d.id);
    socket.broadcast.emit('ovsdb:request', d);
  });

  socket.on('ovsdb:response', function(d){
    // d.ovsdbId  - ovsdb instance id 
    // d.res      - JSON RPC response 
    // d.res.id   - JSON RPC response id
    // TODO: broadcast to user/org socket
    socket.broadcast.emit('ovsdb:response', d);
  });

});

