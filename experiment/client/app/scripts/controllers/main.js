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
    $scope.orgId = 'flog';

    $scope.ovsdbs = [];

    $scope.ovses = [];
    socket.on('connect', function(){
      console.log('cconnected', socket);
      socket.emit('subscribe', $scope.orgId);
    });

    $scope.grabSwitches = function(){
      socket.emit('ovs', {
        action: 'listswitches',
        orgId: $scope.orgId
      });
    };

    $scope.addSwitch = function(name){
     $scope.ovs = {
       orgId: $scope.orgId,
       action: 'addswitch',
       name: $scope.name,
       address: ''
     };

     socket.emit('ovs', $scope.ovs);
    }; 
   
    $scope.$on('socket:broadcast', function(d){
      console.log('recieved msg:', d);
    });

    socket.on('ovsevent', function(d){
      $scope.msg = d;
      if(d.action === 'switchevent'){
        _($scope.ovses).each(function(ovs){
          if(ovs.name === d.name){
            ovs.activity = d.switchevent.activity;
          }
        });
      } else
      if(d.action === 'ready'){
        var ovsentry = {
          name: $scope.ovs.name,
          address: d.ip,
          port: '6640',
          activity: 'disconnected'
        };
        $scope.ovses.push(ovsentry);
        $scope.name = '';
      }
    });

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
