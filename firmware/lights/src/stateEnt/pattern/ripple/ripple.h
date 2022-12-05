#ifndef STATEENT_PATTERN_RIPPLE_RIPPLE_H
#define STATEENT_PATTERN_RIPPLE_RIPPLE_H

#include "stateEnt/virtual/lightsBase/lightsBase.h"

class Ripple : public LightsBase
{
  static uint8_t colour; // Ripple colour is randomized.
  static int center;     // Center of the current ripple.
  static int step;       // -1 is the initializing step.
  static uint8_t myfade; // Starting brightness.
  static uint8_t fadeval;
  static uint8_t bgcol; // Background colour rotates.
  static int thisdelay; // Standard delay value.

  static void ripple();

public:
  void setup();
};

#endif