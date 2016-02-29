
{% filter markdown %}

### Required python libraries

~~~
pip install Flask
pip install flask-socketio
pip install eventlet #seems to be fastest python socketio option
pip install Flask-Misaka
~~~

### [platformio][1] to compile and upload code to Arduino

~~~
platformio run
platformio run --target upload
platformio run --target clean

#a serial port monitor
platformio serialports monitor -p /dev/ttyUSB0 -b 115200 

~~~

### SimpleHTTPServer

Run a http server inside any folder using [SimpleHTTPServer][2]

~~~
python -m SimpleHTTPServer
~~~

### [Python serial][3]

~~~
import serial
ser = serial.Serial('/dev/ttyUSB0', 115200)  # open serial port
print(ser.name)         # check which port was really used
ser.write(b'hello')     # write a string
ser.close()             # close port
~~~

### AccelStepper

### Links

  - [flask-socketio][5]
  - [eventlet][6]
  - [platormio][1]
  - [simplehttpserver][2]
  - [pyserial][3]
  - [flask-misaka][4]
  - platform io [serial port monitor][7]
  - [AccelStepper][8] non blocking arduino library to control stepper motor
    
[1]: http://platformio.org/#!/
[2]: https://docs.python.org/2/library/simplehttpserver.html
[3]: https://pythonhosted.org/pyserial/shortintro.html
[4]: https://flask-misaka.readthedocs.org
[5]: https://flask-socketio.readthedocs.org/en/latest/
[6]: http://eventlet.net
[7]: http://docs.platformio.org/en/latest/userguide/cmd_serialports.html#platformio-serialports-monitor
[8]: http://www.airspayce.com/mikem/arduino/AccelStepper/index.html

{% endfilter %}
