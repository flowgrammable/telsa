'use strict';

/**
 * @ngdoc function
 * @name vizApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vizApp
 */
angular.module('vizApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
