import serial
import time
from threading import Thread

class bSerial(Thread):

	def __init__(self, socketio):
		super(bSerial, self).__init__()
		self.daemon = True
		self.cancelled = False

		self.socketio = socketio
		self.port = '/dev/ttyUSB0'
		self.baud = 115200
		self.ser = serial.Serial(self.port, self.baud)

	def run(self):
		while not self.cancelled:
			self.update()
			time.sleep(0.05)

	def cancel(self):
		self.cancelled = True

 	def update(self):
		str = self.ser.readline()
		if self.socketio:
			self.socketio.emit('serialdata', str)


	#
	#my functions
	#
	def bPrint(self):
		print self.ser.readline()

	def read(self):
		return self.ser.readline()

	def write(self, str):
		print 'bSerial writing to serial:', str
		self.ser.write(str)

		
		