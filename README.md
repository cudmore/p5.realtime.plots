# p5.realtime.plots
A node server that pushes serial/arduino data to web based clients who plot the data with p5.js

### v1 (20160214)

Simple version with a node server that reads 3 analog values from arduino and pushes this data via websockets to connected clients who plot with p5.js

In this version, data is one way coming from arduino through serial to node server and on to clients via web sockets. The clients can only view data (they cannot control the arduino).

  - node_serial_server.js is a node server that reads serial input from arduino and passes it to connected clients. This is the server that clients to connect to with ws://.
  - /public/index.html is the web page that clients load to connected to node server and see realtime plots via client-side javascript. This file can be opened in a browser either locally as a file:// or served via http:// by a web server (use python SimpleHTTPServer for debugging). The file needs to be modified to point to the ws:// ip address being served by node_serial_server.js
  - /platformio/ contains folders and files to compile and upload code to an arduino. main.cpp is the arduino source code.
  - 
~~~
./v1/
├── node_serial_server.js
├── platformio
│   ├── lib
│   │   └── readme.txt
│   ├── platformio.ini
│   └── src
│       └── main.cpp
└── public
    └── index.html
~~~

### v2 (future)

Make the communication bi-directional. Add client side web interface to control arduino via the node server.
