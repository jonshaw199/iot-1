#ifndef PATTERN_PATTERN_H_
#define PATTERN_PATTERN_H_

#define USE_GET_MILLISECOND_TIMER true

#include <FastLED.h>
#include <AF1.h>

#include "color/palette/list.h"

#define CNT preMax(CNT_A, CNT_B)
#define SECONDS_PER_PALETTE 20

enum patterns
{
  PATTERN_BEATWAVE,
  PATTERN_EVERYOTHER,
  PATTERN_NOISE,
  PATTERN_PICKER,
  PATTERN_BREATHE,
  PATTERN_OPENCLOSE,
  PATTERN_RANDFILL,
  PATTERN_EVERYN
};

typedef void (*patternFn)();

class Pattern
{
  static unsigned long time;

  static void beatwave();
  static void everyother();
  static void noise();
  static void picker();
  static void breathe();
  static void openClose();
  static void randFill();
  static void everyN();

  static patternFn curPatternFn;
  static std::map<uint8_t, patternFn> patternFnMap;

protected:
  static CRGB *leds;
  static CRGBPalette16 currentPalette;
  static CRGBPalette16 targetPalette;
  static TBlendType currentBlending;
  static uint8_t currentBrightness;
  static uint8_t currentScale;
  static uint8_t currentSpeed;

public:
  static void init();
  static void cbPattern();

  static void setTargetPalette(CRGBPalette16 p);
  static void setCurrentBlending(TBlendType b);
  static void setCurrentBrightness(uint8_t b);
  static void setCurrentScale(uint8_t s);
  static void setCurrentSpeed(uint8_t s);
  static unsigned long getTime();
  static void resetTime();

  static void setCurPatternFn(uint8_t p);
};

#endif