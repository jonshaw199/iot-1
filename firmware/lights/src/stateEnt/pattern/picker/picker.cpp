#include "picker.h"

CRGB* Picker::leds;
CRGBPalette16 Picker::currentPalette;
CRGBPalette16 Picker::targetPalette;

String Picker::getName()
{
  return "Picker";
}

msg_handler Picker::getInboxHandler()
{
  return [](AF1Msg m)
  {
    Pattern::handleInboxMsg(m);
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

  leds = new CRGB[CNT];
  currentPalette = CRGBPalette16(CRGB::Black);

#if CNT
#if CNT_A
  FastLED.addLeds<LED_TYPE_A, LED_PIN_A, LED_ORDER_A>(leds, CNT);
#endif
#if CNT_B
  FastLED.addLeds<LED_TYPE_B, LED_PIN_B, LED_ORDER_B>(leds, CNT);
#endif

  addEvent(Event(
      "Picker_Blend",
      [](ECBArg a)
      {
        nblendPaletteTowardPalette(currentPalette, targetPalette, 5);          // Blend towards the target palette over 48 iterations.
        FastLED.show(); },
      EVENT_TYPE_TEMP, 10));
#endif
}

void Picker::preStateChange(int s) {
  Pattern::preStateChange(s);
  delete[] leds;
}
