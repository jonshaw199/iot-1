#ifndef PATTERN_CONFETTI_CONFETTI_H_
#define PATTERN_CONFETTI_CONFETTI_H_

#include <FastLED.h>

#include "stateEnt/pattern/pattern.h"

class Confetti : public Pattern
{
  static CRGB *leds;
  static CRGBPalette16 gCurrentPalette;
  static CRGBPalette16 gTargetPalette;
  static TBlendType currentBlending;
  static uint8_t whichPalette;
  static const TProgmemRGBPalette16 *ActivePaletteList[];

  static uint8_t thisfade;
  static int thishue;
  static uint8_t thisinc;
  static uint8_t thissat;
  static uint8_t thisbri;
  static int huediff;
  static uint8_t thisdelay;

  static void confetti();
  static void changeMe();

public:
  void setup();
  void preStateChange(int s);
};

#endif