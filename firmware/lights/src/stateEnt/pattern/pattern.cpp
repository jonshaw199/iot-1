#include <FastLED.h>

#include "pattern.h"

void Pattern::preStateChange(int s)
{
  LightShowBase::preStateChange(s);
  // Turn off lights
#if CNT
  FastLED.showColor(CRGB::Black);
#endif
}