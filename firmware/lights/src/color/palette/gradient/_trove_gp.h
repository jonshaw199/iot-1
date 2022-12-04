
// Warning: too many control points

#ifndef COLOR_PALETTE_TROVE_H_
#define COLOR_PALETTE_TROVE_H_

#include <FastLED.h>

// Gradient palette "trove_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/trove.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 84 bytes of program space.

static const TProgmemRGBGradientPalette_byte trove_gp[] FL_PROGMEM = {
    0,  12, 23, 11,
   12,   8, 52, 27,
   25,  32,142, 64,
   38,  55, 68, 30,
   51, 190,135, 45,
   63, 201,175, 59,
   76, 186, 80, 20,
   89, 220, 79, 32,
  101, 184, 33, 14,
  114, 137, 16, 15,
  127, 118, 20, 27,
  140,  79, 16, 35,
  153,  67,  8, 26,
  165,  22,  9, 42,
  178,  11,  3, 34,
  191,  58, 31,109,
  204, 186, 49, 83,
  216, 182, 25, 55,
  229,  39, 90,100,
  242,  15, 81,132,
  255,  68,135, 52};

#endif

