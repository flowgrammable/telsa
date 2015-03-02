'use strict';

/**
 * @ngdoc function
 * @name vizApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the vizApp
 */
angular.module('vizApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
