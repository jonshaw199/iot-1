#ifndef STATEENT_PATTERN_PATTERN_H_
#define STATEENT_PATTERN_PATTERN_H_

#include "stateEnt/virtual/lightsBase/lightsBase.h"

#define CNT max(CNT_A, CNT_B)

class Pattern : public LightsBase
{
public:
  void preStateChange(int s);
};

#endif