#include "pattern.h"

// FastLED timer override
uint32_t get_millisecond_timer()
{
  return Pattern::getTime();
}

CRGB *Pattern::leds;
CRGBPalette16 Pattern::currentPalette;
CRGBPalette16 Pattern::targetPalette;
TBlendType Pattern::currentBlending = LINEARBLEND;
uint8_t Pattern::currentBrightness = 200;
uint8_t Pattern::currentSpeed;
uint8_t Pattern::currentScale;

unsigned long Pattern::time;

patternFn Pattern::curPatternFn;
std::map<uint8_t, patternFn> Pattern::patternFnMap;

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

  patternFnMap[PATTERN_BEATWAVE] = beatwave;
  patternFnMap[PATTERN_DOTBEAT] = dotbeat;
  patternFnMap[PATTERN_EVERYOTHER] = everyother;
  patternFnMap[PATTERN_NOISE] = noise;
  patternFnMap[PATTERN_PICKER] = picker;
  curPatternFn = picker;
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

unsigned long Pattern::getTime()
{
  return millis() - time;
}

void Pattern::resetTime()
{
  time = millis();
}

void Pattern::setCurPatternFn(uint8_t p)
{
  if (patternFnMap.count(p))
  {
    curPatternFn = patternFnMap[p];
  }
}

void Pattern::cbPattern(ECBArg a)
{
  nblendPaletteTowardPalette(currentPalette, targetPalette);
  curPatternFn(a);
}

void Pattern::beatwave(ECBArg a)
{
  uint8_t wave1 = beatsin8(9, 0, 255); // That's the same as beatsin8(9);
  uint8_t wave2 = beatsin8(8, 0, 255);
  uint8_t wave3 = beatsin8(7, 0, 255);
  uint8_t wave4 = beatsin8(6, 0, 255);

  for (int i = 0; i < CNT; i++)
  {
    leds[i] = ColorFromPalette(currentPalette, i + wave1 + wave2 + wave3 + wave4, 255, currentBlending);
  }
}

void Pattern::dotbeat(ECBArg a)
{
  uint8_t inner = beatsin8(currentSpeed, CNT / 4, CNT / 4 * 3);  // Move 1/4 to 3/4
  uint8_t outer = beatsin8(currentSpeed, 0, CNT - 1);            // Move entire length
  uint8_t middle = beatsin8(currentSpeed, CNT / 3, CNT / 3 * 2); // Move 1/3 to 2/3

  leds[middle] = currentPalette[0];
  leds[inner] = currentPalette[9];
  leds[outer] = currentPalette[15];

  nscale8(leds, CNT, currentScale); // Fade the entire array. Or for just a few LED's, use  nscale8(&leds[2], 5, fadeval);
}

// 250ms
void Pattern::everyother(ECBArg a)
{
  static uint8_t coef;
  coef = !coef;
  for (int i = 0; i < CNT; i++)
  {
    if (i % 2 == coef)
    {
      leds[i] = ColorFromPalette(currentPalette, random8(), currentBrightness, NOBLEND);
    }
    else
    {
      leds[i] = CRGB::Black;
    }
  }
}

void Pattern::noise(ECBArg a)
{
  for (int i = 0; i < CNT; i++)
  {                                                                               // Just ONE loop to fill up the LED array as all of the pixels change.
    uint8_t index = inoise8(i * currentScale, getTime() / 10 + i * currentScale); // Get a value from the noise function. I'm using both x and y axis.
    leds[i] = ColorFromPalette(currentPalette, index, 255, LINEARBLEND);          // With that value, look up the 8 bit colour palette value and assign it to the current LED.
  }
}

void Pattern::picker(ECBArg a)
{
  fill_solid(leds, CNT, ColorFromPalette(currentPalette, 0));
}
