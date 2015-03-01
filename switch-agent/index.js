#!/usr/bin/env node

var program = require('commander');
var net = require('net');
var _   = require('underscore');

program
  .version('0.0.1')
  .option('-s, --server-ip <type>', 'Server IP address')
  .option('-p, --server-port <n>', 'Server port', parseInt)
  .option('-w, --wait <milliseconds>', 'Milliseconds to wait', parseInt)
  .parse(process.argv);

if (_.isUndefined(program.serverIp) || _.isUndefined(program.serverPort)) {
  console.log("Missing command-line arguments");
  console.log(process.argv.join(" "));
  process.exit(1);
}

function log(extra) {
  console.log('-----------client------------');
  console.log('dst: '+program.serverIp+':'+program.serverPort);
  console.log('wait: '+program.wait);
  console.log('-----------------------------');
  console.log(extra.join('\n'));
  console.log('=============================');
}

var client = net.connect({
  port: program.serverPort,
  host: program.serverIp
}, function() { //'connect' listener
  log(['Connected to server']);
  setTimeout(function() {
    log(['Sending data']);
    client.write('GET / HTTP/1.1\r\n\r\n');
  }, program.wait);
});

client.on('data', function(data) {
  log(['recv data', data.toString()]);
  client.end();
});

client.on('end', function() {
  log(['Disconnected from server']);
});
