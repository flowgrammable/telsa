'use strict';

/**
 * @ngdoc service
 * @name flowsimApp.socket
 * @description
 * # socket
 * Factory in the flowsimApp.
 */
angular.module('flowsimApp')
  .factory('socket', function (socketFactory) {
    // Service logic
    // ...
    var socket = socketFactory();
    socket.forward('broadcast');
    return socket;
  });
