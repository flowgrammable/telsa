#!/usr/bin/env node

var redis = require('redis');
var redisClient = redis.createClient();
var redisSubClient = redis.createClient();

var io = require('socket.io')();
var uuid = require('uuid');
var _ = require('underscore');

var rooms = {};
var clients = {};

var Organizations = {
  'flog': {
      members: { 
        'ren' : {},
        'stimpy' : {}
      },
      ioRoom: uuid.v4()
  }
};

var connectedSockets = []; 


function Client(socket){
this.id = socket.client.conn.id;
this.ip = socket.client.conn.remoteAddress;
this.rooms = socket.rooms;
};

io.on('connection', function(socket){
	console.log('client connected');
 	clients[socket.id] = new Client(socket);
        console.log(socket.client.conn.remoteAddress);
	socket.on('subscribe', function(orgId){
           console.log('subscribe request: ', orgId);
    var ks = '__keyspace@0__:ovs:'+orgId+':*';
    redisSubClient.psubscribe(ks);
    socket.join(Organizations[orgId].ioRoom);
    connectedSockets.push(socket);
	});

  socket.on('ovs', function(data){
    switch(data.action){
      case 'addswitch':
        // tell dispatch module to spawn controller container
        spawnControllerContainer(data);
        // generate cert info and email subscriber
        // emailModule
        break;
      case 'listswitches':
        grabSwitchStatus(data);
        break;
      default:
        break;
    }
  });

});

function grabSwitchStatus(data){
      redisClient.get('ovs:'+data.orgId+':switch:*', function(err, value){
if(err){
console.log(err);
var res = { action: 'error', res: err };
} else {
console.log(value);
var res = { action: 'list', res: value};
}
	io.sockets.in(Organizations[data.orgId].ioRoom).emit('ovsevent', res);
      });
}

function spawnControllerContainer(data){
     var spawnCtrlMsg = {
        action: 'new',
        name: data.name, 
        type: 'tinycontroller',
        orgId: data.orgId 
      };
      spawnCtrlMsg.metaCmd = ['tinycontroller', '-o', data.orgId, '-n', data.name, '-r', '10.0.2.15:6379', '-p', 6640];
      redisClient.publish('container', JSON.stringify(spawnCtrlMsg));
}

redisSubClient.on('ready', function(){
  redisSubClient.subscribe('container');
});

redisSubClient.on('pmessage', function(pattern, channel, msg){
  console.log(pattern, channel, msg);
  if(msg === 'set'){
  var key = channel.split(':');
  key.shift();
  var orgId = key[1];
  var key1 = key.join(':');
  redisClient.get(key1, function(err, value){
    var ovsevent = {
	action: 'switchevent',
        orgId: orgId,
        name: key[3],
        switchevent: { activity: value }
    };
    io.sockets.in(Organizations[orgId].ioRoom).emit('ovsevent', ovsevent);
  });
  }

});

redisSubClient.on('message', function(channel, msg){
  var msg = JSON.parse(msg);
  switch(channel){
    case 'container':
      if(msg.action === 'ready'){
        console.log('emitting to', Organizations[msg.orgId].ioRoom);
	io.sockets.in(Organizations[msg.orgId].ioRoom).emit('ovsevent', msg);
	}
      break;
    default:
      console.log('recieved message on channel: ', channel, msg);
      break;
  }
});

io.listen(8888);
