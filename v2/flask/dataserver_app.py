#(1) need to use eventlet, otherwise .run() defaults to gevent() which is SLOW
#(2) monkey_path() wraps some functions to call eventlet equivalents
#   in particule time.sleep() is redirected to coresponding eventlet() call
#
from flask import Flask, abort, render_template, send_file
from flask.ext.socketio import SocketIO, emit
#from flaskext.markdown import Markdown
from flask.ext.misaka import Misaka
import random # testing
import os, time, random
from datetime import datetime
from threading import Thread
import eventlet

import bSerial

from settings import APP_ROOT

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.debug = True
app.config['DATA_FOLDER'] = 'data/'

#Markdown(app)
Misaka(app, fenced_code=True)
socketio = SocketIO(app)

#namespace = '/test'
namespace = ''

thread = None #second thread used by background_thread()
ser = None

#see: https://github.com/miguelgrinberg/Flask-SocketIO/issues/192
eventlet.monkey_patch()

#b = bSerial.bSerial(socketio)

def background_thread():
    """Example of how to send server generated events to clients."""
    while True:
        time.sleep(0.5)
        response = MakeServerResponse()        
        #socketio.emit('newdata', {'data': response['currenttime']}, namespace=namespace)
        #socketio.emit('temperatureUpdate', response, namespace=namespace)

        #serialdata = b.read().rstrip() #comes in with \r\n
        #serialdata = serialdata.rstrip()
        #print('serialdata:', serialdata)
        #socketio.emit('serialdata', serialdata, namespace=namespace)

def MakeServerResponse():
    now = datetime.now()
    dateStr = now.strftime("%m/%d/%y")
    timeStr = now.strftime("%H:%M:%S.%f")
    
    response = {}
    response['currentdate'] = dateStr
    response['currenttime'] = timeStr

    response['y'] = random.random()
    response['x'] = time.time()
	
    return response
	
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/readme')
def readme():
    return render_template('readme.md')

#from: http://stackoverflow.com/questions/23718236/python-flask-browsing-through-directory-with-files
@app.route('/', defaults={'req_path': ''})
@app.route('/<path:req_path>')
def dir_listing(req_path):
    # Joining the base and the requested path
    abs_path = os.path.join(APP_ROOT, req_path)
    print('abs_path', abs_path)
    # Return 404 if path doesn't exist
    if not os.path.exists(abs_path):
        print 'dir_listing() returning 404'
        return abort(404)

    # Check if path is a file and serve
    if os.path.isfile(abs_path):
        return send_file(abs_path)

    # Show directory contents
    files = os.listdir(abs_path)
    return render_template('files.html', files=files)

@app.route('/p5')
def index_highchart():
    return render_template('p5.html')

@app.route('/grafica')
def index_grafica():
    return render_template('grafica.html')

@socketio.on('connectArduino', namespace=namespace) #responds to echo
def connectArduino(message):
    emit('my response', {'data': message['data']})
    print 'connectArduino', message['data']

@socketio.on('startarduinoButtonID', namespace=namespace) #responds to echo
def startarduinoButton(message):
    #emit('my response', {'data': message['data']})
    print 'startarduinoButtonID'
    ser.write('startTrial')
    
@socketio.on('stoparduinoButtonID', namespace=namespace) #responds to echo
def stoparduinoButtonID(message):
    #emit('my response', {'data': message['data']})
    print 'stoparduinoButtonID'
    ser.write('stopTrial')
    
@socketio.on('my event', namespace=namespace) #responds to echo
def test_message(message):
    emit('my response', {'data': message['data']})

@socketio.on('my broadcast event', namespace=namespace)
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)

@socketio.on('connect', namespace=namespace)
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace=namespace)
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    try:
        print('starting background thread')
        thread = Thread(target=background_thread)
        thread.daemon  = True; #as a daemon the thread will stop when *this stops
        thread.start()

        ser = bSerial.bSerial(socketio)
        ser.start()
		
        print('starting server')
        socketio.run(app, host='0.0.0.0', port=5010, use_reloader=True)
        print('finished')
    except:
        print '...exiting'
        raise