#include "pattern.h"

#include "pattern/beatwave/beatwave.h"
#include "pattern/everyother/everyother.h"
#include "pattern/noise/noise.h"
#include "pattern/picker/picker.h"
#include "pattern/ripple/ripple.h"
#include "pattern/twinklefox/twinklefox.h"
#include "pattern/dotbeat/dotbeat.h"

enum patterns
{
  PATTERN_BEATWAVE,
  PATTERN_EVERYOTHER,
  PATTERN_NOISE,
  PATTERN_PICKER,
  PATTERN_RIPPLE,
  PATTERN_TWINKLEFOX,
  PATTERN_DOTBEAT
};

CRGB *Pattern::leds;
CRGBPalette16 Pattern::currentPalette;
CRGBPalette16 Pattern::targetPalette;
TBlendType Pattern::currentBlending = LINEARBLEND;
uint8_t Pattern::currentBrightness = 200;
uint8_t Pattern::currentSpeed;
uint8_t Pattern::currentScale;

Pattern *Pattern::currentPattern;
std::map<uint8_t, Pattern *> Pattern::patternMap;

unsigned long Pattern::time;

void Pattern::init()
{
  leds = new CRGB[CNT];

#if CNT
#if CNT_A
  FastLED.addLeds<LED_TYPE_A, LED_PIN_A, LED_ORDER_A>(leds, CNT);
#endif
#if CNT_B
  FastLED.addLeds<LED_TYPE_B, LED_PIN_B, LED_ORDER_B>(leds, CNT);
#endif
#endif

  resetTime();

  patternMap[PATTERN_BEATWAVE] = new Beatwave();
  patternMap[PATTERN_EVERYOTHER] = new EveryOther();
  patternMap[PATTERN_NOISE] = new Noise();
  patternMap[PATTERN_PICKER] = new Picker();
  patternMap[PATTERN_RIPPLE] = new Ripple();
  patternMap[PATTERN_TWINKLEFOX] = new Twinklefox();
  patternMap[PATTERN_DOTBEAT] = new DotBeat();
  currentPattern = patternMap[PATTERN_PICKER];
  currentPattern->setup();
}

void Pattern::setup()
{
}

void Pattern::loop()
{
  nblendPaletteTowardPalette(currentPalette, targetPalette);
}

void Pattern::setTargetPalette(CRGBPalette16 p)
{
  targetPalette = p;
}

void Pattern::setCurrentBlending(TBlendType b)
{
  currentBlending = b;
}

void Pattern::setCurrentBrightness(uint8_t b)
{
  currentBrightness = b;
}

void Pattern::setCurrentScale(uint8_t s)
{
  currentScale = s;
}

void Pattern::setCurrentSpeed(uint8_t s)
{
  currentSpeed = s;
}

void Pattern::setCurrentPattern(uint8_t p)
{
  if (patternMap.count(p))
  {
    currentPattern = patternMap[p];
    currentPattern->setup();
  }
  else
  {
    Serial.println("Pattern doesn't exist");
  }
}

Pattern *Pattern::getCurrentPattern()
{
  return currentPattern;
}

unsigned long Pattern::getTime()
{
  return millis() - time;
}

void Pattern::resetTime()
{
  time = millis();
}
