/*
 * Author: Robert Cudmore
 * http://robertcudmore.org
 * 20160214
 *
 * Purpose: Send sensor data out the serial port
 *    serial output format is
 *    millis(), a0, a1, a2
 *
 */
#include "Arduino.h"

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  
  Serial.begin(115200);
}

void loop()
{
  digitalWrite(LED_BUILTIN, HIGH); //so we can see if the code is running

  //read from an analog input
  //int a0_value = analogRead(A0); 
  
  //for now just simulate some data
  int a0_value = random(1024);
  int mappedPot = map(a0_value, 0, 1023, 0, 255);

  //read from an analog input
  //int a1_value = analogRead(A1); 
  //int a2_value = analogRead(A2); 

  //for now just simulate some data
  int a1_value = random(255);
  int a2_value = random(255);

  Serial.println(String(millis()) + "," + String(mappedPot) + "," + String (a1_value) + "," + String (a2_value)); 
  
  delay(20); //ms

  digitalWrite(LED_BUILTIN, LOW); //so we can see if the code is running
}
