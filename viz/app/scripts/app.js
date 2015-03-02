'use strict';

/**
 * @ngdoc overview
 * @name vizApp
 * @description
 * # vizApp
 *
 * Main module of the application.
 */
angular
  .module('vizApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/tree', {
        templateUrl: 'views/tree.html',
        controller: 'TreeCtrl'
      })
      .when('/panel', {
        templateUrl: 'views/panel.html',
        controller: 'PanelCtrl'
      })
      .when('/packet', {
        templateUrl: 'views/packet.html',
        controller: 'PacketCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
