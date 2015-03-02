'use strict';

/**
 * @ngdoc function
 * @name vizApp.controller:PacketCtrl
 * @description
 * # PacketCtrl
 * Controller of the vizApp
 */
angular.module('vizApp')
  .controller('PacketCtrl', function ($scope) {
    $scope.ethernet = {
      name: 'Ethernet',
      fields: [{
        name: 'src',
        type: 'uint',
        bits: 48
      }, {
        name: 'dst',
        type: 'uint',
        bits: 48
      }, {
        name: 'type',
        type: 'uint',
        bits: 16
      }]
    };

    $scope.ipv4 = {
      name: 'IPv4',
      fields: [{
        name: 'version',
        type: 'uint',
        bits: 4
      }, {
        name: 'ihl',
        type: 'uint',
        bits: 4
      }, {
        name: 'dscp',
        type: 'uint',
        bits: 6
      }, {
        name: 'ecn',
        type: 'uint',
        bits: 2
      }, {
        name: 'length',
        type: 'uint',
        bits: 16
      }, {
        name: 'identification',
        type: 'uint',
        bits: 16
      }, {
        name: 'flags',
        type: 'uint',
        bits: 3
      }, {
        name: 'offset',
        type: 'uint',
        bits: 13
      }, {
        name: 'ttl',
        type: 'uint',
        bits: 8
      }, {
        name: 'protocol',
        type: 'uint',
        bits: 8 
      }, {
        name: 'checksum',
        type: 'uint',
        bits: 16
      }, {
        name: 'src',
        type: 'uint',
        bits: 32
      }, {
        name: 'dst',
        type: 'uint',
        bits: 32
      }, {
        name: 'option',
        type: 'array'
      }]
    };
  });
