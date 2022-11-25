#ifndef STATEENT_PICKER_PICKER_H_
#define STATEENT_PICKER_PICKER_H_

#include <FastLED.h>

#include "stateEnt/pattern/pattern.h"

class Picker : public Pattern
{
  CRGB *leds;
  CHSV targetColor;
public:
  String getName();
  msg_handler getInboxHandler();
  void setup();
  void preStateChange(int s);
};

#endif