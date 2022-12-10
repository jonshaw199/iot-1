#include "dotbeat.h"

void DotBeat::loop()
{
  uint8_t inner = beatsin8(currentSpeed, CNT / 4, CNT / 4 * 3);  // Move 1/4 to 3/4
  uint8_t outer = beatsin8(currentSpeed, 0, CNT - 1);            // Move entire length
  uint8_t middle = beatsin8(currentSpeed, CNT / 3, CNT / 3 * 2); // Move 1/3 to 2/3

  leds[middle] = currentPalette[0];
  leds[inner] = currentPalette[9];
  leds[outer] = currentPalette[15];

  nscale8(leds, CNT, currentScale); // Fade the entire array. Or for just a few LED's, use  nscale8(&leds[2], 5, fadeval);
  FastLED.show();
}