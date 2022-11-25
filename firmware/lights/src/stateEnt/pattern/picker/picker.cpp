#include "picker.h"

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
      Serial.println("to do: blend toward target");
    }
  };
}

void Picker::setup()
{
  Pattern::setup();

  leds = new CRGB[CNT];

#if CNT
#if CNT_A
  FastLED.addLeds<LED_TYPE_A, LED_PIN_A, LED_ORDER_A>(leds, CNT);
#endif
#if CNT_B
  FastLED.addLeds<LED_TYPE_B, LED_PIN_B, LED_ORDER_B>(leds, CNT);
#endif
#endif
}

void Picker::preStateChange(int s) {
  Pattern::preStateChange(s);
  delete[] leds;
}
