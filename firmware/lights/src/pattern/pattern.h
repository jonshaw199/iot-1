#ifndef PATTERN_PATTERN_H_
#define PATTERN_PATTERN_H_

#include <FastLED.h>
#include <AF1.h>

#include "pattern.h"
#include "color/palette/list.h"

#define CNT max(CNT_A, CNT_B)
#define SECONDS_PER_PALETTE 20

class Pattern
{
protected:
  static CRGB *leds;
  static CRGBPalette16 currentPalette;
  static CRGBPalette16 targetPalette;
  static TBlendType currentBlending;
  static uint8_t currentBrightness;
  static uint8_t currentScale;
  static uint8_t currentSpeed;

  static Pattern *currentPattern;

public:
  static void init();
  virtual void setup();
  virtual void loop();
  static void setTargetPalette(CRGBPalette16 p);
  static void setCurrentBlending(TBlendType b);
  static void setCurrentBrightness(uint8_t b);
  static void setCurrentScale(uint8_t s);
  static void setCurrentSpeed(uint8_t s);
};

#endif