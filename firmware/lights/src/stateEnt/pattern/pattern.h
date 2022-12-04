#ifndef STATEENT_PATTERN_PATTERN_H_
#define STATEENT_PATTERN_PATTERN_H_

#include "stateEnt/virtual/lightsBase/lightsBase.h"

#define SECONDS_PER_PALETTE 20

class Pattern : public LightsBase
{
protected:
  static CRGBPalette16 currentPalette;
  static CRGBPalette16 targetPalette;
  static TBlendType currentBlending;
  static uint8_t currentBrightness;
  static const TProgmemRGBPalette16 *activePaletteList[];
  static uint8_t currentPaletteIndex;

  static void advanceTargetPalette();
};

#endif