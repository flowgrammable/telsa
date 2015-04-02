#!/usr/local/bin/node
(function(){
var ovsdb = require('./ovsdb');
var ovsdb1 = new ovsdb.Ovsdb({port:4444, ip: '192.168.10.2'});
console.log(ovsdb1.toString());
ovsdb1.connect();
ovsdb1.listDB();
setTimeout(function(){
ovsdb1.getSchema('Open_vSwitch');
}, 3000);
})();
