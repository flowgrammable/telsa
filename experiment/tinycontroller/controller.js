#!/usr/bin/env node

var redis = require('redis');
var _ = require('underscore'); 
var ip = require('os').networkInterfaces();
var program = require('commander');
var net = require('net');
var ovsdb = require('ovsdb-js');
var ovs = require('./node_modules/ovsdb-js/lib/ovs.js');

program
  .option('-o, --organization [organization]', 'organization id')
  .option('-n, --name [name]', 'switch name')
  .option('-s, --switchip [switchIP]', 'switch address')
  .option('-p, --port [switchPort]', 'switch port')
  .option('-r, --redis [redis]', 'redis info 10.0.2.15:6379')
  .parse(process.argv);

var red = program.redis.split(':');
var redisSubClient = redis.createClient(red[1], red[0]); 
var redisClient = redis.createClient(red[1], red[0]);

redisSubClient.on('ready', function(){
  redisSubClient.subscribe(program.organization);
});

redisSubClient.on('message', function(channel, msg){
  console.log('recieved message...', msg);
});

var ctrlConfig = { 
  orgId: program.organization,
  name: program.name,
  switchIP: program.switchip || '',
  switchPort: program.port || 6640
};

function TinyController(conf){
  console.log('Configuration: ', conf);
  var that = this;
  this.orgId= conf.orgId;
  this.name = conf.name; 
  this.switchIP = conf.switchIP; 
  this.switchPort = conf.switchPort;
  this.ip = ip;
  console.log(this.ip);
  this.ovsdbServer = new net.createServer(function(sock){
    redisClient.set('ovs:'+that.orgId+':switch:'+that.name+':status', 'disconnected');
    that.ovsdb = new ovsdb.OVSDB(sock);
    sock.on('close', function(){
      console.log('ovsdb disconnected from service...');
      redisClient.set('ovs:'+that.orgId+':switch:'+that.name+':status', 'disconnected');
    });
  });
  
}

var tc = new TinyController(ctrlConfig);


tc.ovsdbServer.listen(tc.switchPort);

tc.ovsdbServer.on('error', function(err){
  console.log('error connecting to ovsdb..', err);
  redisClient.set('ovs:'+tc.orgId+':switch:'+tc.name+':status', JSON.stringify(err)); 
});

tc.ovsdbServer.on('close', function(){
  console.log('controller closed the connection..');
  redisClient.set('ovs:'+tc.orgId+':switch:'+tc.name+':status', 'disconnected');
});

tc.ovsdbServer.on('connection', function(){
  console.log('connected to ovsdb..');
  redisClient.set('ovs:'+tc.orgId+':switch:'+tc.name+':status', 'connected');
});

var responder = function(err, res){
  if(err){
    redisClient.publish(tc.orgId, JSON.stringify(
    { 
      action: 'event',
      orgId: tc.orgId,
      name: tc.name,
      error: err
    }));
  } else {
    redisClient.publish(tc.orgId, JSON.stringify(
    { 
      action: 'event',
      orgId: tc.orgId,
      name: tc.name,
      res: res
    }));
  }
};

