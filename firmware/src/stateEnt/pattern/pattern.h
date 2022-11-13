#ifndef STATEENT_PATTERN_PATTERN_H_
#define STATEENT_PATTERN_PATTERN_H_

#include "stateEnt/virtual/lightShowBase/lightShowBase.h"

#define CNT max(CNT_A, CNT_B)

class Pattern : public LightShowBase
{
  void preStateChange(int s);
};

#endif