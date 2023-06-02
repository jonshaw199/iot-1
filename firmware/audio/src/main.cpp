#include <Arduino.h>
#include <AF1.h>
#include <M5Core2.h>

#include "state.h"
#include "stateEnt/home/home.h"

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  AF1::begin(JS_ID);
  AF1::addStateEnt(STATE_HOME, new Home());
  AF1::setInitialState(INITIAL_STATE);
  AF1::addWifiAP(WIFI_SSID, WIFI_PASS);
  AF1::setDefaultWS(SERVER_IP, String("/?deviceId=") + String(JS_ID), SERVER_PORT);
  M5.begin();
  M5.Lcd.print("Hello world");
}

void loop()
{
  // put your main code here, to run repeatedly:
  AF1::update();
}