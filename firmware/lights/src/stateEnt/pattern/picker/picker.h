#ifndef STATEENT_PICKER_PICKER_H_
#define STATEENT_PICKER_PICKER_H_

#include <FastLED.h>

#include "stateEnt/virtual/lightsBase/lightsBase.h"

class Picker : public LightsBase
{
public:
  String getName();
  msg_handler getInboxHandler();
  void setup();
};

#endif