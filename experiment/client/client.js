#!/usr/bin/env node
var uuid = require('uuid');
var ioclient = require('socket.io-client');
var clisock = ioclient('http://localhost:8888');

clisock.on('tinyNBIevent', function(data){
  console.log('got tinyNBI event from controller....', data);
});
clisock.on('ovsevent', function(data){
  console.log('got ovs event from controller....', data);
});

var webcli = {id: 1, orgId: 'abc123' }; 
clisock.on('connect', function(c){
  clisock.emit('subscribe', webcli.orgId); 
});

setTimeout(function(){
  console.log('attempting to connect to controller');
  clisock.emit('ovs', {
    orgId: webcli.orgId, 
    action: 'addswitch',
    name: 'myovsswitch',
    switchIP: '192.168.10.4',
    switchPort: '6640'
	});
}, 5000);

