'use strict';

describe('Directive: underLine', function () {

  // load the directive's module
  beforeEach(module('vizApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<under-line></under-line>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the underLine directive');
  }));
});
