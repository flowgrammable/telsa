'use strict';

var protocols = {
  text: 'Protocol',
  icon: 'fa-code',
  show: true,
  children: [{
    text: 'Ethernet',
    icon: 'fa-circle'
  }, {
    text: 'VLAN',
    icon: 'fa-circle'
  }, {
    text: 'IPv4',
    icon: 'fa-circle'
  }]
};
  
var packets = {
  text: 'Packet',
  icon: 'fa-code',
  show: true,
  children: [{
    text: 'stp1',
    icon: 'fa-circle'
  }, {
    text: 'mstp1',
    icon: 'fa-circle'
  }, {
    text: 'icmp1',
    icon: 'fa-circle'
  }]
};

var profiles = {
  text: 'Profile',
  icon: 'fa-code',
  show: true,
  children: [{
    text: 'Corsa',
    icon: 'fa-circle'
  }, {
    text: 'Pica8',
    icon: 'fa-circle'
  }, {
    text: 'Brocade',
    icon: 'fa-circle'
  }]
};

var switches = {
  text: 'Switch',
  icon: 'fa-code',
  show: false,
  children: [{
    text: 'sw1',
    icon: 'fa-circle'
  }, {
    text: 'sw2',
    icon: 'fa-circle'
  }]
};
  
var tree = {
  children: [
    protocols,
    packets,
    switches
  ]
};

/**
 * @ngdoc function
 * @name vizApp.controller:TreeCtrl
 * @description
 * # TreeCtrl
 * Controller of the vizApp
 */
angular.module('vizApp')
  .controller('TreeCtrl', function ($scope) {
    $scope.assets = {
      tree: tree,
      selected: null,
    };
    $scope.select = function(name) {
      $scope.assets.selected = name;
      console.log('selected: '+$scope.assets.selected);
    };
  });
