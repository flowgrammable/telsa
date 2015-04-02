var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(8888, function(){
  console.log('listening on *:8888');
});

io.on('connection', function(socket) {
  socket.on('message', function(from, msg) {
    console.log('got message: ', msg);
  });
});
