'use strict';

/**
 * @ngdoc directive
 * @name vizApp.directive:vizRecord
 * @description
 * # vizRecord
 */

function mkElement(box) {
  var element = angular.element('<div></div>');
  if(box.text) {
    element.text(box.text);
  }
  element.css('width', box.width+'%');
  element.css('float', 'left');
  element.css('text-align', 'center');
  element.css('font-style', 'italic');
  element.css('border-width', '1px');
  element.css('border-style', 'solid');
  element.css('white-space', 'pre');
  if(!box.north) {
    element.css('border-top', 'none');
  }
  if(!box.east) {
    element.css('border-right', 'none');
  }
  if(!box.south) {
    element.css('border-bottom', 'none');
  }
  if(!box.west) {
    element.css('border-left', 'none');
  }
  return element;
}

function addBox(result, width, north, east, south, west) {
  result.push({
    text: ' ',
    width: width / 32 * 100,
    north: north,
    east: east,
    south: south,
    west: west
  });
}

function mkPrefixBoxes(result, prefix, infix, postfix, field) {
  var overlap;
  if(infix > 0 || postfix == 32) {
    addBox(result, prefix, true, true, false, true);
  } else if(postfix > 0) {
    overlap = postfix - field.col;
    if(overlap > 0) {
      addBox(result, overlap, true, false, false, true);
      if(prefix-overlap > 0) {
        addBox(result, prefix-overlap, true, true, true, false);
      }
    } else {
      addBox(result, prefix, true, true, true, true);
    }
  } else {
    addBox(result, prefix, true, true, true, true);
  }
}

function mkInfixBoxes(result, prefix, infix, postfix, field) {
  // FIXME: this logic is busted
  _(infix).times(function(i) {
    if(i===0) {
      if(prefix > 0) {
        addBox(result, 32-prefix, true, false, infix > 1 ? false : true, true);
        addBox(result, prefix, true, true, infix > 1 ? false : true, true);
      } else {
        if(postfix > 0) {
          addBox(result, postfix, true, false, false, true);
          addBox(result, 32-postfix, true, true, true, false);
        } else {
          addBox(result, 32, true, true, infix > 1 ? false : true, true);
        }
      }
    } else if (i < infix - 1) {
      addBox(result, 32, false, true, false, true);
    } else {
      if(postfix > 0) {
        addBox(result, postfix, false, false, false, true);
        addBox(result, 32-postfix, false, true, true, false);
      } else {
        addBox(result, 32, false, true, true, true);
      }
    }
  });
}

function mkPostfixBoxes(result, prefix, infix, postfix, field) {
  var overlap;
  if(infix > 0 || prefix === 32) {
    addBox(result, postfix, false, true, true, true);
  } else if(prefix > 0) {
    overlap = postfix - field.col;
    if(overlap > 0) {
      if(postfix-overlap > 0) {
        addBox(result, postfix-overlap, true, false, true, true);
      }
      addBox(result, overlap, false, true, true, false);
    } else {
      addBox(result, postfix, true, true, true, true);
    }
  } else {
    addBox(result, postfix, true, true, true, true);
  }
}

function mkBoxes(field) {
  var overlap;
  var result = [];
  var prefix = 0;
  var infix = 0;

  if(field.bits + field.col > 32) {
    prefix = 32 - field.col;
  } else {
    prefix = field.bits;
  }
  if(field.bits - prefix > 32) {
    infix  = Math.floor((field.bits - prefix) / 32);
  }
  var postfix = field.bits - prefix - (32 * infix);

  console.log('-------------------------');
  console.log('Field: %s', field.name);
  console.log('Pos: %s', field.col);
  console.log('Prefix: %d', prefix);
  console.log('Infix: %d', infix);
  console.log('Postfix: %d', postfix);
  console.log('-------------------------');

  // A box starts above bit position 0
  if(prefix > 0) {
    mkPrefixBoxes(result, prefix, infix, postfix, field);
  }
  // A box starts at bit position 0 and ends at bit position 32
  if(infix > 0) {
    mkInfixBoxes(result, prefix, infix, postfix, field);
  }
  // A box ends before bit position 32
  if(postfix > 0) {
    mkPostfixBoxes(result, prefix, infix, postfix, field);
  }
  return result;
}

function setName(field, pixelWidth) {
  var width, max;
  max = _(field.boxes).max(function(box) { return box.width; });
  width = max.width / 100 * pixelWidth;
  if(field.name.length * 10 < width) {
    max.text = field.name;
  } else if(10 < width) {
    max.text = field.name.substring(0, Math.floor(width/10));
  }
}

function prepare(fields, width) {
  var pos = 0;
  var max;
  _(fields).each(function(field) {
    field.row = Math.floor(pos / 32);
    field.col = pos % 32;
    pos += field.bits;
    field.boxes = mkBoxes(field);
    setName(field, width);
  });
}

angular.module('vizApp')
  .directive('vizRecord', function () {
    return {
      restrict: 'E',
      scope: {
        src: '='
      },
      link: function(scope, element) {
        var larrow = angular.element('<div></div>');
        larrow.css('position', 'relative');
        larrow.css('top', '17px');
        larrow.css('width', '0');
        larrow.css('height', '0');
        larrow.css('border-top', '3px solid transparent');
        larrow.css('border-bottom', '3px solid transparent');
        larrow.css('border-right', '7px solid');
        larrow.css('float', 'left');
        element.append(larrow);
        var rarrow = angular.element('<div></div>');
        larrow.css('position', 'relative');
        larrow.css('top', '17px');
        rarrow.css('width', '0');
        rarrow.css('height', '0');
        rarrow.css('border-top', '3px solid transparent');
        rarrow.css('border-bottom', '3px solid transparent');
        rarrow.css('border-left', '7px solid');
        rarrow.css('float', 'right');
        element.append(rarrow);
        var head = angular.element('<div>32 bits</div>');
        head.css('text-align', 'center');
        head.css('border-width', '1px');
        head.css('border-style', 'dashed');
        head.css('border-top', 'none');
        head.css('border-left', 'none');
        head.css('border-right', 'none');
        head.css('margin-bottom', '10px');
        element.append(head);
        prepare(scope.src.fields, element.parent()[0].offsetWidth);
        _(scope.src.fields).each(function(field) {
          console.log('--------------------');
          console.log('Field: %s', field.name);
          _(field.boxes).each(function(box) {
            console.log('Box: %f - ', box.width, box.north, 
                        box.east, box.south, box.west);
            element.append(mkElement(box));
          });
          console.log('--------------------');
        });
        var tail = angular.element('<div></div>');
        tail.css('clear', 'both');
        element.append(tail);
      }
    };
  });
