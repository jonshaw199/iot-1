#include <FastLED.h>

#include "pattern.h"

CRGB *Pattern::leds;

void Pattern::setup()
{
  LightsBase::setup();

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

void Pattern::preStateChange(int s)
{
  LightsBase::preStateChange(s);

  // Turn off lights
#if CNT
  FastLED.showColor(CRGB::Black);
#endif

  delete[] leds;
}