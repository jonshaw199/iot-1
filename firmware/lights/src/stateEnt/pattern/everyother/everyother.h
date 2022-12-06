#ifndef STATEENT_PATTERN_EVERYOTHER_EVERYOTHER_H_
#define STATEENT_PATTERN_EVERYOTHER_EVERYOTHER_H_

#include "stateEnt/virtual/lightsBase/lightsBase.h"

class EveryOther : public LightsBase
{
  static uint8_t coef;
  static void everyOther();

public:
  void setup();
};

#endif