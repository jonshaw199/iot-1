#ifndef PATTERN_NOISE_NOISE_H_
#define PATTERN_NOISE_NOISE_H_

#include <FastLED.h>

#include "stateEnt/virtual/lightsBase/lightsBase.h"

class Noise : public LightsBase
{
  static uint8_t scale;

  static void fillNoise8();

public:
  void setup();
};

#endif