'use strict';

/**
 * @ngdoc function
 * @name vizApp.controller:PanelCtrl
 * @description
 * # PanelCtrl
 * Controller of the vizApp
 */
angular.module('vizApp')
  .controller('PanelCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
