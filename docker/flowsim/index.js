#!/usr/bin/nodejs
(function(){
var ovsdb = require('./ovsdb');

var ovsdb1 = new ovsdb.Ovsdb({port:4444, ip: '192.168.10.2'});
ovsdb1.connect();
ovsdb1.listDB();
})();
