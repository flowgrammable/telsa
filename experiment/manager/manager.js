#!/usr/bin/env node

var redis = require('redis');
var prog = require('commander');
var _ = require('underscore');
var Docker = require('dockerode');

prog
  .option('-k, --kill', 'kill all containers')
  .parse(process.argv);

function Manager(){
  var that = this;
  this.docker = new Docker({host: 'http://0.0.0.0', port: 4243}); 
  this.redisClient = redis.createClient();
  this.redisSubClient = redis.createClient();

  this.Images = {
    'tinycontroller': { 
      image: 'flowgrammable/tinycontroller',
      repo: 'registry.hub.docker.com',
      cmd: ['nodejs', '/controller.js'] 
    }
  };

}
  
Manager.prototype.pullImages = function(cb){
  _(_(this.Images).keys()).each(function(img){
    this.pullImage(img, cb);
  }, this);
};

Manager.prototype.pullImage = function(img, cb){
  this.docker.pull(this.Images[img].image, 
      function(err, stream){ 
        if(err) { cb(err); }
        else { 
          cb(null, stream); 
        }
      });
};


Manager.prototype.selectImage = function(data){
  if(!this.Images[data.image].available){
    this.pullImage(data.image, this);
  } else {
  }
};

Manager.prototype.installedImages = function(cb){
  this.docker.listImages(cb);
};

Manager.prototype.createContainer = function(data, cb){ 
  var container = {
    Image: this.Images[data.type].image,
    name: data.type+'.'+data.orgId+'.'+data.name,
    ExposedPorts: {
     "6640/tcp" : {}
    } 
  };
  if(data.metaCmd){
    container.Cmd = this.Images[data.type].cmd.concat(data.metaCmd);
  } else {
    container.Cmd = this.Images[data.type].cmd;
  }
  this.docker.createContainer(container, function(err, res){
    if(err) { cb(err); }
    else {
      console.log('container info', res);
      cb(null, res);
    }
  });
};

Manager.prototype.listContainers = function(cb){
  this.docker.listContainers(cb);
};

Manager.prototype.startContainer = function(container, reqData){
  var that = this;
  container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
        stream.pipe(process.stdout);
  });
  container.start(function(err, res){
    if(err){
      console.log(err);
    } else {
      container.inspect(function(err, data){
        if(err) { console.log(err); }
        else {
         var containerInfo =  {
            Id: data.Id,
            name: reqData.name,
            type: reqData.type,
            orgId: reqData.orgId,
            ip: data.NetworkSettings.IPAddress,
            subnet: data.NetworkSettings.IPPrefixLen,
            ports: data.NetworkSettings.Ports
          };
          that.redisClient.set('container:'+containerInfo.Id, JSON.stringify(containerInfo));
          that.redisClient.publish('container', JSON.stringify({ 
		        action: 'ready', 
		        orgId: containerInfo.orgId, 
		        id: containerInfo.id,
		        ip: containerInfo.ip}));
        }
      });
    }
  });
};

Manager.prototype.deployContainer = function(data){
  mgr.createContainer(data, function(err, container){
    if(err){
      console.log(err);
    } else {
      data.containerId = container.id;
      console.log(data);
      mgr.startContainer(container, data);
    }
  });
};

Manager.prototype.killContainers = function(cb){
  var that = this;
  that.docker.listContainers({all: true}, function(err, containers){
    if(err) { console.log(err); }
    else {
    console.log('containers...', containers);
    containers.forEach(function(containerInfo){
      that.redisClient.del('container:'+containerInfo.Id);
      that.docker.getContainer(containerInfo.Id).remove({force: true},cb);
    });
    }
  });
};

var mgr = new Manager();

var print = function(err, res){
  if(err){
    console.log(err);
  } else {
    console.log(res);
  }
};

if(prog.kill){
  mgr.killContainers(print);
} else {
  mgr.redisSubClient.on('ready', function(){
    mgr.redisSubClient.subscribe('container');
  });

  mgr.redisSubClient.on('message', function(channel, message){
    console.log('[CONTAINER]:', message);
    var jmsg = JSON.parse(message);
    switch(jmsg.action){
      case 'new':
        mgr.deployContainer(jmsg);
        break;
      default:
        break;
    }
  });

}
