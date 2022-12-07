#include "everyother.h"

uint8_t EveryOther::coef;

void EveryOther::setup()
{
  LightsBase::setup();

  addEvent(Event(
      "EveryOther",
      [](ECBArg a)
      {
        everyOther();
        FastLED.show();
      },
      EVENT_TYPE_TEMP, 250));
}

void EveryOther::everyOther()
{
  coef = !coef;
  for (int i = 0; i < CNT; i++)
  {
    if (i % 2 == coef)
    {
      leds[i] = ColorFromPalette(currentPalette, random8(), currentBrightness, NOBLEND);
    }
    else
    {
      leds[i] = CRGB::Black;
    }
  }
}
