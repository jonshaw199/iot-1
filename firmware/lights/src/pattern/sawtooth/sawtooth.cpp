#include "sawtooth.h"

void Sawtooth::loop()
{
  Pattern::loop();

  int ms_per_beat = 60000 / max(currentSpeed, 1); // 500ms per beat, where 60,000 = 60 seconds * 1000 ms
  int ms_per_led = 60000 / max(currentSpeed, 1) / CNT;

  int cur_led = ((getTime() % ms_per_beat) / ms_per_led) % (CNT); // Using millis to count up the strand, with %NUM_LEDS at the end as a safety factor.

  if (cur_led == 0)
    fill_solid(leds, CNT, CRGB::Black);
  else
    leds[cur_led] = ColorFromPalette(currentPalette, 0, 255, currentBlending); // I prefer to use palettes instead of CHSV or CRGB assignments.

  FastLED.show();
}