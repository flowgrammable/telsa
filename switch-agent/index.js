#!/usr/bin/env node

var program = require('commander');
var net = require('net');
var _   = require('underscore');

program
  .version('0.0.1')
  .option('-s, --serverIP <type>', 'Server IP address')
  .option('-p, --serverPort <n>', 'Server port', parseInt)
  .parse(process.argv);

if (_.isUndefined(program.serverIP) || _.isUndefined(program.serverPort)) {
    console.log("Missing command-line arguments");
    console.log(process.argv.join(" "));
    process.exit(1);
}

console.log(program.serverIP);
console.log(program.serverPort);


var client = 
    net.connect({
	port: program.serverPort,
	host: program.serverIP
    }, function() { //'connect' listener
	console.log('connected to server!');
	client.write('GET / HTTP/1.1\r\n\r\n');
    });

client.on('data', function(data) {
    console.log(data.toString());
    client.end();
});

client.on('end', function() {
    console.log('disconnected from server');
});
