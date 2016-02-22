
var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
    fs = require('fs'),
  sys = require('util'),
  exec = require('child_process').exec,
  child;
// Listen on port 8000
app.listen(8000);
// If all goes well when you open the browser, load the index.html file
function handler(req, res) {
    fs.readFile(__dirname+'/../index.html', function(err, data) {
        if (err) {
      // If no error, send an error message 500
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}
 
// When we open the browser establish a connection to socket.io. 
// Every 5 seconds to send the graph a new value.

io.sockets.on('connection', function(socket) {
  setInterval(function(){
    //on debian, use /sys/bus/platform/devices/coretemp.0/hwmon/hwmon1/temp1_input
    //child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
    child = exec("cat /sys/bus/platform/devices/coretemp.0/hwmon/hwmon1/temp1_input", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
	   console.log(stdout);
	   //see: http://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
	   // create Date object for current location
	    d = new Date();
	
	    // convert to msec
	    // add local time zone offset
	    // get UTC time in msec
	    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);

      // You must send time (X axis) and a temperature value (Y axis) 
	  var date = new Date().getTime();
      var temp = parseFloat(stdout)/1000;
      //socket.emit('temperatureUpdate', date, temp); 
      socket.emit('temperatureUpdate', utc, temp); 
    }
  });}, 1000);
});