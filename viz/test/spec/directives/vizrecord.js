'use strict';

describe('Directive: vizRecord', function () {

  // load the directive's module
  beforeEach(module('vizApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<viz-record></viz-record>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the vizRecord directive');
  }));
});
