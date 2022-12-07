#include "everyother.h"

void EveryOther::loop()
{
  Pattern::loop();

  static uint8_t coef = 0;

  EVERY_N_MILLISECONDS(250)
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
    FastLED.show();
  }
}