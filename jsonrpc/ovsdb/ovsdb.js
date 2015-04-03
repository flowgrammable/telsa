
var jrpc = require('../jsonrpc/jsonrpc');
var stats = require('./stats');

var Methods = {
  ListDBs:       'list_dbs',
  GetSchema:     'get_schema',
  Transact:      'transact',
  Cancel:        'cancel',
  Monitor:       'monitor',
  Update:        'update',
  MonitorCancel: 'monitor_cancel',
  Lock:          'lock',
  Steal:         'steal',
  Unlock:        'unlock',
  Locked:        'locked',
  Stolen:        'stolen',
  Echo:          'echo'
};

function OVSDB(socket) {
  this.jrpc = new jrpc.Peer(socket, this.recvRequest);
  this.stats = new stats.Stats();
}

OVSDB.prototype.rx_list_dbs = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.req.listDB++;
};

OVSDB.prototype.rx_get_schema = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.req.getSchema++;
};

OVSDB.prototype.rx_transact = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.req.transact++;
};

OVSDB.prototype.rx_cancel = function(msg) {
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.req.cancel++;
};

OVSDB.prototype.rx_montior = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.req.monitor++;
};

OVSDB.prototype.rx_update = function(msg) {
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.req.update++;
};

OVSDB.prototype.rx_monitor_cancel = function(msg) {
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.req.monitor_cancel++;
};

OVSDB.prototype.rx_lock = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.req.lock++;
};

OVSDB.prototype.rx_steal = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.req.steal++;
};

OVSDB.prototype.rx_unlock = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.req.unlock++;
};

OVSDB.prototype.rx_locked = function(msg) {
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.req.locked++;
};

OVSDB.prototype.rx_stolen = function(msg) {
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.req.stolen++;
};

OVSDB.prototype.rx_echo = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.req.echo++;

  this.peer.response(msg.params, msg.id);
};

OVSDB.prototype.recvRequest = function(msg) {
  switch(msg.method) {
    case Methods.ListDBs:
      this.rx_list_dbs(msg);
      break;
    case Methods.GetSchema:
      this.rx_get_schema(msg);
      break;
    case Methods.Transact:
      this.rx_transact(msg);
      break;
    case Methods.Cancel:
      this.rx_cancel(msg);
      break;
    case Methods.Monitor:
      this.rx_monitor(msg);
      break;
    case Methods.Update:
      this.rx_update(msg);
      break;
    case Methods.MonitorCancel:
      this.rx_monitor_cancel(msg);
      break;
    case Methods.Lock:
      this.rx_lock(msg);
      break;
    case Methods.Steal:
      this.rx_steal(msg);
      break;
    case Methods.Unlock:
      this.rx_unlock(msg);
      break;
    case Methods.Locked:
      this.rx_locked(msg);
      break;
    case Methods.Stolen:
      this.rx_stolen(msg);
      break;
    case Methods.Echo:
      this.rx_echo(msg);
      break;
    default:
      break;
  }
};

OVSDB.prototype.list = function() {
  this.peer.request('list_dbs', [], function(err, res) {
  });
};

OVSDB.prototype.get = function(db_name) {
  this.peer.request('get_schema', [db_name], function(err, res) {
  });
};

OVSDB.prototype.transact = function(db_name, operations) {
  this.peer.request('transact', [db_name, operations], function(err, res) {
  });
};

OVSDB.prototype.monitor = function(db_name, value, reqs) {
  this.peer.request('monitor', [db_name], function(err, res) {
  });
};

OVSDB.prototype.lock = function(lock_name) {
  this.peer.request('lock', [lock_name], function(err, res) {
  });
};

OVSDB.prototype.steal = function(lock_name) {
  this.peer.request('steal', [lock_name], function(err, res) {
  });
};

OVSDB.prototype.unlock = function(lock_name) {
  this.peer.request('unlock', [lock_name], function(err, res) {
  });
};

OVSDB.prototype.echo = function() {
  this.peer.request('echo', [], function(err, res) {
  });
};

exports.OVSDB = OVSDB;

