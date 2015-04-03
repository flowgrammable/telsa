'use strict';

/**
 * @ngdoc function
 * @name flowsimApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flowsimApp
 */
angular.module('flowsimApp')
  .controller('MainCtrl', function ($scope, socket) {
    $scope.ovs = {
      name: '',
      port: '',
      ip: ''
    };
    $scope.ovsdbs = [];

    console.log('socket:', socket);
    socket.on('connect', function(){
      console.log('cconnected');
    });
   
    socket.on('ovsdb:response', function(d){
     console.log('response from ovsdb...', d);
     if(d.res.result !== 'echo'){
      $scope.ovsdbResponse = d.res;
     } else {
      $scope.lastEcho = new Date().toString('HH:mm:ss');
     }
    });

    socket.on('ovsdb:connected', function(d){
      $scope.ovsdbs.push({
        name: $scope.ovs.name,
        port: $scope.ovs.port,
        ip: $scope.ovs.ip,
        id: d
      });
      $scope.ovs.name = '';
      $scope.ovs.port = '';
      $scope.ovs.ip = '';
    });

    $scope.getSchema = function(){
      $scope.ovsdbRequest('get_schema', 'Open_vSwitch');
    };    

    $scope.getDB = function(){
      $scope.ovsdbRequest('listDB');
    };

    $scope.addController = function(){
      var addCtrl = {
        'op': 'insert',
        'table': 'Controller',
        'row': {'target': 'ptcp:6633' },
        'uuid-name': 'dddd'
      };
      var commit = {
        'op': 'commit',
        'durable': true 
      };
      var updateRow = {'next_cfg': 2};
     
      var incSequence = {
        'op': 'update',
        'table': 'Open_vSwitch',
        'where': [['cur_cfg', '==', 1] ],
        'row': {'next_cfg': 2} 
      };

      $scope.ovsdbRequest('transact', 
          ['Open_vSwitch', addCtrl, incSequence, commit ] );
    };

    $scope.updateDB = function(){
      var updateRow = {'next_cfg': '2'};
     
      var incSequence = {
        'op': 'update',
        'table': 'Open_vSwitch',
        'where': ['next_cfg', '==', '1' ],
        'row': updateRow
      };

      $scope.ovsdbRequest('transact',
          ['Open_vSwitch', incSequence]);
    };

    
    $scope.ovsdbRequest = function(meth, params){
      var id = $scope.ovsdbs[0].id;
      if(!params){
        var params = [];
      };
      socket.emit('ovsdb:request', { id: id,
       ovsdbId: id,
       params: params,  method: meth});
    };

    $scope.addSwitch = function(){
      socket.emit('ovsdb:import', {
        name: $scope.ovs.name,
        port: $scope.ovs.port,
        ip: $scope.ovs.ip
      });
    };

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
