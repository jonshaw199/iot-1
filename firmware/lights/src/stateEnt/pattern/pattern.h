#ifndef STATEENT_PATTERN_PATTERN_H_
#define STATEENT_PATTERN_PATTERN_H_

#include "stateEnt/virtual/lightsBase/lightsBase.h"

class Pattern : public LightsBase
{
protected:
  static CRGBPalette16 currentPalette;
  static CRGBPalette16 targetPalette;
  static TBlendType currentBlending;
};

#endif