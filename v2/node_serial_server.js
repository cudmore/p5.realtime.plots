#!/usr/bin/env node

// Author: Robert Cudmore
// Date: 20160214
// Web: http://robertcudmore.org
// Purpose:
//	(1) connect to an arduino via serial port and read all incoming serial data (see main.cpp)
//	(2) run a node WebSocketServer and pass serial data to connected  clients (see index.thml)

portName = '/dev/ttyACM1' //on raspberry pi, uno is connected on serial port /dev/ttyACM0

var WebSocketServer = require('ws').Server;
var serialport = require('serialport');

console.log("===\nStarting javascript server node_serial_server.js");

var SerialPort = serialport.SerialPort;
 
// list serial ports:
console.log("Listing available serial ports:");
serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log('   serial port: ' + port.comName);
  });
});

//
// WebSocketServer (different from an http server)
var SERVER_PORT = 8081;               // port number for the webSocket server
var wss = new WebSocketServer({port: SERVER_PORT}); // the webSocket server
var connections = new Array;          // list of connections to the server

// web socket event listeners
wss.on('connection', wss_on_connection);
 
function wss_on_connection(client) {
	clientIP = client.upgradeReq.connection.remoteAddress;
	console.log("wss_on_connection(): New Connection from " + clientIP); // you have a new client


	connections.push(client); // add this client to the connections array
	
	client.on('message', sendToSerial); // when a client sends a message, pass it on to arduino
	
	client.on('close', function() { // when a client closes its connection
 		console.log("wss_on_close()");
 		var position = connections.indexOf(client); // get the client's position in the array
 		connections.splice(position, 1); // and delete it from the array
	});
}

//when a connected wss client sends us a command
//pass it on to the serial arduino (not used in this example)
function sendToSerial(data) {
	console.log("sendToSerial(): '" + data + "'");
	mySerialPort.write(data);
}

// serial data has been received, broadcast to all wss clients
//this will trigger a socket.onmessage in each connected client
function broadcast_to_wss_clients(data) {
	for (myConnection in connections) {   // iterate over the array of connections
		connections[myConnection].send(data); // send the data to each connection
 }
}

//
// open the serial port and parse all incoming data based on line breaks "\n"
console.log("opening serial port " + portName + 'and listening for line breaks...');
var mySerialPort = new SerialPort(portName, {
	baudRate: 115200,
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\n")
});

// define serial callbacks
mySerialPort.on('open', serial_on_open);
mySerialPort.on('data', serial_on_data); //when serial data is received
mySerialPort.on('close', serial_on_close);
mySerialPort.on('error', serial_on_error);

function serial_on_open() {
	console.log('serial_on_open: ' + mySerialPort.options.baudRate);
}
 
function serial_on_data(data) {
	//'data' is what we just received on the serial, it is coming from the arduino
	//format is specified in main.cpp and is: millis(), a0, a1, a2
	//prepend our server time
	var d = new Date();
	sendThisData = d.toLocaleTimeString() + ',' + data;   
	// if there are webSocket connections, send the serial data to each
	if (connections.length > 0) {
		broadcast_to_wss_clients(sendThisData);
	}
}
 
function serial_on_close() {
	console.log('serial_on_close');
}
 
function serial_on_error(error) {
	console.log('serial_on_error: ' + error);
}

