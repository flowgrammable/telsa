'use strict';

/**
 * @ngdoc directive
 * @name vizApp.directive:underLine
 * @description
 * # underLine
 */
angular.module('vizApp')
  .directive('underLine', function () {
    return {
      template: '<div ng-transclude></div>',
      restrict: 'E',
      transclude: true,
      link: function postLink(scope, element, attrs) {
        var leftArrowHead = angular.element('<div></div>');
        var rightArrowHead = angular.element('<div></div>');

        leftArrowHead.addClass('leftBitWidthArrow');
        rightArrowHead.addClass('rightBitWidthArrow');

        leftArrowHead.css('position', 'relative');
        leftArrowHead.css('top', '17px');
        
        rightArrowHead.css('position', 'relative');
        rightArrowHead.css('top', '17px');

        element.append(leftArrowHead);
        element.append(rightArrowHead);

        element.addClass('bitWidth');
      }
    };
  });
