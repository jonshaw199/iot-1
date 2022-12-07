#include "pattern/beatwave/beatwave.h"
#include "pattern/everyother/everyother.h"
#include "pattern/noise/noise.h"
#include "pattern/picker/picker.h"
#include "pattern/ripple/ripple.h"
#include "pattern/twinklefox/twinklefox.h"

CRGB *Pattern::leds;
CRGBPalette16 Pattern::currentPalette;
CRGBPalette16 Pattern::targetPalette;
TBlendType Pattern::currentBlending = LINEARBLEND;
uint8_t Pattern::currentBrightness = 200;
uint8_t Pattern::currentSpeed;
uint8_t Pattern::currentScale;

static std::vector<Pattern *> patterns;
Pattern *Pattern::currentPattern;

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

  patterns.push_back(new Beatwave());
  patterns.push_back(new EveryOther());
  patterns.push_back(new Noise());
  patterns.push_back(new Picker());
  patterns.push_back(new Ripple());
  patterns.push_back(new Twinklefox());

  currentPattern = patterns[0];
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
