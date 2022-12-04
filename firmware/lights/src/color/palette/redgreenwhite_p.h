
#ifndef COLOR_PALETTE_REDGREENWHITE_H_
#define COLOR_PALETTE_REDGREENWHITE_H_

#include <FastLED.h>

// A mostly red palette with green accents and white trim.
// "CRGB::Gray" is used as white to keep the brightness more uniform.
static const TProgmemRGBPalette16 RedGreenWhite_p FL_PROGMEM =
    {CRGB::Red, CRGB::Red, CRGB::Red, CRGB::Red,
     CRGB::Red, CRGB::Red, CRGB::Red, CRGB::Red,
     CRGB::Red, CRGB::Red, CRGB::Gray, CRGB::Gray,
     CRGB::Green, CRGB::Green, CRGB::Green, CRGB::Green};

#endif
