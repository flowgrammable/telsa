
///////////////////////////////// Type Assertions //////////////////////////////

function assertInteger(name, val) {
  if(_(val).isUndefined()) {
    throw (name + ' is undefined');
  }
  if(!_(val).isFinite()) {
    throw (name+' not integer: '+val);
  }
}

function assertBoolean(name, val) {
  if(_(val).isUndefined()) {
    throw (name+' is undefined');
  }
  if(!_(val).isBoolean()) {
    throw (name+' not boolean: '+val);
  }
}

function assertObject(name, obj) {
  if(_(obj).isUndefined()) {
    throw (name+' is undefined');
  }
  if(!_(obj).isObject()) {
    throw (name+' not an object: '+obj);
  }
}

function assertString(name, str) {
  if(_(str).isUndefined()) {
    throw (name+' is undefined');
  }
  if(!_(str).isString()) {
    throw (name+' not a string: '+str);
  }
}

function assertArray(name, array) {
  if(_(array).isUndefined()) {
    throw (name+' is undefined');
  }
  if(!_(array).isArray()) {
    throw (name+' not an array: '+array);
  }
}

function assertUntil(name, until) {
  assertString(name, until);
  if(!(until === '==' || until === '!=')) {
    throw (name+'not an until: '+until);
  }
}

function assertColumns(columns) {
  assertArray('columns', columns);
  _(columns).each(function(column) {
    assertString(column);
  });
}

///////////////////////////// Types ///////////////////////////////

function isAtom(atom) {
  return _(atom).isString() || _(atom).isNumber() || _(atom).isBoolean();
}

function isSet(set) {
  return isAtom(set) || (
            _(set).isArray() && set.length === 2 && set[0] === 'set' &&
            _(set[1]).isArray() && _(set[1]).every(function(elem) {
              return isAtom(elem);
            })
          );
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
            }) {
    set = array;
  } else {
    throw 'Set failure';
  }
  return ['set', set];
}

function isPair(pair) {
  return _(pair).isArray() && pair.length === 2 &&
         isAtom(pair[0]) && isAtom(pair[1]);
}

function isMap(map) {
  return _(map).isArray() && map.length === 2 && map[0] === 'map' &&
         _(map[1].isArray()) && _(map[1]).every(function(pair) {
           // FIXME should also check pair types are same
           return isPair(pair);
         });
}

function isValue(value) {
  return isAtom(value) || isSet(value) || isMap(value);
}

exports.set = function() {
  var set = [];

  if(arguments.length === 1) {
  } else if(arguments.length > 1) {
  }

  return ['set', set];
};

/////////////////////////////// Operations ///////////////////////////////

exports.insert = function(params) {
  // basic insert validation
  assertObject('insert.params', params);
  assertString('table', params.table);
  assertObject('row', params.row);
  // build the base object
  var insert = {
    op:    "insert",
    table: params.table,
    row:   params.row
  };
  // determine if a named uuid is present and valid 
  if(params.uuid_name) {
    assertString('uuid-name', params.uuid_name);
    insert["uuid-name"] = params.uuid_name;
  }
  // thats it ...
  return insert;
};

exports.select = function(params) {
  // basic select validation
  assertObject('select.params', params);
  assertString('table', params.table);
  // build the base object
  var select = {
    op: "select",
    table: params.table,
    where: []
  };
  // validate the where clause if present ..
  if(params.where) {
    assertArray('where', params.where);
    update.where = params.where;
  }
  // validate the target columns if present ..
  if(params.columns) {
    assertColumns(params.columns);
    select.columns = columns;
  }
  // thats it ...
  return select;
};

exports.update = function(params) {
  // basic update validation
  assertObject('update.params', params);
  assertString('table', params.table);
  assertObject('row', params.row);
  // build the base object
  var update = {
    op:    "update",
    table: params.table,
    where: [],
    row:   params.row
  };
  // validate the where clause if present ..
  if(params.where) {
    assertArray('where', params.where);
    update.where = params.where;
  }
  // thats it ...
  return update;
};

exports.mutate = function(params) {
  // basic mutate validation
  assertObject('mutate.params', params);
  assertString('table', params.table);
  var mutate = {
    op:        "mutate",
    table:     params.table,
    where:     [],
    mutations: []
  };
  // validate the where clause if present ..
  if(params.where) {
    assertArray('where', params.where);
    mutate.where = params.where;
  }
  // validate the mutations clause if present ..
  if(params.mutations) {
    assertArray('mutations', params.mutations);
    mutate.mutations = params.mutations;
  }
  // thats it ...
  return mutate;
};

exports.del = function(params) {
  // basic mutate validation
  assertObject('delete.params', params);
  assertString('table', params.table);
  var del = {
    op:    "delete",
    table: params.table,
    where: []
  };
  // validate the where clause if present ..
  if(params.where) {
    assertArray('where', params.where);
    del.where = params.where;
  }
  // thats it ...
  return del;
};

exports.wait = function(params) {
  // basic wait validation
  assertObject('wait.params', params);
  assertString('table', params.table);
  assertUntil('until', params.until);
  var wait = {
    op:      "wait",
    table:   params.table,
    where:   [],
    columns: [],
    until:   params.until,
    rows:    []
  };
  // validate the timeout if present ..
  if(params.timeout) {
    assertInteger('timeout', params.timeout);
    wait.timeout = params.timeout;
  }
  // validate the where clause if present ..
  if(params.where) {
    assertArray('where', params.where);
    wait.where = params.where;
  }
  // validate the columns clause if present ..
  if(params.columns) {
    assertColumns(params.columns);
    wait.columns = params.columns;
  }
  // validate the rows clause if present ..
  if(params.rows) {
    assertArray('rows', params.rows);
    wait.rows = params.rows;
  }
  // thats it ...
  return wait;
};

exports.commit = function(params) {
  // basic commit validation
  assertBoolean('durable', params.durable);
  // return the simple commit object
  return {
    op: "commit",
    durable: params.durable
  };
};

exports.abort = function() {
  // return the simple abort object
  return { op: "abort" };
};

exports.comment = function(params) {
  // basic comment validation
  assertObject('comment.params', params);
  assertString('comment', params.comment);
  // return the simple comment object
  return {
    op: "comment",
    comment: params.comment
  };
};

exports.assert = function(params) {
  // basic assert validation
  assertObject('assert.params', params);
  assertString('lock', params.lock);
  // return the simple assert object
  return {
    op: "assert",
    lock: params.lock
  };
};

select({
  table: "Open_vSwitch",
  where: [
    equal("ovs_version", "1.0"),
    includes(x, X),
    excludes
  ],
  columns: ["bridges"]
});

//////////////////////// OVSDB Functions //////////////////////////

exports.less = function(col, val) {
  return [col, "<", val];
};

exports.lessEqual = function(col, val) {
  return [col, "<=", val];
};

exports.equal = function(col, val) {
  return [col, "==", val];
};

exports.notEqual = function(col, val) {
  return [col, "!=", val];
};

exports.greaterEqual = function(col, val) {
  return [col, ">=", val];
};

exports.greater = function(col, val) {
  return [col, ">", val];
};

exports.includes = function(col, val) {
  return [col, "includes", val];
};

exports.excludes = function(col, val) {
  return [col, "excludes", val];
};

//////////////////////// OVSDB Mutations //////////////////////////

exports.addTo = function(col, val) {
  return [col, "+=", val];
};

exports.subFrom = function(col, val) {
  return [col, "-=", val];
};

exports.multTo = function(col, val) {
  return [col, "*=", val];
};

exports.divFrom = function(col, val) {
  return [col, "/=", val];
};

exports.modFrom = function(col, val) {
  return [col, "%=", val];
};

exports.insertTo = function(col, val) {
  return [col, "insert", val];
};

exports.deleteFrom = function(col, val) {
  return [col, "delete", val];
};

