#include "lightsBase.h"
#include "state.h"
#include "pattern/pattern.h"

#ifdef ARDUINO_M5Stick_C
#include <M5StickCPlus.h>
#undef min // https://github.com/m5stack/M5Stack/issues/97

#include "img/mountains.h"
#endif

#define MAX_PACKET_ID 5 // Can't store many unacked

static uint8_t nextPacketId;
static std::map<uint8_t, AF1Msg> unackedPackets;

void LightsBase::init()
{
  Pattern::init();
  AF1::addStringHandler("pattern*", [](SHArg a)
                        { Pattern::setCurrentPattern(a.getValue().toInt()); });
}

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

  Pattern::getCurrentPattern()->loop();
}

bool LightsBase::doScanForPeersESPNow()
{
  return false;
}

void LightsBase::onConnectWSServer()
{
  AF1Msg m(TYPE_MQTT_SUBSCRIBE);
  m.json()["topic"] = LIGHTS_ROUTE;
  m.json()["qos"] = 0;
  pushOutbox(m);
}

void LightsBase::onConnectWSServerFailed()
{
  Serial.println("Restarting due to failed WS connection");
  ESP.restart();
}

void LightsBase::onConnectWifiFailed()
{
  Serial.println("Restarting due to failed wifi connection");
  ESP.restart();
}

void LightsBase::handleInboxMsg(AF1Msg &m)
{
  Base::handleInboxMsg(m);
  switch (m.getType())
  {
  case TYPE_MQTT_PUBLISH:
  {
    String topic = m.json()["topic"];
    if (topic == "/lights/state")
    {
      Serial.println("State msg");
      setRequestedState(m.getState());
    }
    else if (topic == "/lights/appearance")
    {
      if (m.json().containsKey("pattern"))
      {
        uint8_t p = m.json()["pattern"];
        Pattern::setCurrentPattern(p);
      }

      if (m.json().containsKey("h"))
      {
        uint8_t h = m.json()["h"];
        uint8_t s = m.json()["s"];
        uint8_t v = m.json()["v"];
        CHSV targetColor = CHSV(h, s, v);
        Pattern::setTargetPalette(CRGBPalette16(targetColor));
      }
      else if (m.json().containsKey("palette"))
      {
        uint8_t i = m.json()["palette"];
        // A map or vector would be lovely here but having constant issues with storing TProgmemRGBPalette16; to do
        switch (i)
        {
        case 0:
          Pattern::setTargetPalette(RetroC9_p);
          break;
        case 1:
          Pattern::setTargetPalette(BlueWhite_p);
          break;
        case 2:
          Pattern::setTargetPalette(RedGreenWhite_p);
          break;
        case 3:
          Pattern::setTargetPalette(Snow_p);
          break;
        case 4:
          Pattern::setTargetPalette(RedWhite_p);
          break;
        case 5:
          Pattern::setTargetPalette(Ice_p);
          break;
        case 6:
          Pattern::setTargetPalette(Holly_p);
          break;
        case 7:
          Pattern::setTargetPalette(RainbowColors_p);
          break;
        case 8:
          Pattern::setTargetPalette(PartyColors_p);
          break;
        }
      }

      if (m.json().containsKey("scale"))
      {
        uint8_t scale = m.json()["scale"];
        Pattern::setCurrentScale(scale);
      }

      if (m.json().containsKey("speed"))
      {
        uint8_t speed = m.json()["speed"];
        Pattern::setCurrentSpeed(speed);
      }

      if (m.json().containsKey("resetTime"))
      {
        Pattern::resetTime();
      }
    }

    // Acks
    uint8_t q = m.json()["qos"];
    if (q == 1)
    {
      int p = m.json()["packetId"];
      AF1Msg res(TYPE_MQTT_PUBACK);
      res.json()["packetId"] = p;
      pushOutbox(res);
    }
    else if (q == 2)
    {
      int p = m.json()["packetId"];
      AF1Msg res(TYPE_MQTT_PUBREC);
      res.json()["packetId"] = p;
      pushOutbox(res);
    }
  }
  break;
  case TYPE_MQTT_PUBACK:
  case TYPE_MQTT_PUBCOMP:
  {
    uint8_t p = m.json()["packetId"];
    unackedPackets.erase(p);
  }
  break;

  case TYPE_MQTT_PUBREC:
  {
    uint8_t p = m.json()["packetId"];
    unackedPackets[p] = m;
    AF1Msg res(TYPE_MQTT_PUBREL);
    res.json()["packetId"] = p;
    pushOutbox(res);
  }
  break;
  case TYPE_MQTT_PUBREL:
  {
    int p = m.json()["packetId"];
    AF1Msg res(TYPE_MQTT_PUBCOMP);
    res.json()["packetId"] = p;
    pushOutbox(res);
  }
  break;
  }
}

msg_handler LightsBase::getInboxHandler()
{
  return handleInboxMsg;
}

msg_handler LightsBase::getOutboxHandler()
{
  return [](AF1Msg &m)
  {
    uint8_t q = m.json()["qos"];
    switch (m.getType())
    {
    case TYPE_MQTT_PUBLISH:
    case TYPE_MQTT_PUBREL:
      if (q)
      {
        m.json()["packetId"] = nextPacketId;
        unackedPackets[nextPacketId] = m;
        nextPacketId = (nextPacketId + 1) % MAX_PACKET_ID;
      }
      break;
    }
    Base::handleOutboxMsg(m);
  };
}
