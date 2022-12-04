
#ifndef COLOR_PALETTE_SERENDIL_H_
#define COLOR_PALETTE_SERENDIL_H_

#include <FastLED.h>

// Gradient palette "serendil_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/serendil.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 24 bytes of program space.

static const TProgmemRGBGradientPalette_byte serendil_gp[] FL_PROGMEM = {
    0,   0, 55,  0,
  117,  61, 81,  9,
  137, 132, 86, 10,
  191, 215,221, 42,
  211, 237,112,184,
  255, 192, 19, 19};

#endif
