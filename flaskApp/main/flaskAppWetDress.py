from flask import Flask, Blueprint
from flask_cors import CORS, cross_origin
from flask import send_file, jsonify
from random import randint, random
import serial
import random
import os
import base64
import json
import numpy as np
import sys
import time
import datetime



flaskAppWetDress = Blueprint('flaskAppWetDress', __name__)
debug = True
port = '/dev/cu.usbmodem1411'

portConfirmed = False
ser = None

try:
	ser = serial.Serial('COM7',9600, bytesize=8, parity=serial.PARITY_NONE, stopbits=1, timeout=.1)
	portConfirmed = True
	
	if debug:
		print("---------------CAUTION---------------")
		print("ARDUINO DETECTED! But you are running on debug mode - NO DATA WILL BE READ FROM THE ARDUINO\n",
		"If you want to receive data, change the 'debug' variable to 'false'")
		print("---------------CAUTION---------------")
	
except serial.serialutil.SerialException:
	if not debug:
		print("--------------------------------------")
		print("FATAL ERROR! Receiver not detected.\nIf you are debugging the program, make sure the 'debug' variable is set to 'True'\n",
		"Otherwise, compare the PORT of the receiver against the 'COM' value defined in the 'ser' variable.", file=sys.stderr)
		print("--------------------------------------")
		quit()

if debug and not portConfirmed:
	print("DEBUG MODE: All data will be randomly generated. If you want to rely on live telemetry data. Make sure the 'debug' variable is set to 'False'")

def get_data():
		ibuffer = ""  # Buffer for raw data waiting to be processed
		if not debug:	
			while True:
				try:
					# Best between .1 and 1
					data = ser.read(4096)  # May need to adjust read size
					#print(data, "\n----------------------------------\n")
					data = data.decode('cp1252').split("\x00")[-1]
					ibuffer += data  # Concat data sets that were possibly split during reading
					if '\r\n' in ibuffer:  # If complete data set
						line = ibuffer.split('\r\n')[-2]  # Split off first completed set
						print(line)
						yield line.strip('\r\n')  # Sanitize and Yield data
				except UnicodeDecodeError:
					print("DECODE ERROR LOGGED")
		else:
			while True:
				'''
				data = (str(randint(30, 90)), ' ', str(randint(30,90)), ' ', str(randint(30,90)), ' ', str(randint(30,90)), ' ', 
					str(randint(0,300)), ' ', str(randint(0,300)),' ', str(randint(0,300)), ' ',
					str(randint(0, 2)), ' ', str(randint(0, 90)), ' ', str(randint(0,1)), ' ',
					str(randint(0, 1)))
				'''
				
				data = (str(randint(0, 40)), ' ', str(randint(0,40)), ' ',
					str(randint(450,1100)), ' ', str(randint(450,1100)),' ',
					str(randint(0, 90)), ' ', str(randint(0,3)), ' ',
					str(randint(0, 1)))
				data = str().join(data)
				#print(data)
				yield data  # Sanitize and Yield data
				


#@flaskApp.route("/")
#@cross_origin(supports_credentials=True)
#@flaskApp.before_app_first_request
def home():
#Stage Altitude accelerationX accelerationY accelerationZ angleX angleY angleZ latitude longitude
	print("CALLED")
	global TC1
	global TC2
	global TC3
	global TC4
	global PT1
	global PT2
	global PT3
	global CriticalValue
	global LC1
	global LC2
	global disconnectState
	global BallValve
	global isVenting
	global timestamp

	ser_data = get_data()
	while True:
		if debug:
			time.sleep(.1)
			
		data = next(ser_data).strip(" ").split(' ')
		
		if(len(data) >= 6):
			print(data)
			f = open("./AvionicsData/allData.txt","a+")
			f.write(str(datetime.datetime.now().time()) + " " + ' '.join(data) + "\n")
			f.close()
			TC1 = data[0] #Top
			TC2 = data[1] #Bottom
			PT1 = data[2]
			PT2 = data[3]
			#CriticalValue = data[4];
			LC1 = data[4]
			isVenting = data[5]
			disconnectState = data[6]
			#LC2 = data[6]
			#BallValve = data[6]
			#result = {'TC1':TC1,'TC2':TC2,'TC3':TC3,'TC4':TC4,'PT1':PT1,'PT2':PT2,'PT3':PT3,'CriticalCondition':CriticalCondition,'Sol':Sol,'Sol':Sol,'bvStatus':BallValve}
	
	ser.close()
	return "The telemetry reading is hidden here"

@flaskAppWetDress.route("/getTelem")
@cross_origin(supports_credentials=True)
def getTelem():
	"""
		Method to get all telemetry from the Arduino Serial port.
		When this is accessed, all data will be displayed for all systems.

		All other functions should be executed when this is called.
	"""
	data = {'Temp1':TC1, 'Temp2': TC2, 'PTop':PT1,'PBottom':PT2, 'LC1':LC1, 'Venting':isVenting, 'Disconnect':disconnectState}
	#data = {'Temp1':TC1,'Temp2':TC2,'Temp3':TC3,'Temp4':TC4,'PTop':PT1,'PBottom':PT2,'P3':PT3,'CriticalCondition':CriticalCondition,'LC1':LC1,'Sol':Sol,'bvStatus':BallValve}
	return (jsonify(data))

@flaskAppWetDress.route("/getTemp", methods=['GET'])
@cross_origin(headers=['Content-Type'])
def getTemp():
	"""
		Method to get the angular position of the rocket.
		This method is only activated when the route /getAng is accessed.

		Data collected here is to be directly displayed as numbers on ReactApp.
	"""
	temp = {'Temp1':TC1,'Temp2':TC2,'Temp3':TC3,'Temp4':TC4}
	f = open("./AvionicsData/temp.txt","a+")
	f.write(str(temp['Temp1'])+ " " + str(temp['Temp2']) + " " + str(temp['Temp3']) + " " + str(temp['Temp4']) + "\n")
	f.close()
	return (jsonify(temp))
	
@flaskAppWetDress.route("/getPressure", methods=['GET'])
@cross_origin(headers=['Content-Type'])
def getPressure():
	"""
		Method to get the angular position of the rocket.
		This method is only activated when the route /getAng is accessed.

		Data collected here is to be directly displayed as numbers on ReactApp.
	"""
	pressure = {'PTop':PT1,'PBottom':PT2,'P3':PT3}
	f = open("./AvionicsData/pressure.txt","a+")
	f.write(str(pressure['PTop'])+ " " + str(pressure['PBottom']) + " " + str(pressure['P3']) + "\n")
	f.close()
	return (jsonify(pressure))

@flaskAppWetDress.route("/getSol")
@cross_origin(supports_credentials=True)
def getSol():
	"""
		Method to get the location of the rocket with respect to the launchpad
		as the origin.
		This method is only activated when the url /getLoc is reached.

		Data collected here will be overlayed with a Google map section on the
		ReactApp.
	"""
	isOn = {'isOn':Sol}
	f = open("./AvionicsData/sol.txt","a+")
	f.write(str(isOn['isOn']) + "\n")
	f.close()
	print("SOL ", isOn['isOn']);
	return (jsonify(isOn))

@flaskAppWetDress.route("/getLoadCell")
@cross_origin(supports_credentials=True)
def getLoadCell():
	"""
		Method to get the location of the rocket with respect to the launchpad
		as the origin.
		This method is only activated when the url /getLoc is reached.

		Data collected here will be overlayed with a Google map section on the
		ReactApp.
	"""
	loadCell = {'loadCell':LC1}
	f = open("./AvionicsData/loadCell.txt","a+")
	f.write(str(loadCell['loadCell']) + "\n")
	f.close()
	return (jsonify(loadCell))

@flaskAppWetDress.route("/getBallValves")
@cross_origin(supports_credentials=True)
def getBallValves():
	"""
		Method to get the location of the rocket with respect to the launchpad
		as the origin.
		This method is only activated when the url /getLoc is reached.

		Data collected here will be overlayed with a Google map section on the
		ReactApp.
	"""
	bvStatus = {'bvStatus':BallValve}
	f = open("./AvionicsData/bvStatus.txt","a+")
	f.write(str(bvStatus['bvStatus']) + "\n")
	f.close()
	return (jsonify(bvStatus))