'use strict';

// node
// parent
// children

function buildChildren(node) {
  var element = angular.element('<li>');
  if(node.icon && node.icon.length > 0) {
    var icon = angular.element('<i>');
    icon.addClass('fa');
    icon.addClass(node.icon);
    element.append(icon);
  }
  if(node.text && node.text.length > 0) {
    element.text(node.text);
    element.on('click', function(a, b) { 
      element.scope().select(node.text);
    });
  }
  if(node.children && node.children.length > 0) {
    var children = angular.element('<ul>');
    children.addClass('fa-ul');
    _(node.children).each(function(child) {
      children.append(buildChildren(child));
    });
    element.append(children);
  }
  return element;
};

function buildRoot(node) {
  var element = angular.element('<ul>');
  element.addClass('fa-ul');
  if(node.icon && node.icon.length > 0) {
    var icon = angular.element('<i>');
    icon.addClass('fa');
    icon.addClass(node.icon);
    element.append(icon);
  }
  _(node.children).each(function(child) {
    element.append(buildChildren(child));
  });
  return element;
}

/**
 * @ngdoc directive
 * @name vizApp.directive:treeView
 * @description
 * # treeView
 */
angular.module('vizApp')
  .directive('treeView', function () {
    return {
      restrict: 'E',
      scope: {
        tree: '=',
        select: '&'
      },
      controller: function($scope) {
        $scope.foo = function() { console.log('foo'); };
      },
      link: function postLink(scope, element, attrs) {
        element.append(buildRoot(scope.tree));
      }
    };
  });
