'use strict';

/**
 * @ngdoc directive
 * @name uiApp.directive:ietfPacket
 * @description
 * # ietfPacket
 */
angular.module('uiApp')
  .directive('ietfPacket', function () {
    return {
      templateUrl: 'views/ietfPacket.html',
      restrict: 'E',
      scope: {
        attrs: '='
      },
      controller: function($scope) {
        var idx = 0;
        _($scope.attrs).each(function(attr) {
          attr.width = ((attr.bits / 32)*100).toString() + '%';
          attr.clear = (idx >= 32);
          idx = (idx + attr.width ) % 32;
        });
      }
    };
  });
