###v2 Readme

This code is in ~/Sites/p5.realtime.plots/v2

~~~
tree -I "node_modules" .
├── node_serial_server.js
├── platformio
│   ├── lib
│   │   └── readme.txt
│   ├── platformio.ini
│   └── src
│       └── main.cpp
├── public
│   └── index.html
└── readme_v2.md
~~~

####I am going to make a parallel node server and .html to run CPU temperature from:

https://medium.com/@cyprusglobe/raspberry-pi-tutorial-plot-temperature-of-the-cpu-with-node-js-using-highcharts-59749ca29f0f#.byrl3t1er


####Run SimpleHTTPServer

~~~
cd public
python -m SimpleHTTPServer
~~~
