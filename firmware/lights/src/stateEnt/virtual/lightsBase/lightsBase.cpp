#include "lightsBase.h"
#include "state.h"

#ifdef ARDUINO_M5Stick_C
#include <M5StickCPlus.h>
#undef min // https://github.com/m5stack/M5Stack/issues/97

#include "img/mountains.h"
#endif

void LightsBase::setup()
{
  Base::setup();

#ifdef ARDUINO_M5Stick_C
  M5.Lcd.fillScreen(TFT_WHITE);
  M5.Lcd.setRotation(0);
  M5.Lcd.pushImage(0, 0, MOUNTAINS_WIDTH, MOUNTAINS_HEIGHT, (uint16_t *)mountains);
#endif

#define AUTO_SHUTOFF_MIN (24 * 60 /* EOD */ + 7 * 60 /* TZ Offset */)
  if (timeClient.isTimeSet())
  {
    unsigned long curSec = timeClient.getEpochTime();
    unsigned long beginDaySec = curSec - timeClient.getHours() * 60 * 60 - timeClient.getMinutes() * 60 - timeClient.getSeconds();
    unsigned long autoShutoffSec = beginDaySec + AUTO_SHUTOFF_MIN * 60;
    Serial.print("Auto shutoff seconds: ");
    Serial.println(autoShutoffSec);
    addEvent(Event(
        "LightsBase_AutoShutoff",
        [](ECBArg a)
        {
          setRequestedState(STATE_HOME);
        },
        EVENT_TYPE_TEMP, 0, 1, autoShutoffSec, START_EPOCH_SEC));
  }
}

void LightsBase::loop()
{
  Base::loop();

#ifdef ARDUINO_M5Stick_C
  M5.update(); // Read the press state of the key.  读取按键 A, B, C 的状态
  if (M5.BtnA.wasReleased())
  { // If the button A is pressed.  如果按键 A 被按下
    M5.Lcd.print('A');
  }
  /*else if (M5.BtnB.wasReleased())
  { // If the button B is pressed. 如果按键
    // B 被按下，
    // M5.Lcd.print('B');
    AF1::setRequestedState(STATE_RC2);
  }*/
  /*else if (M5.BtnB.wasReleasefor(
               700))
  { // The button B is pressed for 700ms. 按键 B 按下
    // 700ms,屏幕清空
    M5.Lcd.fillScreen(
        BLACK); // Set BLACK to the background color.  将黑色设置为底色
    M5.Lcd.setCursor(0, 0);
  }*/
#endif
}

bool LightsBase::doScanForPeersESPNow()
{
  return false;
}

void LightsBase::onConnectWSServer()
{
  AF1Msg m(TYPE_MQTT_SUBSCRIBE);
  m.json()["topic"] = LIGHTS_ROUTE;
  pushOutbox(m);
}

msg_handler LightsBase::getInboxHandler()
{
  return [](AF1Msg m)
  {
    Base::handleInboxMsg(m);
    String topic = m.json()["topic"];
    if (topic == "/home/lights/state")
    {
      Serial.println("there");
      setRequestedState(m.getState());
    }
    else
    {
      Serial.println("here");
    }
  };
}
