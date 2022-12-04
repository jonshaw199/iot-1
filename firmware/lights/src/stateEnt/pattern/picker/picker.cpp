#include "picker.h"

CRGBPalette16 Picker::currentPalette;
CRGBPalette16 Picker::targetPalette;

String Picker::getName()
{
  return "Picker";
}

msg_handler Picker::getInboxHandler()
{
  return [](AF1Msg &m)
  {
    LightsBase::handleInboxMsg(m);
    String topic = m.json()["topic"];
    if (topic == "/lights/color")
    {
      uint8_t h = m.json()["h"];
      uint8_t s = m.json()["s"];
      uint8_t v = m.json()["v"];
      CHSV targetColor = CHSV(h, s, v);
      targetPalette = CRGBPalette16(targetColor);
    }
  };
}

void Picker::setup()
{
  Pattern::setup();

  currentPalette = CRGBPalette16(CRGB::Black);

  addEvent(Event(
      "Picker_UpdateLeds",
      [](ECBArg a)
      { 
        fill_solid(leds, CNT, ColorFromPalette(currentPalette, 0));
        FastLED.show(); },
      EVENT_TYPE_TEMP, 1));

  addEvent(Event(
      "Picker_Blend",
      [](ECBArg a)
      { nblendPaletteTowardPalette(currentPalette, targetPalette, 1); },
      EVENT_TYPE_TEMP, 10));
}
