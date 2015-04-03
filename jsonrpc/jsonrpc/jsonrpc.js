
var uuid = require('uuid');
var _    = require('underscore');
var buf  = require('./buffer');

function Request(method, params) {
  this.method = method;
  this.params = params;
  this.id     = uuid.v4(); 
}

function Respone(result, id, error) {
  this.result = result;
  this.error  = error || null;
  this.id     = id;
}

function Notify(method, params) {
  this.method = method;
  this.params = params;
  this.id     = null;
}

function isRequest(msg) {
  return !_(msg.method).isUndefined() && _(msg.method).isString() &&
         !_(msg.params).isUndefined() && _(msg.params).isArray() &&
         !_(msg.id).isUndefined();
}

function isNotification(msg) {
  // assumes its a request
  return msg.id === null;
}

function isResponse(msg) {
  return !_(msg.result).isUndefined() &&
         !_(msg.error).isUndefined() &&
         !_(msg.id).isUndefined();
}

function Peer(socket, reqCB, notCB, destroy) {
  // peer socket we're managing
  this.socket = socket;
  // socket buffer for msg formation
  this.buffer = new buf.Buffer();
  // who to call for new requests
  this.requestCB = reqCB;
  // who to call for notifications
  this.notifyCB  = notCB;

  this.destroy = destroy;

  this.requests = {};

  var that = this;
  socket.on('data', function(data) {
    try {
      _(that.buffer.read(data)).each(function(msg) {
        if(isRequest(msg)) {
          if(isNotification(msg)) {
            that.notifyCB(msg);
          } else {
            that.requestCB(msg);
          }
        } else if(isResponse(msg)) {
          if(_(that.requests).has(msg.id)) {
            that.requests[msg.id].callback(msg.error, msg.result);
            delete that.requests[msg.id];
          } else {
            console.log('unknown response');
          }
        } else {
          throw 'Not req|res|not';
        }
      });
    } catch(e) {
      // the steam is busted
      console.log(e);
      socket.destroy();
      this.destroy();
    }
  });

  socket.on('end', function() {
  });
}

// JSON serialization for a msg onto a socket
Peer.prototype.send = function(msg) {
  this.socket.write(JSON.stringify(msg));
};

Peer.prototype.request = function(method, params, cb) {
  // Construct the message
  var msg = new Request(method, params, cb);
  // Remember the request transaction
  this.requests[msg.id] = {
    msg: msg,
    callback: cb
  };
  // Send the msg
  this.send(msg);
};

Peer.prototype.response = function(result, id, error) {
  this.send(new Response(result, id, error));
};

Peer.prototype.notify = function(method, params) {
  this.send(new Notify(method, params));
};

exports.Peer = Peer;

