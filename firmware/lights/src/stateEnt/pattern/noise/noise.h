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
  static uint8_t scale;

  static void fillNoise8();
  static void setTargetPalette();

  static void SetupRandomPalette();
  static void SetupBlackAndWhiteStripedPalette();
  static void SetupPurpleAndGreenPalette();
  static uint16_t XY(uint8_t x, uint8_t y);

public:
  void setup();
  void preStateChange(int s);
};

#endif