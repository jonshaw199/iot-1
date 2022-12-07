#include "beatwave.h"

void Beatwave::setup()
{
  LightsBase::setup();

  addEvent(Event(
      "Beatwave_Loop", [](ECBArg a)
      { 
        beatwave(); 
        FastLED.show(); },
      EVENT_TYPE_TEMP, 1));
}

void Beatwave::beatwave()
{
  uint8_t wave1 = beatsin8(9, 0, 255); // That's the same as beatsin8(9);
  uint8_t wave2 = beatsin8(8, 0, 255);
  uint8_t wave3 = beatsin8(7, 0, 255);
  uint8_t wave4 = beatsin8(6, 0, 255);

  for (int i = 0; i < CNT; i++)
  {
    leds[i] = ColorFromPalette(currentPalette, i + wave1 + wave2 + wave3 + wave4, 255, currentBlending);
  }
}
