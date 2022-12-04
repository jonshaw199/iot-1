#ifndef STATEENT_PICKER_PICKER_H_
#define STATEENT_PICKER_PICKER_H_

#include <FastLED.h>

#include "stateEnt/pattern/pattern.h"

class Picker : public Pattern
{
public:
  String getName();
  msg_handler getInboxHandler();
  void setup();
};

#endif