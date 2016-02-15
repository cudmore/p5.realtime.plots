#!/usr/bin/env node

//uno is /dev/ttyACM0
portName = '/dev/ttyACM0'

var WebSocketServer = require('ws').Server;
var serialport = require('serialport');

console.log("===\nStarting javascript server plot_serial_browser.js");

var SerialPort = serialport.SerialPort;
 
// list serial ports:
console.log("Listing available serial ports:");
serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log('   ' + port.comName);
  });
});

//
// WebSocketServer (different from an http server)
var SERVER_PORT = 8081;               // port number for the webSocket server
var wss = new WebSocketServer({port: SERVER_PORT}); // the webSocket server
var connections = new Array;          // list of connections to the server

// web socket event listeners
wss.on('connection', handleConnection);
 
function handleConnection(client) {
 console.log("New Connection"); // you have a new client
 connections.push(client); // add this client to the connections array
 
 client.on('message', sendToSerial); // when a client sends a message,
 
 client.on('close', function() { // when a client closes its connection
 
 console.log("handleConnection() connection closed"); // print it out
 var position = connections.indexOf(client); // get the client's position in the array
 connections.splice(position, 1); // and delete it from the array
 });
}

// This function broadcasts messages to all webSocket clients
function broadcast(data) {
 for (myConnection in connections) {   // iterate over the array of connections
  connections[myConnection].send(data); // send the data to each connection
 }
}

//
// serial
console.log("reading serial port:" + portName);
// read from serial
var myPort = new SerialPort(portName, {
   baudRate: 115200,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\n")
   //parser: serialport.parsers.readline("")
 });

// define callbacks
myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData); //when serial data is received
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}
 
function sendSerialData(data) {
   var d = new Date();
   sendThisData = d.toLocaleTimeString() + ',' + data;
   //console.log(sendThisData);
   
   // if there are webSocket connections, send the serial data
   // to all of them:
   if (connections.length > 0) {
     broadcast(sendThisData);
   }
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}

//websocket uses this
function sendToSerial(data) {
 console.log("sendToSerial(): '" + data + "'");
 myPort.write(data);
}
