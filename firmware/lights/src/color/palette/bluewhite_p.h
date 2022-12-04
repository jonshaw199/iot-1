
#ifndef COLOR_PALETTE_BLUEWHITE_H_
#define COLOR_PALETTE_BLUEWHITE_H_

#include <FastLED.h>

// A mostly blue palette with white accents.
// "CRGB::Gray" is used as white to keep the brightness more uniform.
static const TProgmemRGBPalette16 BlueWhite_p FL_PROGMEM =
    {CRGB::Blue, CRGB::Blue, CRGB::Blue, CRGB::Blue,
     CRGB::Blue, CRGB::Blue, CRGB::Blue, CRGB::Blue,
     CRGB::Blue, CRGB::Blue, CRGB::Blue, CRGB::Blue,
     CRGB::Blue, CRGB::Gray, CRGB::Gray, CRGB::Gray};

#endif
