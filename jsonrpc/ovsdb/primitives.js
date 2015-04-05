
///////////////////////////////// Type Assertions //////////////////////////////

function assertInteger(name, val) {
  if(_(val).isUndefined()) {
    throw (name + ' is undefined');
  }
  if(!_(val).isFinite()) {
    throw (name+' not integer: '+val);
  }
}

function isInteger(val) {
  return _(val).isFinite();
}

function assertNumber(name, val) {
  if(_(val).isUndefined()) {
    throw (name + ' is undefined');
  }
  if(!_(val).isNumber()) {
    throw (name+' not number: '+val);
  }
}

function isNumber(val) {
  return _(val).isNumber();
}

function assertBoolean(name, val) {
  if(_(val).isUndefined()) {
    throw (name+' is undefined');
  }
  if(!_(val).isBoolean()) {
    throw (name+' not boolean: '+val);
  }
}

function isBoolean(val) {
  return _(val).isBoolean();
}

function assertString(name, str) {
  if(_(str).isUndefined()) {
    throw (name+' is undefined');
  }
  if(!_(str).isString()) {
    throw (name+' not a string: '+str);
  }
}

function isString(str) {
  return _(str).isString();
}

function assertId(name, id) {
  assertString(name, id);
  if(!/[a-zA-Z_][a-zA-Z_0-9]*/.test(id)) {
    throw (name+' not identifier: '+id);
  }
}

function isId(id) {
  return isString(id) && !/[a-zA-Z_][a-zA-Z_0-9]*/.test(id);
}

function assertVersion(name, ver) {
  assertString(name, ver);
  if(!/[0-9]+\.[0-9]+\.[0-9]+/.test(ver)) {
    throw (name+ 'not version: '+ver);
  }
}

function isVersion(ver) {
  return isString(ver) && /[0-9]+\.[0-9]+\.[0-9]+/.test(ver);
}

function assertObject(name, obj) {
  if(_(obj).isUndefined()) {
    throw (name+' is undefined');
  }
  if(!_(obj).isObject()) {
    throw (name+' not an object: '+obj);
  }
}

function isObject(obj) {
  return _(obj).isObject();
}

function assertArray(name, array) {
  if(_(array).isUndefined()) {
    throw (name+' is undefined');
  }
  if(!_(array).isArray()) {
    throw (name+' not an array: '+array);
  }
}

function isArray(array) {
  return _(array).isArray();
}

function assertUntil(name, until) {
  assertString(name, until);
  if(!(until === '==' || until === '!=')) {
    throw (name+'not an until: '+until);
  }
}

function isUntil(until) {
  return until === '==' || until === '!=';
}

function assertColumns(columns) {
  assertArray('columns', columns);
  _(columns).each(function(column) {
    assertString(column);
  });
}

function isColumns(cols) {
  return _(cols).isArray() && 
          _(cols).every(function(col) {
            return isString(col);
          });
}

///////////////////////////// Types ///////////////////////////////

function isAtom(atom) {
  return _(atom).isString() || _(atom).isNumber() || _(atom).isBoolean();
}

function assertAtom(atom) {
  if(!isAtom(atom)) {
    throw ('Not atom: '+atom);
  }
}

function assertAtoms(atoms) {
  _(atoms).each(function(atom) {
    assertAtom(atom);
  });
}

function getArray(args) {
  var result = [];
  for(var i=0; i<args.length; ++i) {
    result.push(args[i]);
  }
  return result;
}

exports.set = function() {
  // Initialize the set and convert the arguments
  var set = [];
  var array = getArray(arguments);
  // empty set is legit
  if(array.length === 0) {
  } else if(array.length === 1) {
    if(_(array[0]).isArray()) {
      assertAtoms(array[0]);
      set = array[0];
    } else if(isAtom(array[0])) {
      set.push(array[0]);
    } else {
      throw 'Bad arguments';
    }
  } else if(array.length > 1 && 
            _(array).every(function(elem) {
              return isAtom(elem);
            })) {
    set = array;
  } else {
    throw 'Set failure';
  }
  return ['set', set];
};

function isSet(set) {
  return isAtom(set) || (
            _(set).isArray() && set.length === 2 && set[0] === 'set' &&
            _(set[1]).isArray() && _(set[1]).every(function(elem) {
              return isAtom(elem);
            })
          );
}

function assertSet(set) {
  if(!isSet(set)) {
    throw ('Not set: '+set);
  }
}

exports.pair = function(lhs, rhs) {
  assertAtom(lhs);
  assertAtom(rhs);
  return [lhs, rhs];
};

function isPair(pair) {
  return _(pair).isArray() && pair.length === 2 &&
         isAtom(pair[0]) && isAtom(pair[1]);
}

function assertPair(pair) {
  if(!isPair(pair)) {
    throw ('Not pair: '+pair);
  }
}

function assertPairs(pairs) {
  _(pairs).each(function(pair) {
    assertPair(pair);
  });
}

exports.map = function() {
  var map = [];
  var array = getArray(arguments);
  // empty set is legit
  if(array.length === 0) {
  } else if(array.length === 1) {
    if(_(array[0]).isArray()) {
      assertPairs(array[0]);
      set = array[0];
    } else if(isPair(array[0])) {
      set.push(array[0]);
    } else {
      throw 'Bad arguments';
    }
  } else if(array.length > 1 && 
            _(array).every(function(elem) {
              return isPair(elem);
            })) {
    set = array;
  } else {
    throw 'Map failure';
  }

  return ['map', map];
};

function isMap(map) {
  return _(map).isArray() && map.length === 2 && map[0] === 'map' &&
         _(map[1].isArray()) && _(map[1]).every(function(pair) {
           // FIXME should also check pair types are same
           return isPair(pair);
         });
}

function assertMap(map) {
  if(!isMap(map)) {
    throw ('Not map: '+map);
  }
}

function isValue(value) {
  return isAtom(value) || isSet(value) || isMap(value);
}

function assertValue(value) {
  if(!isValue(value)) {
    throw ('Not value: '+value);
  }
}

