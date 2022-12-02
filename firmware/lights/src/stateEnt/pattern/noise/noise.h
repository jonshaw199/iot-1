#ifndef PATTERN_NOISE_NOISE_H_
#define PATTERN_NOISE_NOISE_H_

#include <FastLED.h>

#include "stateEnt/pattern/pattern.h"

class Noise : public Pattern
{
  static CRGB *leds;
  static CRGBPalette16 currentPalette;
  static TBlendType currentBlending;
  static CRGBPalette16 targetPalette;
  static CHSV orange;
  static CHSV purple;

  static void fillNoise8();
  static void setTargetPalette();

public:
  void setup();
  void preStateChange(int s);
};

#endif