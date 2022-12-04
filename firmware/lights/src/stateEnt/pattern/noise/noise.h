#ifndef PATTERN_NOISE_NOISE_H_
#define PATTERN_NOISE_NOISE_H_

#include <FastLED.h>

#include "stateEnt/pattern/pattern.h"

class Noise : public Pattern
{
  static CRGBPalette16 currentPalette;
  static TBlendType currentBlending;
  static CRGBPalette16 targetPalette;
  static uint8_t scale;
  static uint8_t whichPalette;
  static const TProgmemRGBPalette16 *ActivePaletteList[];

  static void fillNoise8();
  static void setTargetPalette();

public:
  void setup();
};

#endif