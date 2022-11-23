
#include <AF1.h>

#ifdef ARDUINO_M5Stick_C
#include <M5StickCPlus.h> // https://github.com/m5stack/M5Stack/issues/97
#undef min
#endif

#include "state.h"
#include "stateEnt/home/home.h"
#include "img/apple.h"
#include "img/mountains.h"
#include "stateEnt/pattern/twinklefox/twinklefox.h"
#include "stateEnt/pattern/noisePlusPalette/noisePlusPalette.h"
#include "stateEnt/pattern/noise/noise.h"

void setup()
{
  Serial.setTimeout(JS_SERIAL_TIMEOUT);
  Serial.begin(JS_BAUD);
#ifdef ARDUINO_M5Stick_C
  M5.begin();
  M5.Lcd.setSwapBytes(true);
  M5.Lcd.fillScreen(TFT_WHITE);
  M5.Lcd.pushImage((DISPLAY_PORTRAIT_WIDTH - APPLE_WIDTH) / 2, (DISPLAY_PORTRAIT_HEIGHT - APPLE_HEIGHT) / 2, APPLE_WIDTH, APPLE_HEIGHT, (uint16_t *)apple);
#endif
  AF1::begin(JS_ID);
#ifdef JS_IP_A
  AF1::addWifiAP(JSSSID, JSPASS, JS_IP_A, JS_IP_B, JS_IP_C, JS_IP_D, 192, 168, 1, 254, 255, 255, 255, 0);
#else
  AF1::addWifiAP(JSSSID, JSPASS);
#endif
  AF1::addStateEnt(STATE_HOME, new Home());
  AF1::addStringHandler("home", [](SHArg a)
                             { AF1::setRequestedState(STATE_HOME); });
  AF1::addStateEnt(STATE_PATTERN_TWINKLEFOX, new Twinklefox());
  AF1::addStringHandler("twinklefox", [](SHArg a)
                             { AF1::setRequestedState(STATE_PATTERN_TWINKLEFOX); });
  AF1::addStateEnt(STATE_PATTERN_NOISEPLUSPALETTE, new NoisePlusPalette());
  AF1::addStringHandler("noisepluspalette", [](SHArg a)
                             { AF1::setRequestedState(STATE_PATTERN_NOISEPLUSPALETTE); });
  AF1::addStateEnt(STATE_PATTERN_NOISE, new Noise());
  AF1::addStringHandler("noise", [](SHArg a)
                             { AF1::setRequestedState(STATE_PATTERN_NOISE); });

#ifdef ARDUINO_M5Stick_C
  delay(500);
  M5.Lcd.fillScreen(TFT_WHITE);
  M5.Lcd.setRotation(0);
  M5.Lcd.pushImage(0, 0, MOUNTAINS_WIDTH, MOUNTAINS_HEIGHT, (uint16_t *)mountains);
#endif

  AF1::setInitialState(INITIAL_STATE);
  AF1::setDefaultWSClientInfo({SERVER_IP, String(LIGHTS_WS_PATH) + "?deviceId=" + JS_ID, SERVER_PORT, ""});
}

void loop()
{
  AF1::update();
}