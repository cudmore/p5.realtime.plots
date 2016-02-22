#(1) need to use eventlet, otherwise .run() defaults to gevent() which is SLOW
#(2) monkey_path() wraps some functions to call eventlet equivalents
#   in particule time.sleep() is redirected to coresponding eventlet() call
#
from flask import Flask, render_template
from flask.ext.socketio import SocketIO, emit
import random # testing
import time, random
from datetime import datetime
from threading import Thread
import eventlet

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.debug = True
socketio = SocketIO(app)

#namespace = '/test'
namespace = ''

thread = None #second thread used by background_thread()

#see: https://github.com/miguelgrinberg/Flask-SocketIO/issues/192
eventlet.monkey_patch()

def background_thread():
    """Example of how to send server generated events to clients."""
    while True:
        time.sleep(.05)
        response = MakeServerResponse()        
        #print 'background_thread:' + response['currenttime']
        socketio.emit('newdata', {'data': response['currenttime']}, namespace=namespace)
        socketio.emit('temperatureUpdate', response, namespace=namespace)

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

@app.route('/p5')
def index_highchart():
    return render_template('p5.html')

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

        print('starting server')
        socketio.run(app, host='0.0.0.0', port=5010, use_reloader=True)
        print('finished')
    except:
        print '...exiting'
        raise