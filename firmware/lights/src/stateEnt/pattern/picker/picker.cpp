#include "picker.h"

String Picker::getName()
{
  return "Picker";
}

void Picker::setup()
{
  LightsBase::setup();

  addEvent(Event(
      "Picker_UpdateLeds",
      [](ECBArg a)
      { 
        fill_solid(leds, CNT, ColorFromPalette(currentPalette, 0));
        FastLED.show(); },
      EVENT_TYPE_TEMP, 1));

  addEvent(Event(
      "Picker_Blend",
      [](ECBArg a)
      { nblendPaletteTowardPalette(currentPalette, targetPalette, 1); },
      EVENT_TYPE_TEMP, 10));
}
