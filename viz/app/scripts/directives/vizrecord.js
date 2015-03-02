'use strict';

/**
 * @ngdoc directive
 * @name vizApp.directive:vizRecord
 * @description
 * # vizRecord
 */
angular.module('vizApp')
  .directive('vizRecord', function () {
    return {
      templateUrl: 'views/vizRecord.html',
      restrict: 'E',
      scope: {
        src: '='
      },
      link: function(scope, element, attrs) {
        _(scope.src.fields).each(function(field) {
          var elem = angular.element('<div></div>');
          var postfix = field.type === 'array' ? '[]' : '';
          elem.text(field.name + postfix);
          if(field.type === 'uint') {
            elem.addClass('uint');
          } else {
            elem.addClass('composite');
          }
          element.append(elem);
        });
      }
    };
  });
