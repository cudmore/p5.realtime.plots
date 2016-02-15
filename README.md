# p5.realtime.plots
A node server that pushes serial/arduino data to web based clients who plot the data with p5.js

### v1 (20160214)

Simple version with a node server that reads 3 analog values from arduino and pushes this data via websockets to connected clients who plot with p5.js

In this version, data is one way coming from arduino through serial to node server and on to clients via web sockets. The clients can only view data (they cannot control the arduino).

### v2 (future)

Make the communication bi-directional. Add client side web interface to control arduino via the node server.
