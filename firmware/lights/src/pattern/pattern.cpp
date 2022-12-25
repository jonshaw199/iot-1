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
  patternFnMap[PATTERN_EVERYOTHER] = everyother;
  patternFnMap[PATTERN_NOISE] = noise;
  patternFnMap[PATTERN_PICKER] = picker;
  patternFnMap[PATTERN_BREATHE] = breathe;
  patternFnMap[PATTERN_OPENCLOSE] = openClose;
  patternFnMap[PATTERN_RANDFILL] = randFill;
  patternFnMap[PATTERN_EVERYN] = everyN;
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

void Pattern::cbPattern()
{
  nblendPaletteTowardPalette(currentPalette, targetPalette, 48);
  curPatternFn();
  FastLED.show();
}

/*
 * Patterns
 */

void Pattern::beatwave()
{
  uint8_t wave = beatsin8(currentSpeed);

  for (int i = 0; i < CNT; i++)
  {
    leds[i] = ColorFromPalette(currentPalette, i + wave, currentBrightness, currentBlending);
  }
}

void Pattern::everyother()
{
  CRGB c1 = currentPalette[0];
  CRGB c2;
  for (uint8_t i = 1; i < 16; i++)
  {
    if (currentPalette[i] != c1)
    {
      c2 = currentPalette[i];
      break;
    }
    else if (i == 15)
    {
      c2 = currentPalette[0];
    }
  }

  uint8_t wave1 = beatsin8(currentSpeed * 2);
  uint8_t wave2 = 255 - wave1;
  for (int i = 0; i < CNT; i++)
  {
    if (i % 2)
    {
      CHSV c = rgb2hsv_approximate(c1);
      c.value = wave1;
      leds[i] = c;
    }
    else
    {
      CHSV c = rgb2hsv_approximate(c2);
      c.value = wave2;
      leds[i] = c;
    }
  }
}

void Pattern::noise()
{
  for (int i = 0; i < CNT; i++)
  {                                                                                        // Just ONE loop to fill up the LED array as all of the pixels change.
    uint8_t index = inoise8(i * currentScale, getTime() / 10 + i * currentScale);          // Get a value from the noise function. I'm using both x and y axis.
    leds[i] = ColorFromPalette(currentPalette, index, currentBrightness, currentBlending); // With that value, look up the 8 bit colour palette value and assign it to the current LED.
  }
}

void Pattern::picker()
{
  fill_solid(leds, CNT, ColorFromPalette(currentPalette, 0));
}

void Pattern::breathe()
{
  uint8_t b = beatsin8(currentSpeed * 3);
  fill_solid(leds, CNT, ColorFromPalette(currentPalette, 0, b));
}

void Pattern::openClose()
{
  int middle = CNT / 2;
  uint8_t b = beatsin8(currentSpeed);
  int len = b * CNT / 255;
  for (int i = 0; i < CNT; i++)
  {
    leds[i] = i >= middle - len && i <= middle + len ? ColorFromPalette(currentPalette, i, currentBrightness, currentBlending) : CRGB::Black;
  }
}

void Pattern::randFill()
{
  // 2 unique colors from palette if available
  CRGB c1 = currentPalette[0];
  CRGB c2;
  for (uint8_t i = 1; i < 16; i++)
  {
    if (currentPalette[i] != c1)
    {
      c2 = currentPalette[i];
      break;
    }
    else if (i == 15)
    {
      c2 = CRGB::Black;
    }
  }

  // init
  static std::vector<int> c1Vec;
  static std::vector<int> c2Vec;
  if (!c1Vec.size() && !c2Vec.size())
  {
    for (int i = 0; i < CNT; i++)
    {
      c1Vec.push_back(i);
    }
  }

  uint8_t b = beatsin8(currentSpeed / 10);
  float percent = (float)b / (float)255;
  int newNumC1 = (float)CNT * percent;
  int dif = newNumC1 - c1Vec.size();
  random16_set_seed(getTime());
  if (dif < 0)
  {
    // Move from c1 to c2
    for (int i = 0; i < abs(dif) && c1Vec.size(); i++)
    {
      int j = random8(c1Vec.size());
      int val = c1Vec[j];
      c2Vec.push_back(val);
      c1Vec.erase(c1Vec.begin() + j);
      leds[val] = c2;
    }
  }
  else if (dif > 0)
  {
    // Move from c2 to c1
    for (int i = 0; i < abs(dif) && c2Vec.size(); i++)
    {
      int j = random8(c2Vec.size());
      int val = c2Vec[j];
      c1Vec.push_back(val);
      c2Vec.erase(c2Vec.begin() + j);
      leds[val] = c1;
    }
  }
}

void Pattern::everyN()
{
  int speed = currentSpeed;
  int scale = currentScale;

  unsigned long time = getTime() / ((100 - std::max(speed, 1)) * 4);
  uint8_t offset = time % std::max(scale, 1) % CNT;
  for (int i = 0; i < CNT; i++)
  {
    if (i % std::max(scale, 1) == offset)
    {
      leds[i] = CRGB::White;
    }
    else
    {
      leds[i] = currentPalette[0];
    }
  }
}
