#ifndef PATTERN_TWINKLEFOX_TWINKLEFOX_H_
#define PATTERN_TWINKLEFOX_TWINKLEFOX_H_

#include <FastLED.h>

#include "stateEnt/virtual/lightsBase/lightsBase.h"

class Twinklefox : public LightsBase
{
  // Background color for 'unlit' pixels
  // Can be set to CRGB::Black if desired.
  static CRGB gBackgroundColor;
  // Example of dim incandescent fairy light background color
  // CRGB gBackgroundColor = CRGB(CRGB::FairyLight).nscale8_video(16);

  static void drawTwinkles();
  static CRGB computeOneTwinkle(uint32_t ms, uint8_t salt);
  static uint8_t attackDecayWave8(uint8_t i);
  static void coolLikeIncandescent(CRGB &c, uint8_t phase);

public:
  void setup();
};

#endif