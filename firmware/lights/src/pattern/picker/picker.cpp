#include "picker.h"

void Picker::loop()
{
  Pattern::loop();
  fill_solid(leds, CNT, ColorFromPalette(currentPalette, 0));
  FastLED.show();
}
