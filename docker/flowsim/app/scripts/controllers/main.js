'use strict';

/**
 * @ngdoc function
 * @name flowsimApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flowsimApp
 */
angular.module('flowsimApp')
  .controller('MainCtrl', function ($scope, socket, uuid4) {
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
  
    function generateSchema(schema){
      console.log(schema);
    }

    socket.on('ovsdb:response', function(d){
     console.log('response from ovsdb...', d);
     if(d.res.method !== 'echo'){
      $scope.msgbank[d.res.id].value = d.res.result;
      console.log('msgbank..res', $scope.msgbank);
      switch($scope.msgbank[d.res.id].method){
        case 'get_schema':
          generateSchema($scope.msgbank[d.res.id].value);
          break;
        default:
          break;
      }
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

    $scope.msgbank = {};

    $scope.getSchema = function(){
      var id = uuid4.generate();
      $scope.ovsdbRequest(id, 'get_schema', 'Open_vSwitch');
    };    

    $scope.getDB = function(){
      console.log(uuid4);
      var id = uuid4.generate();
      $scope.ovsdbRequest(id, 'listDB');
    };

    $scope.addController = function(){
      var id = uuid4.generate();
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

      $scope.ovsdbRequest(id, 'transact', 
          ['Open_vSwitch', addCtrl] );
    };

    $scope.updateDB = function(){
      var id = uuid4.generate();
      var updateRow = {'next_cfg': '2'};
     
      var incSequence = {
        'op': 'update',
        'table': 'Open_vSwitch',
        'where': ['next_cfg', '==', '1' ],
        'row': updateRow
      };

      $scope.ovsdbRequest(id, 'transact',
          ['Open_vSwitch', incSequence]);
    };

    
    $scope.ovsdbRequest = function(id, meth, params){
      var ovsid = $scope.ovsdbs[0].id;
      if(!params){
        var params = [];
      };
          
      $scope.msgbank[id] = {method: meth, value: ''};
      console.log('msgbank req...', $scope.msgbank);
      socket.emit('ovsdb:request', { id: id,
       ovsdbId: ovsid,
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
