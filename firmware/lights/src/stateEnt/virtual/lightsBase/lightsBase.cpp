#include "lightsBase.h"
#include "state.h"

#ifdef ARDUINO_M5Stick_C
#include <M5StickCPlus.h>
#undef min // https://github.com/m5stack/M5Stack/issues/97

#include "img/mountains.h"
#endif

static uint8_t nextPacketId;
static std::map<uint8_t, AF1Msg> unackedPackets;

void LightsBase::setup()
{
  Base::setup();

#ifdef ARDUINO_M5Stick_C
  M5.Lcd.fillScreen(TFT_WHITE);
  M5.Lcd.setRotation(0);
  M5.Lcd.pushImage(0, 0, MOUNTAINS_WIDTH, MOUNTAINS_HEIGHT, (uint16_t *)mountains);
#endif
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
  return [](AF1Msg &m)
  {
    Base::handleInboxMsg(m);
    switch (m.getType())
    {
    case TYPE_MQTT_PUBLISH:
    {
      String topic = m.json()["topic"];
      if (topic == "/lights/pattern")
      {
        Serial.println("Pattern msg");
        setRequestedState(m.getState());
      }
      else if (topic == "/lights/color")
      {
        Serial.println("Color msg");
      }
      uint8_t q = m.json()["qos"];
      if (q == 1)
      {
        int p = m.json()["packetId"];
        if (p)
        {
          AF1Msg res(TYPE_MQTT_PUBACK);
          res.json()["packetId"] = p;
          pushOutbox(res);
        }
      }
      else if (q == 2)
      {
        int p = m.json()["packetId"];
        if (p)
        {
          AF1Msg res(TYPE_MQTT_PUBREC);
          res.json()["packetId"] = p;
          pushOutbox(res);
        }
      }
    }
    break;
    case TYPE_MQTT_PUBREC:
    {
      int packetId = m.json()["packetId"];
      if (packetId)
      {
        AF1Msg res(TYPE_MQTT_PUBREL);
        res.json()["packetId"] = packetId;
        pushOutbox(res);
      }
    }
    break;
    case TYPE_MQTT_PUBREL:
    {
      int packetId = m.json()["packetId"];
      if (packetId)
      {
        AF1Msg res(TYPE_MQTT_PUBCOMP);
        res.json()["packetId"] = packetId;
        pushOutbox(res);
      }
    }
    break;
    }
  };
}

msg_handler LightsBase::getOutboxHandler()
{
  return [](AF1Msg &m)
  {
    uint8_t q = m.json()["qos"];
    if (q && m.getType() == TYPE_MQTT_PUBLISH)
    {
      m.json()["packetId"] = nextPacketId;
      nextPacketId++;
    }
    Base::handleOutboxMsg(m);
  };
}
