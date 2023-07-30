
#include <AF1.h>

#ifdef ARDUINO_M5Stick_C
#include <M5StickCPlus.h> // https://github.com/m5stack/M5Stack/issues/97
#undef min

#include "img/apple.h"
#include "img/mountains.h"
#endif

#include "state.h"
#include "stateEnt/home/home.h"
#include "stateEnt/virtual/lightsBase/lightsBase.h"

void setup()
{
  Serial.setTimeout(SERIAL_TIMEOUT);
  Serial.begin(SERIAL_BAUD);
#ifdef ARDUINO_M5Stick_C
  M5.begin();
  M5.Lcd.setSwapBytes(true);
  M5.Lcd.fillScreen(TFT_WHITE);
  M5.Lcd.pushImage((DISPLAY_PORTRAIT_WIDTH - APPLE_WIDTH) / 2, (DISPLAY_PORTRAIT_HEIGHT - APPLE_HEIGHT) / 2, APPLE_WIDTH, APPLE_HEIGHT, (uint16_t *)apple);
#endif
  AF1::begin(JS_ID);
#ifdef JS_IP_A
  AF1::addWifiAP(WIFI_SSID, WIFI_PASS, JS_IP_A, JS_IP_B, JS_IP_C, JS_IP_D, JS_GATEWAY_A, JS_GATEWAY_B, JS_GATEWAY_C, JS_GATEWAY_D, JS_SUBNET_A, JS_SUBNET_B, JS_SUBNET_C, JS_SUBNET_D);
#else
  AF1::addWifiAP(WIFI_SSID, WIFI_PASS);
#endif
  AF1::addStateEnt(STATE_HOME, new Home());
  AF1::addStringHandler("home", [](SHArg a)
                        { AF1::setRequestedState(STATE_HOME); });

#ifdef ARDUINO_M5Stick_C
  delay(500);
  M5.Lcd.fillScreen(TFT_WHITE);
  M5.Lcd.setRotation(0);
  M5.Lcd.pushImage(0, 0, MOUNTAINS_WIDTH, MOUNTAINS_HEIGHT, (uint16_t *)mountains);
#endif

  AF1::setInitialState(INITIAL_STATE);
  AF1::setDefaultWS(SERVER_IP, String("/?deviceId=") + String(JS_ID), SERVER_PORT);

  LightsBase::init();
}

void loop()
{
  AF1::update();
}
