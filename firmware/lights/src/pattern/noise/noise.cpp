#include "noise.h"

void Noise::loop()
{
  Pattern::loop();
  for (int i = 0; i < CNT; i++)
  {                                                                                                           // Just ONE loop to fill up the LED array as all of the pixels change.
    uint8_t index = inoise8(i * currentScale, AF1::getCurStateEnt()->getElapsedMs() / 10 + i * currentScale); // Get a value from the noise function. I'm using both x and y axis.
    leds[i] = ColorFromPalette(currentPalette, index, 255, LINEARBLEND);                                      // With that value, look up the 8 bit colour palette value and assign it to the current LED.
  }
  FastLED.show();
}