#include "noise.h"

uint8_t Noise::scale;

void Noise::setup()
{
  Pattern::setup();

  addEvent(Event(
      "Noise",
      [](ECBArg a)
      {
        nblendPaletteTowardPalette(currentPalette, targetPalette);
        fillNoise8();
        FastLED.show();
      },
      EVENT_TYPE_TEMP, 1));

  addEvent(Event(
      "Noise_MovingTarget",
      [](ECBArg a)
      { advanceTargetPalette(); },
      EVENT_TYPE_TEMP, SECONDS_PER_PALETTE, 0, 0, START_EPOCH_SEC));
}

void Noise::fillNoise8()
{
  for (int i = 0; i < CNT; i++)
  {                                                                                        // Just ONE loop to fill up the LED array as all of the pixels change.
    uint8_t index = inoise8(i * scale, getCurStateEnt()->getElapsedMs() / 10 + i * scale); // Get a value from the noise function. I'm using both x and y axis.
    leds[i] = ColorFromPalette(currentPalette, index, 255, LINEARBLEND);                   // With that value, look up the 8 bit colour palette value and assign it to the current LED.
  }

} // fillnoise8()

