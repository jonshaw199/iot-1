
#ifndef COLOR_PALETTE_REDWHITE_H_
#define COLOR_PALETTE_REDWHITE_H_

#include <FastLED.h>

// A red and white striped palette
// "CRGB::Gray" is used as white to keep the brightness more uniform.
static const TProgmemRGBPalette16 RedWhite_p FL_PROGMEM =
    {CRGB::Red, CRGB::Red, CRGB::Red, CRGB::Red,
     CRGB::Gray, CRGB::Gray, CRGB::Gray, CRGB::Gray,
     CRGB::Red, CRGB::Red, CRGB::Red, CRGB::Red,
     CRGB::Gray, CRGB::Gray, CRGB::Gray, CRGB::Gray};

#endif
